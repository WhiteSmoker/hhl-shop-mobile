import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stumpSlice } from './stump.reducer';
type RegisterState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  signupCode?: string;
  phone: string;
};
interface InitialState {
  user: RegisterState;
}

const initialState: InitialState = {
  user: {
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    phone: '',
    password: '',
    signupCode: '',
  },
};

export const authSlice = createSlice({
  name: 'auth-slice',
  initialState,
  reducers: {
    clearAuth: () => initialState,
    setProfile: (state: InitialState, action: PayloadAction<any>) => {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    },
  },
});
export const { setProfile } = authSlice.actions;
export default authSlice.reducer;
