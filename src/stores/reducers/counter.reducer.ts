import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  count: number;
  countDraft: number;
  countAccepted: number;
  countNewNotification?: number;
}

const initialState: InitialState = {
  count: 0,
  countDraft: 0,
  countAccepted: 0,
  countNewNotification: 0,
};

export const counterSlice = createSlice({
  name: 'counter-slice',
  initialState,
  reducers: {
    setCounter: (
      state: InitialState,
      action: PayloadAction<{
        count: number;
        countDraft: number;
        countAccepted: number;
      }>,
    ) => ({
      ...state,
      ...action.payload,
    }),
    setCountNewNotification: (state: InitialState, action: PayloadAction<number>) => {
      if (action.payload) {
        return { ...state, countNewNotification: (state.countNewNotification || 0) + action.payload };
      }
      return { ...state, countNewNotification: 0 };
    },
  },
});
