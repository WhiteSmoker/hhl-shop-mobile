import AsyncStorage from '@react-native-async-storage/async-storage';
export enum ASYNC_STORE {
  TOKEN = '@@TOKEN',
  TOKEN_ID = 'TOKEN_ID',
  MY_USER_ID = 'MY_USER_ID',
  RECENT_LIST = 'RECENT_LIST',
  AUTOPLAY = 'AUTOPLAY',
  TOGGLE_HIDDEN = 'TOGGLE_HIDDEN',
  LOGIN_METHOD = 'LOGIN_METHOD',
  SIGNUP_CODE = 'SIGNUP_CODE',
  INVITE_CODE = 'INVITE_CODE',
}
export const storage = AsyncStorage;
