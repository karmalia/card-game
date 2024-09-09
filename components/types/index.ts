export interface TPos {
  pageX: number;
  pageY: number;
}

export interface TSlotPos extends TPos {
  isActive: boolean;
  slotId: string;
}

export type ArraySlots = TSlotPos[];

export interface ITopSlots {
  1: TSlotPos;
  2: TSlotPos;
  3: TSlotPos;
}

export interface IBottomSlots extends ITopSlots {
  4: TSlotPos;
  5: TSlotPos;
}

export type CardColors = "red" | "yellow" | "blue";
export type Card = {
  id: string;
  value: number;
  color: CardColors;
  isPlayed: boolean;
  isDeleted: boolean;
  slot: Omit<TSlotPos, "isActive">;
  destinationSlot: Omit<TSlotPos, "isActive"> | null;
};
