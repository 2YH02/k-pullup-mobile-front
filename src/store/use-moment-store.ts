import { type Moment } from "@/api/moment";
import { create } from "zustand";

interface momentState {
  isView: boolean;
  moments: Moment[] | null;
  curMoment: Moment | null;
  setMoments: (moments: Moment[]) => void;
  setCurMoment: (curMoment: Moment) => void;
  show: VoidFunction;
  hide: VoidFunction;
}

export const useMomentStore = create<momentState>((set) => ({
  isView: false,
  moments: null,
  curMoment: null,
  setMoments: (moments: Moment[]) => set({ moments }),
  setCurMoment: (curMoment: Moment) => set({ curMoment }),
  hide: () => set({ isView: false }),
  show: () => set({ isView: true }),
}));
