export interface TPos {
  pageX: number;
  pageY: number;
}

export interface TSlotPos extends TPos {
  isActive: boolean;
}

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
  startingPos: TPos;
  endingPos: TPos;
  isPlayed: boolean;
  isDeleted: boolean;
};
