import { APP_NAVIGATION, PHONE_STATUS } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { authController, stumpController, userController } from '@/controllers';
import { navigationRef } from '@/navigators/refs';
import { ASYNC_STORE, storage } from '@/storage';
import { useAppDispatch } from '@/stores';
import { commonSlice } from '@/stores/reducers';
import { loginSocial } from '@/stores/thunks/auth.thunk';
import { urlToObject } from '@/utils/format';
import { _checkExistEmail, promptHelper } from '@/utils/helper';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { AUTH_NAVIGATION, ROOT_ROUTES } from '../constants/navigation';
import { EDeviceEmitter, emitter } from './useEmitter';

const useDeepLink = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // deep link
    Linking.getInitialURL()
      .then(url => _handleOpenURL({ url }))
      .catch(console.error);
    Linking.addEventListener('url', _handleOpenURL);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  //handle deep link url
  const _handleOpenURL = async (deepLinkUrl: { url: string | null }) => {
    const token = await storage.getItem(ASYNC_STORE.TOKEN_ID);
    if (deepLinkUrl.url && deepLinkUrl.url?.indexOf('app/inviteConversation') !== -1) {
      handleInvitationEmail(deepLinkUrl.url, token);
    }
    if (deepLinkUrl.url && deepLinkUrl.url?.indexOf('app/consume') !== -1) {
      const info = deepLinkUrl.url?.substring(deepLinkUrl.url?.indexOf('app/consume') + 'app/consume'.length + 1);
      if (token) {
        const res = await stumpController.getDetailStump(Number(info));
        if (res.status === 1 && res.data[0]) {
          dispatch(commonSlice.actions.setPlayStump({ ...res.data[0], screen: APP_NAVIGATION.HOME }));
        }
      } else {
        emitter(EDeviceEmitter.DEEP_LINK_PLAY_STUMP, Number(info));
      }
    }
    if (deepLinkUrl.url && deepLinkUrl.url?.indexOf('app/inviteFromContact') !== -1) {
      handleInvitationContact(deepLinkUrl.url, token);
    }
    if (deepLinkUrl.url && deepLinkUrl.url?.indexOf('app/twitter') !== -1) {
      handleTwitterLogin(deepLinkUrl.url);
    }
  };

  const handleInvitationEmail = async (url: string, token: string | null) => {
    const info = url.substring(url.indexOf('app/inviteConversation') + 'app/inviteConversation'.length + 1);
    const [invite_value, inviteCode] = info.split('/'); //email or phone number
    console.log(info.split('/'));

    //check exist email
    if (invite_value?.indexOf('@') !== -1) {
      await storage.setItem(ASYNC_STORE.INVITE_CODE, inviteCode);
      emitter(EDeviceEmitter.DEEP_LINK_INVITATION, {
        invitationCode: inviteCode,
        invitationValue: invite_value,
      });
      if (!token) {
        const existEmail = await _checkExistEmail(invite_value);
        if (existEmail) {
          // navigate login
          navigationRef?.current?.navigate(ROOT_ROUTES.AUTH_NAVIGATION, {
            screen: AUTH_NAVIGATION.LOGIN,
            initial: false,
          });
        } else {
          // navigate sign up
          navigationRef?.current?.navigate(ROOT_ROUTES.AUTH_NAVIGATION, {
            screen: AUTH_NAVIGATION.REGISTER,
            initial: false,
          });
        }
      }
    } else {
      if (token) {
        await flowVerifyOTP(invite_value, inviteCode);
      } else {
        navigationRef?.current?.navigate(ROOT_ROUTES.AUTH_NAVIGATION, {
          screen: AUTH_NAVIGATION.REGISTER,
          initial: false,
        });
      }
    }
  };

  const handleInvitationContact = async (url: string, token: string | null) => {
    const info = url.substring(url.indexOf('app/inviteFromContact') + 'app/inviteFromContact'.length + 1);
    const [phone, inviteCode] = info.split('/');
    await storage.setItem(ASYNC_STORE.SIGNUP_CODE, inviteCode);
    if (token) {
      await flowVerifyOTP(phone, inviteCode);
    } else {
      navigationRef?.current?.navigate(ROOT_ROUTES.AUTH_NAVIGATION, {
        screen: AUTH_NAVIGATION.REGISTER,
        initial: false,
      });
    }
  };
  const handleTwitterLogin = async (url: string) => {
    const redirectUrl = url.substring(url.indexOf('app/twitter') + 'app/twitter'.length + 1);
    try {
      globalLoading(true);
      const { oauth_token, oauth_verifier } = urlToObject<{ oauth_token: string; oauth_verifier: string }>(redirectUrl);
      const response = await authController.twitterVerifyCredentials(oauth_token, oauth_verifier);

      const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);

      const res_twitter = await authController.loginTwitter({
        ...response.data,
        signupCode,
      });
      if (res_twitter.status) {
        dispatch(loginSocial(res_twitter.data));
      }
    } catch (error: any) {
      Alert.alert('', error.error);
    } finally {
      globalLoading();
    }
  };

  const flowVerifyOTP = async (phone: string, inviteCode: string) => {
    const type = await validatePhoneNumber(phone);
    if (type === PHONE_STATUS.UNREGISTERED) {
      await userController.updatePhoneNumber(phone);
    }
    if (type === PHONE_STATUS.NEW) {
      await promptHelper('', 'This is a new phone number. Do you want to update your profile with it?', 'No', 'Yes');
      await userController.updatePhoneNumber(phone);
    }
    if (type === PHONE_STATUS.CLAIMED) {
      await promptHelper('', 'Someone is using this phone number already. Do you want to verify it?', 'No', 'Yes');

      await userController.sendOtp(phone);
      emitter(EDeviceEmitter.DEEP_LINK_INVITATION, {
        invitationCode: inviteCode,
        hasOTP: true,
        invitationValue: phone,
      });
      return;
    }
    emitter(EDeviceEmitter.DEEP_LINK_INVITATION, {
      invitationCode: inviteCode,
      invitationValue: phone,
    });
    await storage.setItem(ASYNC_STORE.INVITE_CODE, inviteCode);
  };
};

export const validatePhoneNumber = async (phone: string) => {
  try {
    const res_validate = await userController.checkValidatePhoneNumber(phone);
    if (res_validate.status === 1) {
      return res_validate.data.type;
    }
    return 0;
  } catch (error) {
    console.log(error);
  }
};

export default useDeepLink;
