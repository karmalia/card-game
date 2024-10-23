import { Card, CardColors } from "@/components/types";
import * as Crypto from "expo-crypto";

const generateTestDeck = (): Card[] => {
  const colors: CardColors[] = ["red", "yellow", "blue"];
  const deck: Card[] = [];

  for (let color of colors) {
    for (let value = 1; value <= 3; value++) {
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

export { generateDeck, generateTestDeck };
