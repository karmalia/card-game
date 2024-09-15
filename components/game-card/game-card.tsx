import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { View, Text, styled } from "tamagui";
import useGameStore from "@/stores/game.store";
import * as Haptics from "expo-haptics";
import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Card, TPos, TSlotPos } from "../types";
import usePlaySound from "@/utils/hooks/usePlaySound";

const StyledCard = styled(View, {
  name: "GameCard",

  height: "$11",
  width: "$8",
  borderRadius: "$2",
  overflow: "hidden",
});

const part = Dimensions.get("screen").height / 3;
const middleCenterY = part * 2;

const CardNumber = styled(Text, {
  name: "CardNumber",
  fontSize: "$12",
  color: "$cardText",
  fontFamily: "DragonSlayer",
});

type GameCardProps = {
  card: Card;
  startingPosition: TPos;
  endingPosition: TPos | null;
};

const springConfig = {
  duration: 201,
  dampingRatio: 2.1,
  stiffness: 427,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  reduceMotion: ReduceMotion.System,
};

const GameCard = ({
  card,
  startingPosition,
  endingPosition,
}: GameCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const { playDelete, playPutOn, playPullBack } = usePlaySound();

  const [broken, setBroken] = useState(false);

  const [cardState, setCardState] = useState(card);

  const sharedCard = useSharedValue({
    ...cardState,
    slot: {
      slotId: cardState.slot.slotId,
      pageX: cardState.slot.pageX,
      pageY: cardState.slot.pageY,
    },
    destinationSlot:
      cardState.destinationSlot !== null
        ? {
            slotId: cardState.destinationSlot.slotId,
            pageX: cardState.destinationSlot.pageX,
            pageY: cardState.destinationSlot.pageY,
          }
        : null,
  });

  const {
    placeOnBoard,
    removeFromBoard,
    trashCanPosition,
    gamePhase,
    topSlotPositions,
    bottomSlotPositions,
    cardsOnBoard,
    cardsInHand,
    discardCard,
  } = useGameStore();

  useEffect(() => {
    if (!card.isPlayed) {
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [card.isPlayed]);

  const sharedCardLocation = useSharedValue({
    pageX: startingPosition?.pageX || 0,
    pageY: startingPosition?.pageY || 0,
  });

  const sharedTopFirstEmptySlot = useSharedValue<TSlotPos | null>(null);

  useEffect(() => {
    if (topSlotPositions.length) {
      const emptySlot = topSlotPositions.find((slot) => !slot.isActive);
      sharedTopFirstEmptySlot.value = emptySlot
        ? JSON.parse(
            JSON.stringify(topSlotPositions.find((slot) => !slot.isActive))
          )
        : null;
    } else {
      sharedTopFirstEmptySlot.value = null;
    }
  }, [topSlotPositions]);

  useEffect(() => {
    // Keep sharedCard in sync with cardState whenever cardState changes
    sharedCard.value = {
      ...cardState,
      slot: {
        slotId: cardState.slot.slotId,
        pageX: cardState.slot.pageX,
        pageY: cardState.slot.pageY,
      },
      destinationSlot:
        cardState.destinationSlot !== null
          ? {
              slotId: cardState.destinationSlot.slotId,
              pageX: cardState.destinationSlot.pageX,
              pageY: cardState.destinationSlot.pageY,
            }
          : null,
    };
  }, [cardState]);
  const drag = Gesture.Pan()
    .onStart((event) => {
      console.log("DragStart");
      event.x = translateX.value;
      event.y = translateY.value;
    })
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      if (
        event.absoluteX > trashCanPosition.pageX &&
        event.absoluteY > trashCanPosition.pageY
      ) {
        runOnJS(setBroken)(true);
      } else {
        runOnJS(setBroken)(false);
      }
    })
    .onEnd((event) => {
      console.log("DragEnd");
      if (event.absoluteY < middleCenterY) {
        console.log("event.absoluteY", event.absoluteY),
          console.log("middleCenterY", middleCenterY);
        try {
          if (sharedTopFirstEmptySlot.value) {
            const targetX =
              sharedTopFirstEmptySlot.value.pageX -
              sharedCardLocation.value.pageX;
            const targetY =
              sharedTopFirstEmptySlot.value.pageY -
              sharedCardLocation.value.pageY;
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
            runOnJS(playPutOn)();
            sharedCard.value.isPlayed = true;
            translateX.value = withSpring(targetX, springConfig);
            translateY.value = withSpring(targetY, springConfig, () => {
              runOnJS(placeOnBoard)(sharedCard.value);
            });
          } else {
            translateX.value = withSpring(0, springConfig);
            translateY.value = withSpring(0, springConfig);
          }
        } catch (error) {
          console.log("Error during drag end:", error.message);
        }
      } else if (
        event.absoluteX > trashCanPosition.pageX &&
        event.absoluteY > trashCanPosition.pageY
      ) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(playDelete)();
        translateX.value = withSpring(trashCanPosition.pageX, springConfig);
        translateY.value = withSpring(
          trashCanPosition.pageY,
          springConfig,
          () => {
            runOnJS(discardCard)(sharedCard.value);
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onStart(() => {
    try {
      if (sharedCard.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(playPullBack)();
        sharedCard.value.isPlayed = false;
        translateX.value = withSpring(0, springConfig);
        translateY.value = withSpring(0, springConfig, () => {
          runOnJS(removeFromBoard)(sharedCard.value);
        });
      } else {
        translateX.value = withSpring(0, springConfig);
        translateY.value = withSpring(0, springConfig);
      }
    } catch (error) {
      console.log("Tap error:", error.message);
    }
  });

  const CardAnimationStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value || 0 },
        { translateY: translateY.value || 0 },
      ],
      top: sharedCardLocation.value.pageY || 0,
      left: sharedCardLocation.value.pageX || 0,
    };
  });

  useEffect(() => {
    const allCards = [...cardsOnBoard, ...cardsInHand];
    const findOnTop = cardsOnBoard.find((c) => c.id === cardState.id);
    const findCard = allCards.find((c) => c.id === cardState.id);

    if (findCard && findCard.destinationSlot) {
      // Update cardState in JS thread when the destinationSlot changes
      setCardState((prev) => ({
        ...prev,
        isPlayed: findOnTop ? true : false,
        destinationSlot: findCard.destinationSlot,
      }));
    }
  }, [cardsOnBoard, cardsInHand]);

  //Starts at phase one
  useEffect(() => {
    function startAnimation() {
      translateX.value = withSpring(
        endingPosition!.pageX - sharedCardLocation.value.pageX,
        springConfig
      );
      translateY.value = withSpring(
        endingPosition!.pageY - sharedCardLocation.value.pageY,
        springConfig
      );
    }
    if (endingPosition !== null && gamePhase === 1) {
      startAnimation();
    }
  }, []);

  const bg = {
    red: require("@/assets/card-backgrounds/CostimizedRedOne.png"),
    blue: require("@/assets/card-backgrounds/CostimizedBlueOne.png"),
    yellow: require("@/assets/card-backgrounds/CostimizedYellowOne.png"),
  };

  return (
    <GestureDetector gesture={sharedCard.value.isPlayed ? tap : drag}>
      <Animated.View
        style={[
          {
            position: "absolute",
          },
          CardAnimationStyles,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            console.log(
              "Card pressed:",
              sharedCard.value.isPlayed ? "Board" : "Hand"
            );
          }}
          touchSoundDisabled
          activeOpacity={1}
        >
          <StyledCard>
            <ImageBackground
              source={bg[card.color]}
              resizeMode="cover"
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <ImageBackground
                source={
                  broken
                    ? require("@/assets/card-backgrounds/TrashCard2.png")
                    : ""
                }
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardNumber>{card.value || 0}</CardNumber>
              </ImageBackground>
            </ImageBackground>
          </StyledCard>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default GameCard;
