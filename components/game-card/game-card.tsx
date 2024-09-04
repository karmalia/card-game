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
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Card, TPos } from "../types";
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
  deckPosition: TPos;
};

const GameCard = ({ card, deckPosition }: GameCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [cardPos, setCardPos] = useState({
    top: deckPosition.pageY,
    left: deckPosition.pageX,
  });

  console.log("cardPos", cardPos);

  const { playCard, trashCanPosition, topSlotsPositions } = useGameStore();
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
      if (
        event.absoluteY > middleCenterY &&
        event.absoluteY < topSlotsPositions[1].pageY
      ) {
        // The card is in the middle section - play the card
        const firstEmptySlot = Object.values(topSlotsPositions).find(
          (slot) => !slot.isActive
        );
        if (firstEmptySlot) {
          translateX.value = withSpring(
            firstEmptySlot.pageX - deckPosition.pageX
          );
          translateY.value = withSpring(
            firstEmptySlot.pageY - deckPosition.pageY
          );
          // playCard(card.id, firstEmptySlot);
        }
      } else if (
        event.absoluteX > trashCanPosition.pageX &&
        event.absoluteY > trashCanPosition.pageY
      ) {
        // Handle trash can logic
        translateX.value = withSpring(trashCanPosition.pageX);
        translateY.value = withSpring(trashCanPosition.pageY);
        // Implement your delete logic here
      } else {
        // Snap back to original position if not in a valid drop zone
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const CardAnimationStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  useEffect(() => {
    function fix(val: any) {
      setTimeout(() => {
        setCardPos(val);
      }, 1000);
    }
    function startAnimation() {
      translateX.value = withSpring(card.endingPos.pageX - deckPosition.pageX);

      translateY.value = withSpring(
        card.endingPos.pageY - deckPosition.pageY,
        undefined,
        () => {
          runOnJS(fix)({
            top: card.endingPos.pageY,
            left: card.endingPos.pageX,
          });
        }
      );
      runOnUI(() => {
        translateX.value = withTiming(0, {
          duration: 1000,
        });
        translateY.value = withTiming(0, {
          duration: 1000,
        });
      })();
    }
    startAnimation();
  }, []);

  return (
    <GestureDetector gesture={drag}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: cardPos.top,
            left: cardPos.left,
          },
          CardAnimationStyles,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("isPlayed", card.isPlayed);
            if (playCard && !card.isPlayed) {
              console.log("Test");
              playCard(card.id);
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
