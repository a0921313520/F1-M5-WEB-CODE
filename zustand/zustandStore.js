import { create } from "zustand";

const useBearStore = create((set) => ({
    value: 0,
    increment: () => set((state) => ({ value: state.value + 1 })),
    decrement: () => set((state) => ({ value: state.value - 1 })),
}));

export default useBearStore;
