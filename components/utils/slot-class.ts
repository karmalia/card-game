import { randomUUID } from "expo-crypto";

export class GameSlot {
  isActive: boolean;
  slotId: string;
  pageX: number;
  pageY: number;

  constructor(id = "0", isActive = false, pageX = 0, pageY = 0) {
    this.isActive = isActive;
    this.pageX = pageX;
    this.pageY = pageY;
    this.slotId = id;
  }
}

export const initialTopSlots = {
  1: new GameSlot(randomUUID()),
  2: new GameSlot(randomUUID()),
  3: new GameSlot(randomUUID()),
};

export const initialBottomSlots = {
  1: new GameSlot(randomUUID()),
  2: new GameSlot(randomUUID()),
  3: new GameSlot(randomUUID()),
  4: new GameSlot(randomUUID()),
  5: new GameSlot(randomUUID()),
};
