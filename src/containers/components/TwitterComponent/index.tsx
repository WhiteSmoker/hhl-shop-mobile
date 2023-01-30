import React from 'react';
import { Alert, Linking, NativeModules, Platform, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Share from 'react-native-share';
import { ASYNC_STORE, storage } from '@/storage';
import { authController } from '@/controllers';
import { loginSocial } from '@/stores/thunks/auth.thunk';
import { TAppDispatch } from '@/stores';
import { globalLoading } from '@/containers/actions/emitter.action';
import { EnvTwitter, ROOT_ROUTES } from '@/constants';
import { authSlice } from '@/stores/reducers';

export const { RNTwitterSignIn } = NativeModules;

interface Props {
  button: React.ReactNode;
  gotoSurvey?: () => void;
}
const TwitterComponent = (props: Props) => {
  const dispatch = useDispatch<TAppDispatch>();

  const _configureTwitterSignin = () => {
    RNTwitterSignIn.init(EnvTwitter.TWITTER_KEY, EnvTwitter.TWITTER_SECRET);
  };

  const loginTwitter = async (auth: any) => {
    try {
      globalLoading(true);
      const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);
      const res_twitter = await authController.loginTwitter({ ...auth, signupCode });
      if (res_twitter.status) {
        authSlice.actions.setProfile(res_twitter.data);
        dispatch(loginSocial(res_twitter.data));
      }
    } catch (error: any) {
      Alert.alert('', error.error);
    } finally {
      globalLoading();
    }
  };

  const _onTwitterButtonPress = async () => {
    try {
      if (Platform.OS === 'ios') {
        _configureTwitterSignin();
        const auth = await RNTwitterSignIn.logIn();
        await loginTwitter(auth);
      } else {
        const { isInstalled } = await Share.isPackageInstalled('com.twitter.android');
        if (isInstalled) {
          _configureTwitterSignin();
          const auth = await RNTwitterSignIn.logIn();
          await loginTwitter(auth);
        } else {
          const oauth_callback = encodeURIComponent('stump://app/twitter');
          const response = await authController.twitterRequestToken();

          if (response.data.oauth_token) {
            await Linking.openURL(
              `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.oauth_token}&oauth_callback=${oauth_callback}`,
            );
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity onPress={_onTwitterButtonPress} activeOpacity={0.8}>
      {props.button}
    </TouchableOpacity>
  );
};
export default React.memo(TwitterComponent);
