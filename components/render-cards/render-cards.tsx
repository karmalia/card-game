import React, { useState } from "react";
import useGameStore from "@/stores/game.store";
import GameCard from "../game-card/game-card";
import { Card } from "../types";
import { fillPlayersHand } from "../../utils";
import GameOverModal from "../modals/gameover/game-over-modal";
import { useSharedValue } from "react-native-reanimated";
import { View } from "tamagui";

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

const RenderCards = () => {
  const sharedAnimatedCard = useSharedValue(null);
  const {
    gamePhase,
    cardsOnBoard,
    deckPosition,
    cardsInDeck,
    bottomSlotPositions,
    cardsOnGame,
    setGamePhase,
    drawCard,
    calculatePoint,
    cardsInHand,
    populateDeck,
  } = useGameStore();

  React.useEffect(() => {
    async function startGame() {
      if (bottomSlotPositions.length > 0 && gamePhase == 1) {
        const result = await fillPlayersHand(drawCard, bottomSlotPositions);
        if (result) {
          setTimeout(() => {
            setGamePhase(2);
          }, 300);
        }
      }
    }

    if (gamePhase === 1) {
      startGame();
    }
  }, [gamePhase]); // Start the game after gamePhase is set to 1

  React.useEffect(() => {
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

  function restartGame() {
    populateDeck();
    setGamePhase(1);
  }

  return (
    <>
      {gamePhase === 1 &&
        cardsOnGame.map((card) => {
          return (
            <GameCard
              key={card.id + "gamephase1"}
              card={card}
              startingPosition={deckPosition}
              endingPosition={card.slot}
              sharedAnimatedCard={sharedAnimatedCard}
            />
          );
        })}
      {gamePhase === 2 &&
        cardsOnGame.map((card, index) => {
          // log();
          return (
            <GameCard
              key={card.id + "gamephase2"}
              card={card}
              startingPosition={card.slot}
              endingPosition={null}
              sharedAnimatedCard={sharedAnimatedCard}
            />
          );
        })}
      {gamePhase === 3 && <GameOverModal restartGame={restartGame} />}
    </>
  );
};

export default RenderCards;
