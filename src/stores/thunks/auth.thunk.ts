import Toast from 'react-native-toast-message';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setUserInfo } from '../reducers/user.reducer';

import { globalLoading } from '@/containers/actions/emitter.action';
import { authController } from '@/controllers';
import { networkService } from '@/networking';
import { ASYNC_STORE, storage } from '@/storage';

export const fetchLogin = createAsyncThunk('auth/login', async (auth: any, thunkAPI) => {
  try {
    globalLoading(true);
    const { username, password } = auth;
    const res_login: any = await authController.login({ username, password });

    if (res_login.success === true) {
      await storage.setItem(ASYNC_STORE.TOKEN_ID, res_login.accessToken.toString());
      await storage.setItem(ASYNC_STORE.MY_USER, JSON.stringify(res_login.user));
      networkService.setAccessToken(res_login.accessToken);
      thunkAPI.dispatch(setUserInfo(res_login.user));
    }
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: '',
      text2: error.message,
    });
  } finally {
    globalLoading();
  }
});

export const fetchUser = createAsyncThunk('auth/userInfo', async (loading: boolean, thunkAPI) => {
  try {
    globalLoading(true, loading);
    // const token = await storage.getItem(ASYNC_STORE.TOKEN_ID);
    // const loginMethod = await storage.getItem(ASYNC_STORE.LOGIN_METHOD);
    // if (!token) {
    //   return;
    // }
    // networkService.setAccessToken(token);
    // const res_user_info = await userController.fetchUser(undefined, loginMethod!);
    // await checkPermissionFCM();
    // if (res_user_info.status === 1) {
    //   await storage.setItem(ASYNC_STORE.MY_USER_ID, res_user_info?.data?.id.toString());
    //   thunkAPI.dispatch(userSlice.actions.setUserInfo(res_user_info.data));
    // }
  } catch (error: any) {
    console.log(error);
  } finally {
    globalLoading(null, loading);
  }
});

export const logOut = createAsyncThunk('auth/logOut', async (param: { onEnd?: any }, thunkAPI) => {
  try {
    globalLoading(true);
    await storage.setItem(ASYNC_STORE.TOKEN_ID, '');
    await storage.setItem(ASYNC_STORE.MY_USER, '');
    thunkAPI.dispatch({ type: 'LOG_OUT_ACTION' });
    if (param.onEnd) {
      param.onEnd();
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    globalLoading();
  }
});
