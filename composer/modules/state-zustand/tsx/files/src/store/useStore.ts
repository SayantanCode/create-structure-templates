import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

// Example store — copy this pattern for your own: one create() call per
// slice of state, actions live right alongside the state they update.
export const useStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
