import React, { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
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

import { AUTH_NAVIGATION } from '@/constants';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { networkService } from '@/networking';
import { ASYNC_STORE, storage } from '@/storage';
import { TAppDispatch } from '@/stores';
import { setUserInfo } from '@/stores/reducers';
import { fetchLogin } from '@/stores/thunks/auth.thunk';
import { ContainerStyled } from '@/styles/styled-component';
import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';

const schema = Yup.object().shape({
  username: Yup.string().required('Please enter your user name'),
  password: Yup.string().required('Please enter your password'),
});

export const Login = (props: ILoginProps) => {
  const dispatch = useDispatch<TAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<{ username: string; password: string }>({ mode: 'onChange', resolver: yupResolver(schema) });

  const _fetchUser = async () => {
    const token = await storage.getItem(ASYNC_STORE.TOKEN_ID);
    const user = await storage.getItem(ASYNC_STORE.MY_USER);
    if (token) {
      networkService.setAccessToken(token);
    }
    if (user) {
      dispatch(setUserInfo(JSON.parse(user)));
    }
  };

  useEffect(() => {
    _fetchUser();
  }, []);

  const _gotoSignup = () => {
    props.navigation.push(AUTH_NAVIGATION.REGISTER);
  };
  const _gotoForgotPassword = () => {
    props.navigation.navigate(AUTH_NAVIGATION.FORGOT_PASSWORD);
  };

  const onSubmit = async (data: any) => {
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
                keyboardType={'default'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tên người dùng"
              />
            )}
            name="username"
            defaultValue={''}
          />
          {errors.username && <TextErrorStyled>{errors.username?.message ?? ' '}</TextErrorStyled>}
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
                placeholder="Mật khẩu"
              />
            )}
            name="password"
            defaultValue={''}
          />
          {errors.password && <TextErrorStyled>{errors.password?.message ?? ' '}</TextErrorStyled>}

          <ViewForgotPasswordStyled>
            <TouchableOpacity onPress={_gotoForgotPassword}>
              <TextOrStyled color={Colors.Strong_Blue} style={{ fontWeight: 'bold' }}>
                Quên mật khẩu
              </TextOrStyled>
            </TouchableOpacity>
          </ViewForgotPasswordStyled>

          <ViewBtnLoginStyled
            backgroundColor={Colors.Strong_Blue}
            onPress={handleSubmit(onSubmit)}
            style={[styles.shadow]}>
            <TextLoginStyled>Đăng nhập</TextLoginStyled>
          </ViewBtnLoginStyled>
        </Fragment>
        <HorizontalRuleComponent width={0} height={scale(64)} color={'transparent'} />

        <ViewSigninStyled onPress={_gotoSignup}>
          <View style={[{ marginRight: scale(8) }]}>
            <TextOrStyled>
              <TextOrStyled color={Colors.white}>Không có tài khoản?</TextOrStyled>
            </TextOrStyled>
          </View>
          <View>
            <TextOrStyled>
              <TextOrStyled color={Colors.Strong_Blue} style={{ fontWeight: 'bold' }}>
                Đăng ký
              </TextOrStyled>
            </TextOrStyled>
          </View>
        </ViewSigninStyled>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
