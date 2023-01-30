import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDiscoveryStumpResponse } from '../types/discovery.type';

interface InitialState {
  stumpPost?: IDiscoveryStumpResponse;
  stumpMatch?: IDiscoveryStumpResponse;
  stumpDiscovery?: IDiscoveryStumpResponse;
}

const initialState: InitialState = {};

export const discoverySlice = createSlice({
  name: 'discovery-slice',
  initialState,
  reducers: {
    setListStumpPost(state: InitialState, action: PayloadAction<IDiscoveryStumpResponse>) {
      state.stumpPost = action.payload;
    },
    setListStumpMatch(state: InitialState, action: PayloadAction<IDiscoveryStumpResponse>) {
      state.stumpMatch = action.payload;
    },
    setListStumpDiscovery(state: InitialState, action: PayloadAction<IDiscoveryStumpResponse>) {
      state.stumpDiscovery = action.payload;
    },
  },
});

export const { setListStumpPost, setListStumpMatch, setListStumpDiscovery } = discoverySlice.actions;

export default discoverySlice.reducer;
