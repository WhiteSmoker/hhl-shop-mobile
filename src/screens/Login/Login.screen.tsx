import { AUTH_NAVIGATION } from '@/constants';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { networkService } from '@/networking';
import { ASYNC_STORE, storage } from '@/storage';
import { TAppDispatch } from '@/stores';
import { fetchLogin } from '@/stores/thunks/auth.thunk';
import { ContainerStyled } from '@/styles/styled-component';
import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ILoginProps } from './Login.prop';
import {
  styles,
  TextErrorStyled,
  TextInputStyled,
  TextLoginStyled,
  TextOrStyled,
  ViewBtnLoginStyled,
  ViewForgotPasswordStyled,
  ViewSigninStyled,
} from './Login.style';

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
      // dispatch(fetchDataFirstTime(false));
    } else {
      SplashScreen.hide();
    }
  };

  useEffect(() => {
    //fetch user
    _fetchUser();
  }, []);

  const _gotoSignup = () => {
    props.navigation.push(AUTH_NAVIGATION.REGISTER);
  };
  const _gotoForgotPassword = () => {
    props.navigation.navigate(AUTH_NAVIGATION.FORGOT_PASSWORD);
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
        <View style={styles.viewLogo} />
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
                placeholder="Username"
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
              <TextOrStyled color={Colors.Strong_Blue} style={{ fontWeight: 'bold' }}>
                Forgot Password?
              </TextOrStyled>
            </TouchableOpacity>
          </ViewForgotPasswordStyled>

          <ViewBtnLoginStyled
            backgroundColor={Colors.Strong_Blue}
            onPress={handleSubmit(onSubmit)}
            style={[styles.shadow]}>
            <TextLoginStyled>Sign in</TextLoginStyled>
          </ViewBtnLoginStyled>
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
              <TextOrStyled color={Colors.Strong_Blue} style={{ fontWeight: 'bold' }}>
                Sign up!
              </TextOrStyled>
            </TextOrStyled>
          </View>
        </ViewSigninStyled>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
