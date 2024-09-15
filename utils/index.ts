import { ArraySlots } from "../components/types";

export async function fillPlayersHand(
  drawCard: any,
  bottomSlotPositions: ArraySlots
): Promise<boolean> {
  let delayInMilliseconds = 50;
  try {
    for (let i = 0; i <= 4; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          drawCard(bottomSlotPositions[i]);
          resolve(true);
        }, delayInMilliseconds * i);
      });
    }
    return true; // If all drawCard calls are successful
  } catch (error) {
    console.error("An error occurred while drawing cards:", error);
    return false; // If any drawCard call fails
  }
}
