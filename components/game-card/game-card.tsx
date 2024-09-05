import { Dimensions, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { View, Text, styled } from "tamagui";
import useGameStore from "@/stores/game.store";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ArraySlots, Card, TPos, TSlotPos } from "../types";
const StyledCard = styled(View, {
  name: "GameCard",
  variants: {
    red: {
      true: {
        backgroundColor: "$cardRed",
      },
    },
    yellow: {
      true: {
        backgroundColor: "$cardYellow",
      },
    },
    blue: {
      true: {
        backgroundColor: "$cardBlue",
      },
    },

    centered: {
      true: {
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  height: "$11",
  width: "$8",
  borderRadius: "$2",
});

const CardNumber = styled(Text, {
  name: "CardNumber",
  fontSize: "$12",
  color: "$cardText",
});

type GameCardProps = {
  card: Card;
  startingPosition: TPos;
  endingPosition: TPos | null;
  topSlotPositions: ArraySlots;
  bottomSlotPositions: ArraySlots;
  firstTopEmptySlot: TSlotPos | null;
  firstBottomEmptySlot: TSlotPos | null;
  gamePhase: number;
};

const GameCard = ({
  card,
  startingPosition,
  endingPosition,
  topSlotPositions,
  bottomSlotPositions,
  firstTopEmptySlot,
  firstBottomEmptySlot,
  gamePhase,
}: GameCardProps) => {
  const springConfig = {
    duration: 201,
    dampingRatio: 2.1,
    stiffness: 427,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    reduceMotion: ReduceMotion.System,
  };

  console.log("FirstBottomEmptySlot", firstBottomEmptySlot);

  console.log(
    "game-card:95 topSlotsSpaces",
    topSlotPositions.map((slot) => slot.isActive)
  );
  console.log(
    "game-card:99 bottomSlotsSpaces",
    bottomSlotPositions.map((slot) => slot.isActive)
  );

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const sharedCard = useSharedValue(card);
  const { placeOnBoard, removeFromBoard, trashCanPosition, setGamePhase } =
    useGameStore();
  const sharedCardLocation = useSharedValue({
    pageX: startingPosition?.pageX || 0,
    pageY: startingPosition?.pageY || 0,
  });

  const sharedTopFirstEmptySlot = useSharedValue<TSlotPos | null>(
    firstTopEmptySlot ? JSON.parse(JSON.stringify(firstTopEmptySlot)) : null
  );

  const sharedBottomFirstEmptySlot = useSharedValue<TSlotPos | null>(
    firstBottomEmptySlot
      ? JSON.parse(JSON.stringify(firstBottomEmptySlot))
      : null
  );

  useEffect(() => {
    if (firstTopEmptySlot) {
      sharedTopFirstEmptySlot.value = JSON.parse(
        JSON.stringify(firstTopEmptySlot)
      );
    } else {
      sharedTopFirstEmptySlot.value = null;
    }
  }, [firstTopEmptySlot]);

  useEffect(() => {
    if (firstBottomEmptySlot) {
      sharedBottomFirstEmptySlot.value = JSON.parse(
        JSON.stringify(firstBottomEmptySlot)
      );
    } else {
      sharedBottomFirstEmptySlot.value = null;
    }
  }, [firstBottomEmptySlot]);

  useEffect(() => {
    sharedCard.value = card;
  }, [card.isPlayed]);

  const middleCenterY = Dimensions.get("screen").height / 2;
  const drag = Gesture.Pan()
    .onStart((event) => {
      event.x = translateX.value;
      event.y = translateY.value;
    })
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      console.log("");
      if (event.absoluteY < middleCenterY) {
        // The card is in the middle section - play the card
        try {
          //useShared or derived value might work
          console.log("Test1", sharedTopFirstEmptySlot.value);

          if (sharedTopFirstEmptySlot.value) {
            console.log("Test 2");
            const targetX =
              sharedTopFirstEmptySlot.value.pageX -
              sharedCardLocation.value.pageX;
            const targetY =
              sharedTopFirstEmptySlot.value.pageY -
              sharedCardLocation.value.pageY;

            translateX.value = withSpring(targetX, springConfig);
            translateY.value = withSpring(targetY, springConfig, () => {
              runOnJS(placeOnBoard)(
                sharedCard.value.id,
                sharedTopFirstEmptySlot.value!
              );
            });
          } else {
            translateX.value = withSpring(0, springConfig);
            translateY.value = withSpring(0, springConfig);
          }
        } catch (error) {
          console.log("Test");
          console.log("Error", error.message);
        }
      } else if (
        event.absoluteX > trashCanPosition.pageX &&
        event.absoluteY > trashCanPosition.pageY
      ) {
        translateX.value = withSpring(trashCanPosition.pageX);
        translateY.value = withSpring(trashCanPosition.pageY);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onTouchesDown(() => {
    try {
      //useShared or derived value might work
      console.log("tap Test1");

      if (sharedBottomFirstEmptySlot.value) {
        const targetX =
          sharedBottomFirstEmptySlot.value.pageX -
          sharedCardLocation.value.pageX;
        const targetY =
          sharedBottomFirstEmptySlot.value.pageY -
          sharedCardLocation.value.pageY;

        translateX.value = withSpring(targetX, springConfig);
        translateY.value = withSpring(targetY, springConfig, () => {
          runOnJS(removeFromBoard)(
            sharedCard.value.id,
            sharedBottomFirstEmptySlot.value!
          );
        });
      } else {
        translateX.value = withSpring(0, springConfig);
        translateY.value = withSpring(0, springConfig);
      }
    } catch (error) {
      console.log("Test");
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
    if (endingPosition !== null && endingPosition !== null && gamePhase !== 2)
      startAnimation();
    function startAnimation() {
      translateX.value = withSpring(
        // @ts-ignore
        endingPosition.pageX - sharedCardLocation.value.pageX,
        springConfig
      );
      translateY.value = withSpring(
        // @ts-ignore
        endingPosition.pageY - sharedCardLocation.value.pageY,
        springConfig,
        () => {
          runOnJS(setGamePhase)(2);
        }
      );
    }
  }, []);

  return (
    <GestureDetector gesture={card.isPlayed ? tap : drag}>
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
            console.log("Card", card.isPlayed);
            if (sharedCard.value.isPlayed) {
              console.log("Card", card);
              console.log(
                "Kart Board'da, geri çekilecek",
                sharedCard.value.isPlayed
              );
            } else {
              console.log("Card", card);
              console.log("Kart elde", sharedCard.value.isPlayed);
            }
          }}
        >
          <StyledCard
            red={card.color === "red"}
            blue={card.color === "blue"}
            yellow={card.color === "yellow"}
            centered
          >
            <CardNumber>{card.value || 0}</CardNumber>
          </StyledCard>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default GameCard;

const styles = StyleSheet.create({});
