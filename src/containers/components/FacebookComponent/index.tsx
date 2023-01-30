import { ROOT_ROUTES } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { authController } from '@/controllers';
import { ASYNC_STORE, storage } from '@/storage';
import { TAppDispatch } from '@/stores';
import { authSlice, setProfile } from '@/stores/reducers';
import { loginSocial } from '@/stores/thunks/auth.thunk';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';
import { useDispatch } from 'react-redux';

interface Props {
  button: React.ReactNode;
  gotoSurvey?: () => void;
}
const FacebookComponent = (props: Props) => {
  const dispatch = useDispatch<TAppDispatch>();

  const logOutFb = async () => {
    const data = await AccessToken.getCurrentAccessToken();
    if (data?.accessToken) {
      const api = new GraphRequest(
        'me/permissions/',
        {
          accessToken: data.accessToken,
          httpMethod: 'DELETE',
        },
        (error, result) => {
          console.log({ error, result });
        },
      );
      new GraphRequestManager().addRequest(api).start();
      LoginManager.logOut();
    }
  };

  const _onFacebookButtonPress = async () => {
    try {
      globalLoading(true);

      // await logOutFb();
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        return;
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);
        const res_fb = await authController.loginFacebook(data.accessToken, data.userID, signupCode!);
        console.log('res_fb', res_fb);
        if (res_fb.status === 1) {
          dispatch(setProfile(res_fb.data));
          dispatch(loginSocial(res_fb.data));
        }
      }
    } catch (error: any) {
      Alert.alert('', error.error);
      console.log(error);
    } finally {
      globalLoading();
    }
  };
  return (
    <TouchableOpacity onPress={_onFacebookButtonPress} activeOpacity={0.8}>
      {props.button}
    </TouchableOpacity>
  );
};
export default React.memo(FacebookComponent);
