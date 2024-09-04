class Slot {
  isActive: boolean;
  pageX: number;
  pageY: number;

  constructor(isActive = false, pageX = 0, pageY = 0) {
    this.isActive = isActive;
    this.pageX = pageX;
    this.pageY = pageY;
  }
}

export const initialTopSlots = {
  1: new Slot(),
  2: new Slot(),
  3: new Slot(),
};

export const initialBottomSlots = {
  1: new Slot(),
  2: new Slot(),
  3: new Slot(),
  4: new Slot(),
  5: new Slot(),
};
