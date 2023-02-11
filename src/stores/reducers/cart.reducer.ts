import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  cartItems?: {
    id: string;
    name: string;
    image: string;
    price: number;
    color: string;
    size: string;
    amount: number;
    quantity: number;
  }[];
}

const initialState: InitialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart-slice',
  initialState,
  reducers: {
    setCartItems: (state: InitialState, action: PayloadAction<any>) => {
      return {
        ...state,
        cartItems: action.payload,
      };
    },
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
