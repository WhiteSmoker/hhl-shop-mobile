import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stump } from '../types';
import { APP_NAVIGATION } from '@/constants/navigation';

interface CommonState {
  heightConsume: number;
  countPlay: number;
  stumpActive?: Stump;
  tabActive: string;
}

const initialState: CommonState = {
  heightConsume: 0,
  countPlay: 0,
  tabActive: APP_NAVIGATION.HOME,
};

export const commonSlice = createSlice({
  name: 'common-slice',
  initialState,
  reducers: {
    clearAuth: () => initialState,
    setHeightCommon: (state: CommonState, action: PayloadAction<number>) => ({
      ...state,
      heightConsume: action.payload,
    }),
    setPlayStump: (state: CommonState, action: PayloadAction<Stump | undefined>) => {
      if (state.stumpActive?.id !== action.payload?.id) {
        return {
          ...state,
          stumpActive: action.payload,
        };
      }
      return state;
    },
    setCountPlayStump: (state: CommonState, action: PayloadAction<number>) => ({ ...state, countPlay: action.payload }),
    setTabActive: (state: CommonState, action: PayloadAction<string>) => {
      return { ...state, tabActive: action.payload };
    },
    setTab: (state: CommonState, action: PayloadAction<string>) => ({ ...state, tabActive: action.payload }),
  },
});
