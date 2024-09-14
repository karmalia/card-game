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
  deckPosition: TPos;
  cardsInHand: Card[];
  cardsOnBoard: Card[];
  cardsOnGame: Card[];
  cardsOnTrash: Card[];
  cardsInDeck: Card[];
  drawCard: (slot: TSlotPos) => void;
  setGamePhase: (phase: number) => void;
  setTopSlotsPositions: (positions: ArraySlots) => void;
  setBottomSlotsPositions: (positions: ArraySlots) => void;
  setThrashCanPosition: (position: TPos) => void;
  setDeckPosition: (position: TPos) => void;
  placeOnBoard: (card: Card) => void;
  removeFromBoard: (card: Card) => void;
  discardCard: (card: Card) => void;
  calculateScore: (
    serialized: boolean,
    hasSameValue: boolean,
    hasSameColor: boolean,
    totalValue: number
  ) => void;
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
    for (let value = 1; value <= 8; value++) {
      deck.push({
        id: Crypto.randomUUID(),
        value,
        color,
        isPlayed: false,
        isDeleted: false,
        slot: {
          slotId: "",
          pageX: 0,
          pageY: 0,
        },
        destinationSlot: null,
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
  deckPosition: {
    pageX: 0,
    pageY: 0,
  },
  cardsInHand: [],
  cardsOnBoard: [],
  cardsOnGame: [],
  cardsOnTrash: [],
  cardsInDeck: generateDeck(),
};
const useGameStore = create<gameStore>((set) => ({
  ...initialGameState,
  drawCard: (slot: TSlotPos) => {
    return set((state) => {
      if (state.cardsInHand.length <= 5) {
        const [drawnCard, ...remainingDeck] = state.cardsInDeck;

        const newState = {
          ...state,
          cardsInHand: [...state.cardsInHand, { ...drawnCard, slot }],
          cardsOnGame: [...state.cardsInHand, { ...drawnCard, slot }],
          cardsInDeck: remainingDeck,
          bottomSlotPositions: state.bottomSlotPositions.map((bottomSlot) => {
            if (bottomSlot.slotId === slot.slotId) {
              return { ...slot, isActive: true };
            } else {
              return bottomSlot;
            }
          }),
        };

        return newState;
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
  setDeckPosition: (position) =>
    set((state) => {
      return { ...state, deckPosition: position };
    }),
  placeOnBoard: (card) =>
    set((state) => {
      const cardToPlay = state.cardsInHand.find((item) => item.id === card.id);
      const firstEmptyTopSlot = state.topSlotPositions.find(
        (slot) => !slot.isActive
      );

      if (cardToPlay && state.cardsOnBoard.length < 3 && firstEmptyTopSlot) {
        const newState = {
          ...state,
          cardsInHand: [
            ...state.cardsInHand.filter((item) => item.id !== card.id),
          ],
          cardsOnBoard: [
            ...state.cardsOnBoard,
            {
              ...cardToPlay,
              isPlayed: true,
              destinationSlot: firstEmptyTopSlot,
            },
          ],

          topSlotPositions: state.topSlotPositions.map((slot) =>
            slot.slotId == firstEmptyTopSlot.slotId
              ? { ...slot, isActive: true }
              : slot
          ),
          bottomSlotPositions: state.bottomSlotPositions.map((item) => {
            if (item.slotId == card.slot.slotId) {
              return { ...item, isActive: false };
            } else {
              return item;
            }
          }),
        };

        return newState;
      }
      return state;
    }),
  removeFromBoard: (card) =>
    set((state) => {
      //Board Üzürinde bul

      var newState = {
        ...state,
        cardsInHand: [...state.cardsInHand, { ...card, isPlayed: false }],
        cardsOnBoard: [
          ...state.cardsOnBoard.filter((item) => item.id !== card.id),
        ],

        topSlotPositions: state.topSlotPositions.map((slot, index) =>
          card.destinationSlot?.slotId === slot.slotId
            ? { ...slot, isActive: false }
            : slot
        ),
      };

      return newState;
    }),
  discardCard: (card: Card) =>
    set((state) => {
      const cardToDiscard = state.cardsInHand.find(
        (item) => item.id === card.id
      );
      console.log("Card To Discard", cardToDiscard);
      if (cardToDiscard) {
        const newState = {
          ...state,
          cardsInHand: state.cardsInHand.filter((item) => item.id !== card.id),
          cardsOnTrash: [...state.cardsOnTrash, cardToDiscard],
          bottomSlotPositions: state.bottomSlotPositions.map((slot) => {
            if (slot.slotId === cardToDiscard.slot.slotId) {
              return {
                ...slot,
                isActive: false,
              };
            } else {
              return slot;
            }
          }),
        };
        console.log("CardsOnGame", newState.cardsOnGame.length);
        return newState;
      }
      return state;
    }),

  calculateScore: (serialized, hasSameValue, hasSameColor, totalValue) =>
    set((state) => {
      let score = 0;
      console.log("Serialized", serialized);
      console.log("hasSameValue", hasSameValue);
      console.log("hasSameColor", hasSameColor);
      console.log("totalValue", totalValue);

      const scoreTable =
        Points[hasSameColor ? "isSameColor" : "isDifferentColor"];
      console.log("ScoreTable", scoreTable);
      console.log("totalValue", totalValue);
      score = scoreTable[totalValue];
      console.log("Score!", score);

      /*
      
        Oyundan kartlar çıkartılır: CardsOnBoard güncellenir
        TopSlotları isActive i false yapılır; destinationSlotlara göre yada hepsi toptan,
        bottomSlotları isActive i false yapılır, gelen slotId sine göre
      */

      const cardsOnBoardIds = state.cardsOnBoard.map((c) => c.id);
      const cardsOnTrashIds = state.cardsOnTrash.map((c) => c.id);
      const emptiedSlotsIds = state.cardsOnBoard.map((c) => c.slot.slotId);

      const newState = {
        score: state.score + score,
        cardsOnBoard: [],
        cardsOnGame: state.cardsOnGame.filter(
          (c) =>
            !cardsOnBoardIds.includes(c.id) || cardsOnTrashIds.includes(c.id)
        ),
        topSlotPositions: state.topSlotPositions.map((slot) => ({
          ...slot,
          isActive: false,
        })),
        bottomSlotPositions: state.bottomSlotPositions.map((slot) => {
          return {
            ...slot,
            isActive: emptiedSlotsIds.includes(slot.slotId) ? false : true,
          };
        }),
      };

      console.log(
        "Calculate bottomSlots",
        newState.bottomSlotPositions.map((s) => s.isActive)
      );
      console.log(
        "Calculate topSlots",
        newState.topSlotPositions.map((s) => s.isActive)
      );

      return newState;
    }),

  populateDeck: () =>
    set((state) => {
      const deck = generateDeck();
      return {
        ...initialGameState,
        topSlotPositions: state.topSlotPositions,
        bottomSlotPositions: state.bottomSlotPositions,
        trashCanPosition: state.trashCanPosition,
        deckPosition: state.deckPosition,
        cardsInDeck: deck,
      };
    }),
}));

export default useGameStore;
