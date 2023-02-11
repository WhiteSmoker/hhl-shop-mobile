import AsyncStorage from '@react-native-async-storage/async-storage';
export enum ASYNC_STORE {
  TOKEN_ID = 'TOKEN_ID',
  MY_USER = 'MY_USER',
  MY_CART = 'MY_CART',
}
export const storage = AsyncStorage;
