import { ASYNC_STORE, storage } from '@/storage';
// import { checkPermissionFCM, getDeviceInfo, getTokenFCM } from '@/utils/helper';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { networkService } from '@/networking';
import { globalLoading } from '@/containers/actions/emitter.action';
import { userSlice } from '../reducers/user.reducer';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';

export const fetchLogin = createAsyncThunk('auth/login', async (auth: any, thunkAPI) => {
  try {
    globalLoading(true);
    const { email, password } = auth;
    // const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);
    // const res_login: any = await authController.login({ email, password, signupCode });
    // if (res_login.status === 1) {
    //   await storage.setItem(ASYNC_STORE.TOKEN_ID, res_login.data.token.toString());
    //   networkService.setAccessToken(res_login.data.token);
    //   await storage.setItem(ASYNC_STORE.LOGIN_METHOD, res_login.data.loginMethod.toString());
    //   await checkPermissionFCM();
    //   await thunkAPI.dispatch(fetchDataFirstTime(false));
    // } else {
    //   Alert.alert('');
    // }
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: '',
      text2: error.message || error.error,
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

// export const logOut = createAsyncThunk('auth/logOut', async (param: { url?: string; onEnd?: any }, thunkAPI) => {
//   try {
//     globalLoading(true);
//     socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
//     const deviceToken = await getTokenFCM();
//     const { uuid } = await getDeviceInfo();
//     const unregDevice = await authController.removeDevice({ deviceToken, uuid });
//     if (unregDevice.status === 1) {
//       await storage.clear();
//       const token = await storage.getItem(ASYNC_STORE.TOKEN_ID);
//       if (token) {
//         return;
//       } else {
//         emitter(EDeviceEmitter.DEEP_LINK_INVITATION, {});
//         thunkAPI.dispatch({ type: 'LOG_OUT_ACTION' });
//         if (param.onEnd) {
//           param.onEnd();
//         }
//       }
//     }
//   } catch (error: any) {
//     console.log(error);
//   } finally {
//     globalLoading();
//   }
// });
