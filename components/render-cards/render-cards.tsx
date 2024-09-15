import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import useGameStore from "@/stores/game.store";
import GameCard from "../game-card/game-card";
import { Card, TPos } from "../types";
import { fillPlayersHand } from "../../utils";
import GameOverModal from "../modals/gameover/game-over-modal";

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
      (sortedValues[index] +
        sortedValues[index + 1] +
        sortedValues[index + 2]) /
        3 ===
      sortedValues[index] + 1
    ) {
      result = true;
    }
  });

  return result || false;
}

function canStillPlay(cardsInHand: Card[]) {
  const sequential = isSequential(cardsInHand);
  const threeOfAKind = hasThreeOfAKind(cardsInHand);

  return sequential || threeOfAKind || false;
}

const RenderCards = () => {
  const [gameOver, setGameOver] = useState(false);

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
    console.log("GamePhase ", gamePhase);
    console.log("bottomSlotPositions.length ", bottomSlotPositions.length);
    console.log("cardsInDeck.length ", cardsInDeck.length);
    console.log("GamePhase ", gamePhase);
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
      }
    }
  }, [cardsOnBoard.length]);

  React.useEffect(() => {
    console.log("CanStillPlay");
    if (cardsInDeck.length === 0) {
      const isGameOver = canStillPlay(cardsInHand);
      setGameOver(isGameOver);
    }
  }, [cardsInHand.length]);

  function restartGame() {
    populateDeck();
    setGamePhase(1);
    setGameOver(false);
  }

  return (
    <>
      {gamePhase === 1 &&
        cardsOnGame.map((card, index) => {
          return (
            <GameCard
              key={card.id + "gamephase1"}
              card={card}
              startingPosition={deckPosition}
              endingPosition={card.slot}
            />
          );
        })}
      {gamePhase === 2 &&
        cardsOnGame.map((card, index) => {
          // log();
          console.log("RenderCards!");
          return (
            <GameCard
              key={card.id + index}
              card={card}
              startingPosition={card.slot}
              endingPosition={null}
            />
          );
        })}
      {gameOver && <GameOverModal restartGame={restartGame} />}
    </>
  );
};

export default RenderCards;
