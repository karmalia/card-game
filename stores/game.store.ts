import { create } from "zustand";
import * as Crypto from "expo-crypto";
import {
  Card,
  CardColors,
  IBottomSlots,
  ITopSlots,
  TPos,
} from "@/components/types";
import {
  initialBottomSlots,
  initialTopSlots,
} from "@/components/utils/slotClass";

type gameStore = {
  score: number;
  topSlotsPositions: ITopSlots;
  bottomSlotPositions: IBottomSlots;
  trashCanPosition: TPos;
  cardInHand: Card[];
  cardsOnBoard: Card[];
  cardsOnTrash: Card[];
  cardsInDeck: Card[];
  drawCard: (startingPos: TPos, endingPos: TPos) => void;
  setTopSlotsPositions: (positions: ITopSlots) => void;
  setBottomSlotsPositions: (positions: IBottomSlots) => void;
  setThrashCanPosition: (position: TPos) => void;
  playCard: (cardId: string) => void;
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
  score: 0,
  topSlotsPositions: initialTopSlots,
  bottomSlotPositions: initialBottomSlots,
  trashCanPosition: {
    pageX: 0,
    pageY: 0,
  },
  cardInHand: [],
  cardsOnBoard: [],
  cardsOnTrash: [],
  cardsInDeck: generateDeck(),
};
const useGameStore = create<gameStore>((set) => ({
  ...initialGameState,
  drawCard: (startingPos, endingPos) =>
    set((state) => {
      console.log("res 48");
      if (state.cardInHand.length <= 5) {
        const [drawnCard, ...remainingDeck] = state.cardsInDeck;

        return {
          cardInHand: [
            ...state.cardInHand,
            { ...drawnCard, startingPos, endingPos },
          ],
          cardsInDeck: remainingDeck,
        };
      }
      return state;
    }),

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

  playCard: (cardId: string) =>
    set((state) => {
      const cardToPlay = state.cardInHand.find((card) => card.id === cardId);
      if (cardToPlay && state.cardsOnBoard.length < 3) {
        return {
          cardsOnBoard: [...state.cardsOnBoard, cardToPlay],
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
