import { create } from "zustand";
import * as Crypto from "expo-crypto";
import {
  ArraySlots,
  Card,
  CardColors,
  IBottomSlots,
  ITopSlots,
  TPos,
  TSlotPos,
} from "@/components/types";

type gameStore = {
  gamePhase: number;
  score: number;
  topSlotPositions: ArraySlots;
  bottomSlotPositions: ArraySlots;
  firstEmptySlotId: string;
  filledTopSlotCount: number;
  trashCanPosition: TPos;
  cardInHand: Card[];
  cardsOnBoard: Card[];
  cardsOnGame: Card[];
  cardsOnTrash: Card[];
  cardsInDeck: Card[];
  drawCard: (startingPos: TPos, endingPos: TPos) => void;
  setGamePhase: (phase: number) => void;
  setTopSlotsPositions: (positions: ArraySlots) => void;
  setBottomSlotsPositions: (positions: ArraySlots) => void;
  setThrashCanPosition: (position: TPos) => void;
  placeOnBoard: (cardId: string, firstEmptySlot: TSlotPos) => void;
  removeFromBoard: (cardId: string, firstEmptySlot: TSlotPos) => void;
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
  topSlotPositions: [],
  bottomSlotPositions: [],
  firstEmptySlotId: "",
  filledTopSlotCount: 0,
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
const useGameStore = create<gameStore>((set) => ({
  ...initialGameState,
  drawCard: () => {
    return set((state) => {
      console.log("res 59");
      if (state.cardInHand.length <= 5) {
        const [drawnCard, ...remainingDeck] = state.cardsInDeck;

        return {
          cardInHand: [...state.cardInHand, { ...drawnCard }],
          cardsOnGame: [...state.cardInHand, { ...drawnCard }],
          cardsInDeck: remainingDeck,
        };
      }
      return state;
    });
  },
  setGamePhase: (phase: number) => {
    return set((state) => ({ ...state, gamePhase: phase }));
  },

  setTopSlotsPositions: (positions) =>
    set((state) => {
      return { ...state, topSlotPositions: positions };
    }),
  setBottomSlotsPositions: (positions) => {
    return set((state) => {
      return { ...state, bottomSlotPositions: positions };
    });
  },
  setThrashCanPosition: (position) =>
    set((state) => {
      return { ...state, trashCanPosition: position };
    }),
  placeOnBoard: (cardId: string, firstEmptySlot: TSlotPos) =>
    set((state) => {
      const cardToPlay = state.cardInHand.find((card) => card.id === cardId);

      if (cardToPlay && state.cardsOnBoard.length < 3) {
        const cardBottomIndex = state.cardInHand.findIndex(
          (card) => card.id === cardId
        );
        return {
          ...state,
          cardInHand: [
            ...state.cardInHand.filter((card) => card.id !== cardToPlay.id),
          ],
          cardsOnBoard: [
            ...state.cardsOnBoard,
            { ...cardToPlay, isPlayed: true },
          ],
          topSlotPositions: state.topSlotPositions.map((slot) =>
            slot.slotId === firstEmptySlot.slotId
              ? { ...slot, isActive: true }
              : slot
          ),
          bottomSlotPositions: state.bottomSlotPositions.map((slot, index) =>
            cardBottomIndex === index ? { ...slot, isActive: false } : slot
          ),
          cardsOnGame: state.cardsOnGame.map((card) =>
            card.id === cardId ? { ...card, isPlayed: true } : card
          ),
        };
      }
      console.log("Place On Board ELSE!");
      console.log("CardId", cardId);
      console.log("CardToPlay", cardToPlay);
      console.log("game-store:183 state.cardsOnBoard", state.cardsOnBoard);
      return state;
    }),
  removeFromBoard: (cardId: string, firstEmptySlot: TSlotPos) =>
    set((state) => {
      //Board Üzürinde bul
      const cardToRemove = state.cardsOnBoard.find(
        (card) => card.id === cardId
      );

      if (cardToRemove && state.cardInHand.length < 5) {
        console.log("Remove From Board");
        const cardTopIndex = state.cardsOnBoard.findIndex(
          (card) => card.id === cardId
        );
        console.log("cardTopIndex", cardTopIndex);
        console.log("firstEmptySlot", firstEmptySlot);

        return {
          ...state,
          cardInHand: [
            ...state.cardsOnBoard,
            { ...cardToRemove, isPlayed: false },
          ],
          cardsOnBoard: [
            ...state.cardsOnBoard.filter((card) => card.id !== cardToRemove.id),
          ],
          bottomSlotPositions: state.bottomSlotPositions.map((slot) =>
            slot.slotId === firstEmptySlot.slotId
              ? { ...slot, isActive: true }
              : slot
          ),
          topSlotPositions: state.topSlotPositions.map((slot, index) =>
            cardTopIndex === index ? { ...slot, isActive: false } : slot
          ),
          cardsOnGame: state.cardsOnGame.map((card) =>
            card.id === cardId ? { ...card, isPlayed: false } : card
          ),
        };
      }
      console.log("Remove From Board ELSE!!!");
      console.log("CardToRemove", cardToRemove);
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
