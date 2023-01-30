import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo } from '../types';

interface InitialState {
  userInfo?: IUserInfo;
  followUser?: any;
}

const initialState: InitialState = {};

export const userSlice = createSlice({
  name: 'auth-slice',
  initialState,
  reducers: {
    setUserInfo: (state: InitialState, action: PayloadAction<any>) => ({
      ...state,
      userInfo: action.payload,
    }),
    setIdFollow: (state: InitialState, action: PayloadAction<{ id: number; follow?: boolean }>) => {
      return {
        ...state,
        followUser: action.payload,
      };
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
