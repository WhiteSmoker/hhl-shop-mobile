import { ROOT_ROUTES } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { authController } from '@/controllers';
import { ASYNC_STORE, storage } from '@/storage';
import { TAppDispatch } from '@/stores';
import { authSlice } from '@/stores/reducers';
import { loginSocial } from '@/stores/thunks/auth.thunk';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

interface Props {
  button: React.ReactNode;
  gotoSurvey?: () => void;
}
const AppleLoginComponent = (props: Props) => {
  const dispatch = useDispatch<TAppDispatch>();
  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw Error('Apple Sign-In failed - no identify token returned');
      }
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        globalLoading(true);
        const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);
        const res_apple = await authController.loginApple({ ...appleAuthRequestResponse, signupCode });
        if (res_apple.status === 1) {
          authSlice.actions.setProfile(res_apple.data);
          dispatch(loginSocial(res_apple.data));
        }
      }
    } catch (error: any) {
      console.log(error.error);
    } finally {
      globalLoading();
    }
  };
  return appleAuth.isSupported && Platform.OS === 'ios' ? (
    <TouchableOpacity onPress={onAppleButtonPress} activeOpacity={0.8}>
      {props.button}
    </TouchableOpacity>
  ) : null;
};
export default React.memo(AppleLoginComponent);
