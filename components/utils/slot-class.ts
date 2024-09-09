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
