import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ILoginProps } from './Login.prop';
import {
  styles,
  TextErrorStyled,
  TextInputStyled,
  TextLoginStyled,
  TextOrStyled,
  ViewBtnLoginStyled,
  ViewBtnSocial,
  ViewForgotPasswordStyled,
  ViewLoginSocialStyled,
  ViewSigninStyled,
} from './Login.style';
import { ContainerStyled } from '@/styles/styled-component';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import React, { Fragment, useEffect } from 'react';
import TwitterComponent from '@/containers/components/TwitterComponent';
import LinkedInComponent from '@/containers/components/LinkedInComponent';
import FacebookComponent from '@/containers/components/FacebookComponent';
import AppleLoginComponent from '@/containers/components/AppleLoginComponent';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { Colors } from '@/theme/colors';
import { SocialIcon } from 'react-native-elements';
import { AUTH_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import MainLogoSvg from '@/assets/icons/header/Logo1.svg';
import MainLogo2Svg from '@/assets/icons/header/Logo2.svg';
import { fetchDataFirstTime, fetchLogin } from '@/stores/thunks/auth.thunk';
import { TAppDispatch } from '@/stores';
import SplashScreen from 'react-native-splash-screen';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AppleIcon from '@/assets/icons/AppleIcon.svg';
import { ASYNC_STORE, storage } from '@/storage';
import { spacing } from '@/theme';
import { networkService } from '@/networking';

const schema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
  password: Yup.string().min(6, 'The password must be at least 6 characters').required('Please enter your password'),
});

export const Login = (props: ILoginProps) => {
  const dispatch = useDispatch<TAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange', resolver: yupResolver(schema) });

  const _fetchUser = async () => {
    const token = await storage.getItem(ASYNC_STORE.TOKEN_ID);

    if (token) {
      networkService.setAccessToken(token);
      dispatch(fetchDataFirstTime(false));
    } else {
      SplashScreen.hide();
    }
  };

  useEffect(() => {
    //fetch user
    _fetchUser();
  }, []);

  const buttonNodeLinked = React.useMemo(() => <SocialIcon type="linkedin" iconSize={scale(24)} />, []);
  const buttonNodeTwitter = React.useMemo(() => <SocialIcon type="twitter" iconSize={scale(24)} />, []);
  const buttonNodeFB = React.useMemo(() => <SocialIcon type="facebook" iconSize={scale(22)} />, []);
  const buttonNodeApple = React.useMemo(
    () => (
      <View style={styles.view_icon_apple}>
        <AppleIcon width={scale(24)} height={scale(24)} />
      </View>
    ),
    [],
  );

  const _gotoSignup = () => {
    // props.navigation.push(AUTH_NAVIGATION.REGISTER);
    props.navigation.push(ROOT_ROUTES.SIGN_UP_SURVEY);
  };
  const _gotoForgotPassword = () => {
    props.navigation.navigate(AUTH_NAVIGATION.FORGOT_PASSWORD);
  };

  const _gotoSurvey = () => {
    props.navigation.navigate(AUTH_NAVIGATION.SURVEY_FAV);
  };

  const onSubmit = (data: any) => {
    dispatch(fetchLogin(data));
  };

  return (
    <ContainerStyled style={styles.container}>
      <KeyboardAwareScrollView
        style={{ width: '100%', paddingHorizontal: Platform.OS === 'ios' ? scale(spacing.s) : 0 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}>
        <StatusBar translucent={true} backgroundColor="transparent" />
        <View style={styles.viewLogo}>
          <MainLogoSvg width={scale(100)} height={scale(100)} style={{ marginBottom: 10 }} />
          <MainLogo2Svg width={scale(200)} height={scale(27)} />
        </View>
        <Fragment>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputStyled
                autoCapitalize="none"
                keyboardType={'email-address'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Email"
              />
            )}
            name="email"
            defaultValue={''}
          />
          {errors.email && <TextErrorStyled>{errors.email?.message ?? ' '}</TextErrorStyled>}
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputStyled
                marginTop={16}
                autoCapitalize="none"
                secureTextEntry={true}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
              />
            )}
            name="password"
            defaultValue={''}
          />
          {errors.password && <TextErrorStyled>{errors.password?.message ?? ' '}</TextErrorStyled>}

          <ViewForgotPasswordStyled>
            <TouchableOpacity onPress={_gotoForgotPassword}>
              <TextOrStyled color={Colors.Pure_Yellow} style={{ fontWeight: 'bold' }}>
                Forgot Password?
              </TextOrStyled>
            </TouchableOpacity>
          </ViewForgotPasswordStyled>

          <ViewBtnLoginStyled
            backgroundColor={Colors.Background3}
            onPress={handleSubmit(onSubmit)}
            style={[styles.shadow]}>
            <TextLoginStyled>Sign in</TextLoginStyled>
          </ViewBtnLoginStyled>
          <View style={styles.underlineView}>
            <HorizontalRuleComponent width={'100%'} height={scale(0.5)} color={'#F0F4F6'} />
            <View style={styles.orView}>
              <View style={{ marginHorizontal: scale(10) }}>
                <TextOrStyled>Or</TextOrStyled>
              </View>
            </View>
          </View>
          <TextOrStyled style={{ marginBottom: scale(16) }}>Sign in with other network accounts </TextOrStyled>
          <ViewLoginSocialStyled>
            <FacebookComponent button={buttonNodeFB} gotoSurvey={_gotoSurvey} />
            <TwitterComponent button={buttonNodeTwitter} gotoSurvey={_gotoSurvey} />
            <LinkedInComponent button={buttonNodeLinked} gotoSurvey={_gotoSurvey} />
            {Platform.OS === 'ios' && <AppleLoginComponent button={buttonNodeApple} gotoSurvey={_gotoSurvey} />}
          </ViewLoginSocialStyled>
        </Fragment>
        <HorizontalRuleComponent width={0} height={scale(64)} color={'transparent'} />

        <ViewSigninStyled onPress={_gotoSignup}>
          <View style={[{ marginRight: scale(8) }]}>
            <TextOrStyled>
              <TextOrStyled color={Colors.white}>Don’t have an account?</TextOrStyled>
            </TextOrStyled>
          </View>
          <View>
            <TextOrStyled>
              <TextOrStyled color={Colors.Pure_Yellow} style={{ fontWeight: 'bold' }}>
                Sign up!
              </TextOrStyled>
            </TextOrStyled>
          </View>
        </ViewSigninStyled>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
