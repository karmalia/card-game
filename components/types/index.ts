export interface TPos {
  pageX: number;
  pageY: number;
}

export interface TSlotPos extends TPos {
  isActive: boolean;
  slotId: string;
  reservedBy: string | null;
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

export type CardColor = {
  name: "red" | "yellow" | "blue";
  value: string;
};

export type Card = {
  id: string;
  value: number;
  color: CardColor;
  isPlayed: boolean;
  isDeleted: boolean;
  slot: Omit<TSlotPos, "isActive">;
  destinationSlot: Omit<TSlotPos, "isActive" | "reservedBy"> | null;
};
