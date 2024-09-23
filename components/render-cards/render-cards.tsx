import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import useGameStore from "@/stores/game.store";
import GameCard from "../game-card/game-card";
import { Card, TPos } from "../types";
import { fillPlayersHand } from "../../utils";
import GameOverModal from "../modals/gameover/game-over-modal";
import { useSharedValue } from "react-native-reanimated";

let handChecked = false;

function hasThreeOfAKind(cardList: Card[]) {
  const valueCountMap = cardList.reduce((acc: any, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {});

  return Object.values(valueCountMap).some((count) => count === 3);
}
function isSequential(cardList: Card[]) {
  if (cardList.length < 3) return false;
  const sortedValues = cardList.map((card) => card.value).sort((a, b) => a - b);

  let result = false;
  cardList.forEach((card, index) => {
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

  return sequential || threeOfAKind ? false : true;
}

const RenderCards = () => {
  const [gameOver, setGameOver] = useState(false);
  const [isAnimationGoing, setIsAnimationGoing] = useState(false);
  const {
    gamePhase,
    cardsOnBoard,
    deckPosition,
    cardsInDeck,
    bottomSlotPositions,
    cardsOnGame,
    setGamePhase,
    drawCard,
    calculateScore,
    cardsInHand,
    populateDeck,
  } = useGameStore();

  React.useEffect(() => {
    async function startGame() {
      if (
        bottomSlotPositions.length > 0 &&
        gamePhase == 1 &&
        cardsInDeck.length === 24
      ) {
        console.log("Game Started");
        const result = await fillPlayersHand(drawCard, bottomSlotPositions);
        if (result) {
          setTimeout(() => {
            setGamePhase(2);
          }, 300);
        }
      }
    }

    if (gamePhase === 1) startGame();
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
        calculateScore(serialized, hasSameValue, hasSameColor, totalValue);
        if (cardsInDeck.length == 0 && cardsInHand.length <= 2) {
          setGameOver(true);
        }
      }
    }
  }, [cardsOnBoard.length]);

  React.useEffect(() => {
    if (cardsInDeck.length === 0 && !handChecked) {
      handChecked = true;
      const isGameOver = canStillPlay(cardsInHand);
      console.log("isGameOver", isGameOver);
      setGameOver(isGameOver);
    }
  }, [cardsInHand.length]);

  function restartGame() {
    populateDeck();
    setGamePhase(1);
    setGameOver(false);
    handChecked = false;
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
              isAnimationGoing={isAnimationGoing}
              setIsAnimationGoing={setIsAnimationGoing}
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
              isAnimationGoing={isAnimationGoing}
              setIsAnimationGoing={setIsAnimationGoing}
            />
          );
        })}
      {gameOver && (
        <GameOverModal restartGame={restartGame} setGameOver={setGameOver} />
      )}
    </>
  );
};

export default RenderCards;
