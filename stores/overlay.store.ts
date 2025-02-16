import { create } from "zustand";

type overlayState = "none" | "play" | "delete";
type gameStore = {
  overlayState: overlayState;
  setOverlayState: (state: overlayState) => void;
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
  overlayState: "none" as overlayState,
};
const useOverlayStore = create<gameStore>((set) => ({
  ...initialGameState,
  setOverlayState: (newState: overlayState) => {
    return set((state) => {
      return { ...state, overlayState: newState };
    });
  },
}));

export default useOverlayStore;
