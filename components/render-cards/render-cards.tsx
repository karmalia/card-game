import React from "react";
import useGameStore from "@/stores/game.store";
import GameCard from "../game-card/game-card";
import { TSlotPos } from "../types";
import fillPlayersHand from "../../utils/fillPlayersHand";

import { useSharedValue } from "react-native-reanimated";

import DirectionOverlay, {
  EDirective,
} from "./DirectionOverlay/direction-overlay";

const RenderCards = () => {
  const sharedAnimatedCard = useSharedValue<Card | null>(null);
  const sharedTopFirstEmptySlot = useSharedValue<TSlotPos | null>(null);
  const sharedDirective = useSharedValue<keyof typeof EDirective>("none");
  const {
    deckPosition,
    bottomSlotPositions,
    cardsOnGame,
    topSlotPositions,
    drawCard,
    gamePhase,
    setGamePhase,
  } = useGameStore();

  React.useEffect(() => {
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

  return (
    <>
      {(gamePhase === 1 || gamePhase === 2) &&
        cardsOnGame.map((card, index) => {
          return (
            <GameCard
              key={card.id + (gamePhase === 1 ? "gamephase1" : "gamephase2")}
              card={card}
              startingPosition={gamePhase === 1 ? deckPosition : card.slot}
              endingPosition={gamePhase === 1 ? card.slot : null}
              sharedAnimatedCard={sharedAnimatedCard}
              index={index}
              sharedTopFirstEmptySlot={sharedTopFirstEmptySlot}
              sharedDirective={sharedDirective}
            />
          );
        })}
              {/* <DirectionOverlay sharedDirective={sharedDirective} /> */}
    </>
  );
};

export default RenderCards;
