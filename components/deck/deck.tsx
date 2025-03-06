import { Dimensions, Text, View } from "react-native";
import React, { forwardRef, useCallback, useContext } from "react";
import { Button, Stack } from "tamagui";
import useGameStore from "@/stores/game.store";
import * as Haptics from "expo-haptics";
import { Sounds } from "@/stores/SoundProvider";
import getCardDimension from "@/utils/getCardDimension";
import { Card } from "../types";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";

const cardDimensions = getCardDimension();

function hasThreeOfAKind(cardList: Card[]) {
  const valueCountMap = cardList.reduce((acc: any, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {});

  return Object.values(valueCountMap).some((count) => count === 3);
}

function isSequential(cardList: Card[]) {
  // ...existing function
}

function canStillPlay(cardsInHand: Card[]) {
  // ...existing function
}

const Deck = forwardRef((props: any, ref: any) => {
  const {
    drawCard,
    cardsInDeck,
    calculatePoint,
    setGamePhase,
    cardsInHand,
    cardsOnBoard,
    removeFromBoard,
  } = useGameStore();
  const { playSound } = useContext(Sounds)!;

  // ...existing effects

  const handleDraw = () => {
    // ...existing handleDraw function
  };

  return (
    <Stack alignContent="center" justifyContent="center" gap={"$3"}>
      <Text
        style={{
          color: "white",
          fontFamily: "TrenchThin",
          letterSpacing: 4,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        DRAW
      </Text>

      <Button
        backgroundColor={"rgba(0, 0, 0, 0.5)"}
        ref={ref}
        onPress={handleDraw}
        width={cardDimensions.cardWidth}
        height={cardDimensions.cardHeight}
        padding={0}
        borderRadius={0}
        position="relative"
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontFamily: "TrenchThin",
              color: "white",
              fontSize: Dimensions.get("window").width * 0.04,
            }}
          >
            {useGameStore.getState().cardsInDeck.length}
          </Text>

          {/* Add corners */}
          <TopLeft size={16} variant="box" color="white" strokeWidth={2} />
          <TopRight size={16} variant="box" color="white" strokeWidth={2} />
          <BottomLeft size={16} variant="box" color="white" strokeWidth={2} />
          <BottomRight size={16} variant="box" color="white" strokeWidth={2} />
        </View>
      </Button>
    </Stack>
  );
});

export default Deck;
