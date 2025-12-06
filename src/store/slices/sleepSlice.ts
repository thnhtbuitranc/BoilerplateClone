import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SleepRecord, SleepStats, IdolType } from '@/types/sleep';

interface SleepState {
  currentRecord: SleepRecord | null;
  isSleeping: boolean;
  stats: SleepStats | null;
  selectedIdol: IdolType | null;
  targetSleepTime: string | null; // HH:mm format
  targetWakeTime: string | null;
}

const initialState: SleepState = {
  currentRecord: null,
  isSleeping: false,
  stats: null,
  selectedIdol: null,
  targetSleepTime: '23:00',
  targetWakeTime: '07:00',
};

const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    startSleep: (state, action: PayloadAction<SleepRecord>) => {
      state.currentRecord = action.payload;
      state.isSleeping = true;
    },
    endSleep: (state) => {
      state.currentRecord = null;
      state.isSleeping = false;
    },
    updateStats: (state, action: PayloadAction<SleepStats>) => {
      state.stats = action.payload;
    },
    setSelectedIdol: (state, action: PayloadAction<IdolType>) => {
      state.selectedIdol = action.payload;
    },
    setTargetSleepTime: (state, action: PayloadAction<string>) => {
      state.targetSleepTime = action.payload;
    },
    setTargetWakeTime: (state, action: PayloadAction<string>) => {
      state.targetWakeTime = action.payload;
    },
  },
});

export const {
  startSleep,
  endSleep,
  updateStats,
  setSelectedIdol,
  setTargetSleepTime,
  setTargetWakeTime,
} = sleepSlice.actions;

export default sleepSlice.reducer;

