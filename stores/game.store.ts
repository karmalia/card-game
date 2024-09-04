import { create } from "zustand";
import * as Crypto from "expo-crypto";
import {
  Card,
  CardColors,
  IBottomSlots,
  ITopSlots,
  TPos,
  TSlotPos,
} from "@/components/types";
import {
  initialBottomSlots,
  initialTopSlots,
} from "@/components/utils/slot-class";

type gameStore = {
  gamePhase: number;
  score: number;
  topSlotsPositions: ITopSlots;
  bottomSlotPositions: IBottomSlots;
  trashCanPosition: TPos;
  cardInHand: Card[];
  cardsOnBoard: Card[];
  cardsOnGame: Card[];
  cardsOnTrash: Card[];
  cardsInDeck: Card[];
  drawCard: (startingPos: TPos, endingPos: TPos) => void;
  setGamePhase: (phase: number) => void;
  setTopSlotsPositions: (positions: ITopSlots) => void;
  setBottomSlotsPositions: (positions: IBottomSlots) => void;
  setThrashCanPosition: (position: TPos) => void;
  placeOnBoard: (cardId: string, firstEmptySlot: TSlotPos) => void;
  discardCard: (cardId: string) => void;
  calculateScore: () => void;
  populateDeck: () => void;
};

const Points = {
  isDifferentColor: {
    6: 10,
    9: 20,
    12: 30,
    15: 40,
    18: 50,
    21: 60,
  },
  isSameColor: {
    3: 20,
    6: 30,
    9: 40,
    12: 50,
    15: 60,
    18: 70,
    21: 80,
    24: 90,
  },
};

/*
Puanlamalar;
Same Color 4-5-6: 80
Same Color 6-7-8: 100


Different 3-4-5: 30

*/

/*
    Oyuncu elinde 5 card tutabilir,
    Oyuncu yerde 3

*/

const generateDeck = (): Card[] => {
  const colors: CardColors[] = ["red", "yellow", "blue"];
  const deck: Card[] = [];

  for (let color of colors) {
    for (let value = 1; value <= 9; value++) {
      deck.push({
        id: Crypto.randomUUID(),
        value,
        color,
        startingPos: {
          pageX: 0,
          pageY: 0,
        },
        endingPos: {
          pageX: 0,
          pageY: 0,
        },
        isPlayed: false,
        isDeleted: false,
      });
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const initialGameState = {
  gamePhase: 0,
  score: 0,
  topSlotsPositions: initialTopSlots,
  bottomSlotPositions: initialBottomSlots,
  trashCanPosition: {
    pageX: 0,
    pageY: 0,
  },
  cardInHand: [],
  cardsOnBoard: [],
  cardsOnGame: [],
  cardsOnTrash: [],
  cardsInDeck: generateDeck(),
};
console.log("İnitialGameState", initialGameState);
const useGameStore = create<gameStore>((set) => ({
  ...initialGameState,
  drawCard: (startingPos, endingPos) =>
    set((state) => {
      console.log("res 59");
      if (state.cardInHand.length <= 5) {
        const [drawnCard, ...remainingDeck] = state.cardsInDeck;

        return {
          cardInHand: [
            ...state.cardInHand,
            { ...drawnCard, startingPos, endingPos },
          ],
          cardsOnGame: [
            ...state.cardInHand,
            { ...drawnCard, startingPos, endingPos },
          ],
          cardsInDeck: remainingDeck,
        };
      }
      return state;
    }),
  setGamePhase: (phase: number) => {
    return set((state) => ({ ...state, gamePhase: phase }));
  },

  setTopSlotsPositions: (positions) =>
    set((state) => {
      return { ...state, topSlotsPositions: positions };
    }),
  setBottomSlotsPositions: (positions) =>
    set((state) => {
      return { ...state, bottomSlotPositions: positions };
    }),
  setThrashCanPosition: (position) =>
    set((state) => {
      return { ...state, trashCanPosition: position };
    }),

  placeOnBoard: (cardId: string, firstEmptySlot: TSlotPos) =>
    set((state) => {
      console.log("firstEmptySlott.slotId", firstEmptySlot.slotId);
      const cardToPlay = state.cardInHand.find((card) => card.id === cardId);
      const activatedSlotIndex = Object.values(
        state.topSlotsPositions
      ).findIndex((slot) => slot.slotId === firstEmptySlot.slotId);

      const slotKey = (activatedSlotIndex +
        1) as keyof typeof state.topSlotsPositions;
      const updatedProperty = { isActive: true };

      const newTopSlots = {
        ...state.topSlotsPositions,
        [slotKey]: {
          ...state.topSlotsPositions[slotKey],
          ...updatedProperty,
        },
      };
      console.log("newTopSlots", newTopSlots);
      if (cardToPlay && state.cardsOnBoard.length < 3) {
        return {
          ...state,
          cardInHand: [
            ...state.cardInHand.filter((card) => card.id === cardToPlay.id),
          ],
          cardsOnBoard: [...state.cardsOnBoard, cardToPlay],
          topSlotsPositions: newTopSlots,
        };
      }
      return state;
    }),

  discardCard: (cardId: string) =>
    set((state) => {
      const cardToDiscard = state.cardInHand.find((card) => card.id === cardId);
      if (cardToDiscard) {
        return {
          cardInHand: state.cardInHand.filter((card) => card.id !== cardId),
          cardsOnTrash: [...state.cardsOnTrash, cardToDiscard],
        };
      }
      return state;
    }),

  calculateScore: () =>
    set((state) => {
      const cards = state.cardsOnBoard;
      if (cards.length === 0) return state;

      let score = 0;

      return {
        score: state.score + score,
      };
    }),

  populateDeck: () =>
    set(() => {
      const deck = generateDeck();
      return {
        ...initialGameState,
        cardsInDeck: deck,
      };
    }),
}));

export default useGameStore;
