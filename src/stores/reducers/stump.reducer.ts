import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stump } from '../types';

interface InitialState {
  stumps: {
    home: Stump[];
    created: Stump[];
    liked: Stump[];
    restumped: Stump[];
    joined: Stump[];
    createdProfile: Stump[];
    likedProfile: Stump[];
    restumpedProfile: Stump[];
    joinedProfile: Stump[];
    share: Stump[];
  };
  likedStump?: Stump;
  count: {
    created: number;
    liked: number;
    restumped: number;
    joined: number;
  };
  deleteStump: number;
  editStump?: {
    title: string;
    description: string;
    listStump: string[];
    id: number;
  };
  stumpAds: any;
}

const initialState: InitialState = {
  stumps: {
    home: [],
    created: [],
    liked: [],
    restumped: [],
    joined: [],
    createdProfile: [],
    likedProfile: [],
    restumpedProfile: [],
    joinedProfile: [],
    share: [],
  },
  count: {
    created: 0,
    liked: 0,
    restumped: 0,
    joined: 0,
  },
  deleteStump: 0,
  stumpAds: undefined,
};

export const stumpSlice = createSlice({
  name: 'stump-slice',
  initialState,
  reducers: {
    setEditStump: (
      state: InitialState,
      action: PayloadAction<{
        title: string;
        description: string;
        listStump: string[];
        id: number;
      }>,
    ) => {
      return {
        ...state,
        editStump: { ...action.payload },
      };
    },
    setLikedStump: (state: InitialState, action: PayloadAction<Stump>) => {
      return {
        ...state,
        likedStump: action.payload,
      };
    },
    setDeleteStump: (state: InitialState, action: PayloadAction<number>) => {
      return {
        ...state,
        deleteStump: action.payload,
      };
    },
    setStumpAds: (state: InitialState, action: PayloadAction<number>) => {
      return {
        ...state,
        stumpAds: action.payload,
      };
    },
  },
});
