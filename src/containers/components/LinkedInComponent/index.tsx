import { authController } from '@/controllers';
import { ASYNC_STORE, storage } from '@/storage';
import { TAppDispatch } from '@/stores';
import { loginSocial } from '@/stores/thunks/auth.thunk';
import LinkedInModal, { ErrorType, LinkedInToken } from 'react-native-linkedin';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { globalLoading } from '@/containers/actions/emitter.action';
import { EnvLinkedIn, ROOT_ROUTES } from '@/constants';
import { authSlice } from '@/stores/reducers';

export const MethodOneStyled = styled.TouchableOpacity`
  padding-top: ${scale(25)}px;
`;
interface Props {
  button: React.ReactNode;
  gotoSurvey?: () => void;
}

const LinkedInComponent = (props: Props) => {
  const dispatch = useDispatch<TAppDispatch>();
  const linkedRef = React.createRef<LinkedInModal>();

  const _openLinkedin = async () => {
    linkedRef.current?.open();
  };

  const renderButton = () => {
    return (
      <TouchableOpacity onPress={_openLinkedin} activeOpacity={0.8}>
        {props.button}
      </TouchableOpacity>
    );
  };
  const onSuccess = async (token: LinkedInToken) => {
    try {
      globalLoading(true);
      const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);
      const res_linkedin = await authController.loginLinkedin(token.authentication_code, signupCode!);
      if (res_linkedin.status) {
        authSlice.actions.setProfile(res_linkedin.data);
        dispatch(loginSocial(res_linkedin.data));
        // await linkedRef.current?.logoutAsync();
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('', error.error);
    } finally {
      globalLoading();
    }
  };
  const onError = (error: ErrorType) => {
    console.log(error, `onError`);
  };
  const onClose = () => {
    console.log(`close`);
  };
  const onOpen = async () => {
    // await linkedRef.current?.logoutAsync();
  };

  return (
    <LinkedInModal
      ref={linkedRef}
      shouldGetAccessToken={false}
      clientID={EnvLinkedIn.LI_CLIENT_ID}
      redirectUri={EnvLinkedIn.LI_REDIRECT_URI}
      permissions={['r_liteprofile', 'r_emailaddress']}
      onSuccess={onSuccess}
      onOpen={onOpen}
      onError={onError}
      onClose={onClose}
      renderButton={renderButton}
      animationType={'slide'}
    />
  );
};

export default React.memo(LinkedInComponent);
