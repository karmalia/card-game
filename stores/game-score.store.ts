import { create } from "zustand";

type gameScoreStore = {
  time: number;

  increaseTime: () => void;
  resetTime: () => void;
};

const initialGameState = {
  time: 0,
};
const useGameScoreStore = create<gameScoreStore>((set) => ({
  ...initialGameState,

  increaseTime: () =>
    set((state) => {
      return { ...state, time: state.time + 1 };
    }),

  resetTime: () =>
    set((state) => {
      return { ...state, time: 0 };
    }),
}));

export default useGameScoreStore;
