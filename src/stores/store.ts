import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction, CombinedState, combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice, cartSlice, userSlice } from './reducers';

const reducer = combineReducers({
  authState: authSlice.reducer,
  userState: userSlice.reducer,
  cartState: cartSlice.reducer,
});

/** config root reducer */
const resettableAppReducer = (state: CombinedState<any>, action: AnyAction) => {
  if (action.type === 'LOG_OUT_ACTION') {
    state = {} as any;
  }
  return reducer(state, action);
};

export const store = configureStore({
  reducer: resettableAppReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: false,
      thunk: true,
    }),
});

export type TAppDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
export default store;
