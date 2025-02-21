import { Dimensions, ImageBackground, Text } from "react-native";
import React, { forwardRef, useCallback, useContext } from "react";
import { Button, Stack } from "tamagui";
import useGameStore from "@/stores/game.store";
import * as Haptics from "expo-haptics";
import { Sounds } from "@/stores/SoundProvider";
import getCardDimension from "@/utils/getCardDimension";
import { Card } from "../types";

const cardDimensions = getCardDimension();

function hasThreeOfAKind(cardList: Card[]) {
  const valueCountMap = cardList.reduce((acc: any, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {});

  return Object.values(valueCountMap).some((count) => count === 3);
}
function isSequential(cardList: Card[]) {
  if (cardList.length < 3) return false;
  const uniqueValues = Array.from(new Set(cardList.map((card) => card.value)));
  const sortedValues = uniqueValues.map((value) => value).sort((a, b) => a - b);

  let result = false;
  cardList.forEach((_, index) => {
    if (
      sortedValues[index] + 1 === sortedValues[index + 1] &&
      sortedValues[index] + 2 === sortedValues[index + 2]
    ) {
      result = true;
    }
  });

  return result || false;
}

function canStillPlay(cardsInHand: Card[]) {
  const sequential = isSequential(cardsInHand);
  const threeOfAKind = hasThreeOfAKind(cardsInHand);
  return sequential || threeOfAKind ? true : false;
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
  React.useEffect(() => {
    console.log("masadaki sayı değiti , render");
    if (cardsOnBoard.length === 3) {
      const serialized = isSequential(cardsOnBoard);
      const hasSameValue = cardsOnBoard.every(
        (item) => item.value === cardsOnBoard[0].value
      );
      const hasSameColor = cardsOnBoard.every(
        (item) => item.color === cardsOnBoard[0].color
      );
      const totalValue = cardsOnBoard.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);

      if (serialized || hasSameValue) {
        calculatePoint(serialized, hasSameValue, hasSameColor, totalValue);
        if (serialized && hasSameColor) {
          playSound("pointTwo");
        } else {
          playSound("pointOne");
        }
        if (cardsInDeck.length == 0 && cardsInHand.length <= 2) {
          setGamePhase(3);
        }
      }
    }
  }, [cardsOnBoard.length]);

  React.useEffect(() => {
    if (cardsInDeck.length === 0) {
      const canContinue = canStillPlay([...cardsInHand, ...cardsOnBoard]);
      if (!canContinue) setGamePhase(3);
    }
  }, [cardsInHand.length]);
  //RemoveFromBoard yapıldığında bile stale data bottomSlots kullanıyor.
  //RemoveFromBaord yapıldığında findFirstBottomEmptySlot must be find the latest state.

  const handleDraw = () => {
    const totalCardOnGame = cardsInHand.length + cardsOnBoard.length;

    //Eğer adam draw yaptığında boardda kart varsa ilk önnce boarddaki kartlar yerine döner, sonra kart çekilir

    if (totalCardOnGame == 5 || cardsInDeck.length === 0) return;

    //Burada retreat action yapılacak.

    if (cardsOnBoard.length > 0) {
      cardsOnBoard.forEach((card) => removeFromBoard(card));
    }

    const updatedBottomSlotPositions =
      useGameStore.getState().bottomSlotPositions;

    const findFirstBottomEmptySlot = updatedBottomSlotPositions.find(
      (slot) => !slot.isActive
    );

    if (findFirstBottomEmptySlot) {
      drawCard(findFirstBottomEmptySlot);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      playSound("draw");
    }
  };

  return (
    <Stack alignContent="center" justifyContent="center" gap={"$3"}>
      <Text
        style={{
          color: "white",
          fontFamily: "DragonSlayer",
          letterSpacing: 4,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        DRAW
      </Text>

      <Button
        backgroundColor={"transparent"}
        ref={ref}
        onPress={handleDraw}
        width={cardDimensions.cardWidth}
        height={cardDimensions.cardHeight}
        padding={0}
        borderRadius={0}
      >
        <ImageBackground
          source={require("@/assets/card-backgrounds/TrashCardOpacity.png")}
          resizeMode="stretch"
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "DragonSlayer",
              color: "white",
              fontSize: Dimensions.get("window").width * 0.04,
            }}
          >
            {useGameStore.getState().cardsInDeck.length}
          </Text>
        </ImageBackground>
      </Button>
    </Stack>
  );
});

export default Deck;
