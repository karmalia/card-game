import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, styled, Stack } from "tamagui";
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
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Card, TPos, TSlotPos } from "../types";
import { TapGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture";
import { PanGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture";
import { set } from "@react-native-firebase/database";
import { Sounds } from "@/stores/SoundProvider";
import getCardDimension from "@/utils/getCardDimension";

const part = Dimensions.get("screen").height / 3;
const middleCenterY = part * 2;

type GameCardProps = {
  card: Card;
  startingPosition: TPos;
  endingPosition: TPos | null;
  sharedAnimatedCard: SharedValue<string | null>;
  sharedDirective: SharedValue<"none" | "play" | "delete">;
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

const bg = {
  red: require("@/assets/card-backgrounds/RedBgOpacity2.png"),
  blue: require("@/assets/card-backgrounds/BlueBgOpacity2.png"),
  yellow: require("@/assets/card-backgrounds/YellowBgOpacity2.png"),
};

const cardDimensions = getCardDimension();

const StyledCard = styled(View, {
  name: "GameCard",
  height: cardDimensions.cardHeight,
  width: cardDimensions.cardWidth,
  overflow: "hidden",
});

const CardNumber = styled(Text, {
  name: "CardNumber",
  fontSize: Dimensions.get("screen").width * 0.07,
  color: "$cardText",
  fontFamily: "DragonSlayer",
  zIndex: 99999,
});

const GameCard = ({
  card,
  startingPosition,
  endingPosition,
  sharedAnimatedCard,
  sharedDirective,
}: GameCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const { playDelete, playPutOn, playPullBack, playClickTwo } =
    useContext(Sounds)!;

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
      if (!sharedAnimatedCard.value)
        sharedAnimatedCard.value = sharedCard.value.id;
      event.x = translateX.value;
      event.y = translateY.value;
    })
    .onChange((event) => {
      if (sharedAnimatedCard.value !== sharedCard.value.id) return;

      translateX.value = event.translationX;
      translateY.value = event.translationY;
      if (event.absoluteX > trashCanPosition.pageX) {
        sharedDirective.value = "delete";
      } else if (event.absoluteY < middleCenterY) {
        sharedDirective.value = "play";
      } else {
        sharedDirective.value = "none";
      }
    })
    .onEnd((event) => {
      sharedDirective.value = "none";
      if (sharedAnimatedCard.value !== sharedCard.value.id) {
        translateX.value = 0;
        translateY.value = 0;
      } else {
        if (event.absoluteX > trashCanPosition.pageX) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          runOnJS(playDelete)();
          translateX.value = withSpring(trashCanPosition.pageX, springConfig);
          translateY.value = withSpring(
            trashCanPosition.pageY,
            springConfig,
            () => {
              runOnJS(discardCard)(sharedCard.value);
              sharedAnimatedCard.value = null;
            }
          );
        } else if (event.absoluteY < middleCenterY) {
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
              sharedAnimatedCard.value = null;
            });
          } else {
            translateX.value = 0;
            translateY.value = 0;
            sharedAnimatedCard.value = null;
          }
        } else {
          translateX.value = 0;
          translateY.value = 0;
          sharedAnimatedCard.value = null;
        }
      }
    });

  const tap = Gesture.Tap().onStart(() => {
    try {
      if (sharedCard.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(playClickTwo)();
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

  return (
    <GesturedCard
      {...{
        card,
        CardAnimationStyles,
        sharedCard,
        tap,
        drag,
        sharedAnimatedCard,
      }}
    />
  );
};

const GesturedCard = ({
  card,
  CardAnimationStyles,
  sharedCard,
  tap,
  drag,
}: {
  card: Card;
  CardAnimationStyles: any;
  sharedCard: any;
  tap: TapGesture;
  drag: PanGesture;
}) => {
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
        <TouchableOpacity touchSoundDisabled activeOpacity={1}>
          <StyledCard>
            <ImageBackground
              source={bg[card.color.name]}
              resizeMode="stretch"
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardNumber>{card.value || 0}</CardNumber>
            </ImageBackground>
          </StyledCard>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default GameCard;
