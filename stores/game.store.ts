import { create } from "zustand";
import { ArraySlots, Card, TPos, TSlotPos } from "@/components/types";
import { generateTestDeck, generateDeck } from "@/utils/generateDeck";

type gameStore = {
  gamePhase: number;
  point: number;
  time: number;
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
  calculatePoint: (
    serialized: boolean,
    hasSameValue: boolean,
    hasSameColor: boolean,
    totalValue: number
  ) => void;
  populateDeck: () => void;
  increaseTime: () => void;
};

const Points = {
  // Different Color, Same Value
  hasSameValue: {
    3: 20,
    6: 30,
    9: 40,
    12: 50,
    15: 60,
    18: 70,
    21: 80,
    24: 90,
  },
  // Serialied same Color
  isSameColor: {
    6: 50,
    9: 60,
    12: 70,
    15: 80,
    18: 90,
    21: 100,
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

const initialGameState = {
  gamePhase: 0,
  point: 0,
  time: 0,
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
          cardsOnGame: state.cardsOnGame.map((item) =>
            item.id === card.id ? { ...card, isPlayed: true } : item
          ),
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
        cardsOnGame: state.cardsOnGame.map((item) =>
          item.id === card.id ? { ...card, isPlayed: false } : item
        ),

        topSlotPositions: state.topSlotPositions.map((slot, index) =>
          card.destinationSlot?.slotId === slot.slotId
            ? { ...slot, isActive: false }
            : slot
        ),
        bottomSlotPositions: state.bottomSlotPositions.map((item) => {
          if (item.slotId == card.slot.slotId) {
            return { ...item, isActive: true };
          } else {
            return item;
          }
        }),
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

  calculatePoint: (serialized, hasSameValue, hasSameColor, totalValue) =>
    set((state) => {
      let point = 0;

      if (hasSameValue) {
        point =
          Points.hasSameValue[totalValue as keyof typeof Points.hasSameValue];
      }

      if (serialized) {
        point =
          Points.isSameColor[totalValue as keyof typeof Points.isSameColor];
        if (!hasSameColor) point -= 40;
      }

      const cardsOnBoardIds = state.cardsOnBoard.map((c) => c.id);
      const cardsOnTrashIds = state.cardsOnTrash.map((c) => c.id);
      const emptiedSlotsIds = state.cardsOnBoard.map((c) => c.slot.slotId);

      const newState = {
        point: state.point + point,
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
  increaseTime: () =>
    set((state) => {
      return { ...state, time: state.time + 1 };
    }),
}));

export default useGameStore;
