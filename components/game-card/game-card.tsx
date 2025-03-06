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
import useGameScoreStore from "@/stores/game-score.store";
import useOverlayStore from "@/stores/overlay.store";
import DirectionOverlay, {
  EDirective,
} from "../render-cards/DirectionOverlay/direction-overlay";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";

const part = Dimensions.get("screen").height / 3;
const middleCenterY = part * 2;

type GameCardProps = {
  card: Card;
  startingPosition: TPos;
  endingPosition: TPos | null;
  sharedAnimatedCard: SharedValue<Card | null>;
  sharedTopFirstEmptySlot: SharedValue<TSlotPos | null>;

  index: number;
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
  fontSize: 80,
  color: "$cardText",
  padding: 12,

  textAlign: "center",

  fontFamily: "TrenchThin",
});

const GameCard = ({
  card,
  startingPosition,
  endingPosition,
  sharedAnimatedCard,
  sharedTopFirstEmptySlot,

  index,
}: GameCardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const sharedDirective = useSharedValue<keyof typeof EDirective>("none");
  const { playSound } = useContext(Sounds)!;

  const [cardState, setCardState] = useState<Card>(card);

  const sharedCard = useSharedValue({
    ...cardState,
    slot: {
      slotId: cardState.slot.slotId,
      pageX: cardState.slot.pageX,
      pageY: cardState.slot.pageY,
      reservedBy: cardState.slot.reservedBy,
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
    cardsOnBoard,
    cardsInHand,
    discardCard,
    gamePhase,
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

  useEffect(() => {
    // Keep sharedCard in sync with cardState whenever cardState changes
    sharedCard.value = {
      ...cardState,
      slot: {
        slotId: cardState.slot.slotId,
        pageX: cardState.slot.pageX,
        pageY: cardState.slot.pageY,
        reservedBy: cardState.slot.reservedBy,
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
      if (!sharedAnimatedCard.value && sharedTopFirstEmptySlot.value) {
        sharedAnimatedCard.value = sharedCard.value;
        sharedTopFirstEmptySlot.value.reservedBy = sharedCard.value.id;
        return;
      }

      event.x = translateX.value;
      event.y = translateY.value;
    })
    .onChange((event) => {
      if (
        sharedAnimatedCard.value &&
        sharedTopFirstEmptySlot?.value?.reservedBy === sharedCard.value.id
      ) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
      if (event.absoluteX > trashCanPosition.pageX) {
        console.log("delete");
        sharedDirective.value = "delete";
      } else if (event.absoluteY < middleCenterY) {
        console.log("play");
        sharedTopFirstEmptySlot.value?.reservedBy === sharedCard.value.id;
        sharedDirective.value = "play";
      } else {
        console.log("none");
        sharedDirective.value = "none";
      }
    })
    .onEnd((event) => {
      const goTrash = event.absoluteX > trashCanPosition.pageX;
      const goPlay = event.absoluteY < middleCenterY;

      if (
        sharedAnimatedCard.value &&
        sharedAnimatedCard.value.id !== sharedCard.value.id
      ) {
        translateX.value = 0;
        translateY.value = 0;
      } else {
        if (goTrash) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          runOnJS(playSound)("deleteCard");
          runOnJS(discardCard)(sharedCard.value);
          sharedAnimatedCard.value = null;

          translateX.value = withSpring(trashCanPosition.pageX, springConfig);
          translateY.value = withSpring(trashCanPosition.pageY, springConfig);
          return;
        }

        if (goPlay) {
          if (
            sharedTopFirstEmptySlot.value?.reservedBy === sharedCard.value.id
          ) {
            const targetX =
              sharedTopFirstEmptySlot.value.pageX -
              sharedCardLocation.value.pageX;
            const targetY =
              sharedTopFirstEmptySlot.value.pageY -
              sharedCardLocation.value.pageY;
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
            runOnJS(playSound)("putOn");
            sharedCard.value.isPlayed = true;
            runOnJS(placeOnBoard)(sharedCard.value);

            translateX.value = withSpring(targetX, springConfig);
            translateY.value = withSpring(targetY, springConfig, () => {
              sharedAnimatedCard.value = null;
            });
            return;
          }
        }

        translateX.value = 0;
        translateY.value = 0;
        sharedAnimatedCard.value = null;
      }
    });

  const tap = Gesture.Tap().onStart(() => {
    try {
      if (sharedCard.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(playSound)("clickSoundTwo");
        sharedCard.value.isPlayed = false;
        runOnJS(removeFromBoard)(sharedCard.value);
        translateX.value = withSpring(0, springConfig);
        translateY.value = withSpring(0, springConfig);
      }
    } catch (error) {
      console.log("Tap error:", error?.message);
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
    <React.Fragment>
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
      {index == 0 && <DirectionOverlay sharedDirective={sharedDirective} />}
    </React.Fragment>
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
  const cardColor = {
    red: "#8B0000",
    blue: "#000080",
    yellow: "#8B8000",
  };

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
        <TouchableOpacity touchSoundDisabled activeOpacity={1}>
          <StyledCard
            style={{
              backgroundColor: `${cardColor[card.color.name]}80`, // 80 adds transparency
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardNumber>{card.value || 0}</CardNumber>

            {/* Add corners */}
            <TopLeft size={32} variant="edged" color="white" strokeWidth={1} />
            <TopRight size={32} variant="edged" color="white" strokeWidth={1} />
            <BottomLeft
              size={32}
              variant="edged"
              color="white"
              strokeWidth={1}
            />
            <BottomRight
              size={32}
              variant="edged"
              color="white"
              strokeWidth={1}
            />
          </StyledCard>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

GameCard.displayName = "GameCard";
GesturedCard.displayName = "GesturedCard";
export default GameCard;
