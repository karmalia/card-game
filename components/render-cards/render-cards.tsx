import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useGameStore from "@/stores/game.store";
import GameCard from "../game-card/game-card";
import { Card, TPos } from "../types";
import { fillPlayersHand } from "../utils";

const RenderCards = () => {
  const {
    gamePhase,
    cardsOnBoard,
    deckPosition,
    cardsInDeck,
    bottomSlotPositions,
    cardsOnGame,
    setGamePhase,
    drawCard,
  } = useGameStore();

  React.useEffect(() => {
    async function startGame() {
      if (
        bottomSlotPositions.length > 0 &&
        gamePhase == 1 &&
        cardsInDeck.length === 24
      ) {
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

  function isSerialized(cardList: Card[]) {
    const getNumbers = cardList.map((card) => card.value).sort((a, b) => a - b);
    console.log("GetNumbers", getNumbers);
    if (
      getNumbers[0] + 1 == getNumbers[1] &&
      getNumbers[1] + 1 == getNumbers[2]
    ) {
      return true;
    } else {
      return false;
    }
  }

  React.useEffect(() => {
    if (cardsOnBoard.length === 3) {
      var serialized = isSerialized(cardsOnBoard);
      var isSameColor = cardsOnBoard.every(
        (item) => item.color === cardsOnBoard[0].color
      );
      console.log("isSameColor", isSameColor);
    }
  }, [cardsOnBoard.length]);

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

          return (
            <GameCard
              key={card.id + index}
              card={card}
              startingPosition={card.slot}
              endingPosition={null}
            />
          );
        })}
    </>
  );
};

export default RenderCards;
