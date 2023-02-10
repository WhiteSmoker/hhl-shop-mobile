import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  userInfo?: {};
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
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
