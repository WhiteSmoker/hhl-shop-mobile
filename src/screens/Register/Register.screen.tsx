import { REG_EMAIL } from '@/constants';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { setProfile } from '@/stores/reducers';
import { commonStyles } from '@/styles/common';
import { ContainerStyled } from '@/styles/styled-component';
import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';
import React, { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Linking, Platform, StatusBar, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import {
  styles,
  TextErrorStyled,
  TextInputStyled,
  TextLoginStyled,
  TextOrStyled,
  ViewBtnLoginStyled,
  ViewSigninStyled,
} from '../Login/Login.style';
import { IProps } from './Register.prop';

import { globalLoading } from '@/containers/actions/emitter.action';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  checkbox: boolean;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .matches(REG_EMAIL, 'Please enter a valid email address')
    .required('Please enter your email address'),
  password: Yup.string().min(6, 'The password must be at least 6 characters').required('Please enter your password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please enter confirm password'),
  checkbox: Yup.boolean().required('You must agree to the Terms.').oneOf([true], 'You must agree to the Terms.'),
});

export const RegisterComponent = (props: IProps) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string; confirmPassword: string; checkbox: boolean }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const _gotoSignin = () => {
    props.navigation.pop();
  };
  const _link = (type: 'term' | 'policy') => async () => {
    if (type === 'term') {
      await Linking.openURL('https://www.getstump.com/terms');
    } else {
      await Linking.openURL('https://www.getstump.com/privacy');
    }
  };

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      globalLoading(true);
      dispatch(setProfile({ email, password }));
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.error);
    } finally {
      globalLoading();
    }
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
        <KeyboardAvoidingView>
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
            {errors.email && errors.email?.message && <TextErrorStyled>{errors.email?.message}</TextErrorStyled>}
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
            {errors.password && errors.password?.message && (
              <TextErrorStyled>{errors.password?.message}</TextErrorStyled>
            )}
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
                  placeholder="Confirm Password"
                />
              )}
              name="confirmPassword"
              defaultValue={''}
            />
            {errors.confirmPassword && errors.confirmPassword?.message && (
              <TextErrorStyled>{errors.confirmPassword?.message}</TextErrorStyled>
            )}
            <View style={[commonStyles.flexRow, { marginTop: scale(12) }]}>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CheckBox
                    checkedIcon={
                      <Icon
                        name="checkbox-outline"
                        size={scale(19)}
                        color={Colors.Pure_Yellow}
                        style={styles.CheckBoxContainer}
                      />
                    }
                    uncheckedIcon={
                      <Icon
                        name="square-outline"
                        size={scale(19)}
                        color={Colors.White}
                        style={styles.CheckBoxContainer}
                      />
                    }
                    containerStyle={styles.CheckBoxContainer}
                    activeOpacity={0.8}
                    textStyle={styles.CheckBoxText}
                    onPress={() => {
                      onChange(!value);
                    }}
                    checked={value}
                  />
                )}
                name="checkbox"
                defaultValue={false}
              />
              <View style={{ width: '90%' }}>
                <TextOrStyled color={Colors.white} textAlign={'left'}>
                  I have read and agree to the{' '}
                  <TextOrStyled color={Colors.White} textDecorationLine={'underline'} onPress={_link('term')}>
                    Terms of Conditions
                  </TextOrStyled>
                  <TextOrStyled color={Colors.White}> and</TextOrStyled>{' '}
                  <TextOrStyled color={Colors.White} textDecorationLine={'underline'} onPress={_link('policy')}>
                    Privacy Policy
                  </TextOrStyled>
                </TextOrStyled>
              </View>
            </View>
            {errors.checkbox && errors.checkbox?.message && (
              <TextErrorStyled>{errors.checkbox?.message}</TextErrorStyled>
            )}

            <ViewBtnLoginStyled backgroundColor={Colors.Light_Blue} onPress={handleSubmit(onSubmit)} marginTop={22}>
              <TextLoginStyled>Sign up</TextLoginStyled>
            </ViewBtnLoginStyled>
          </Fragment>

          <HorizontalRuleComponent width={scale(1)} color={Colors.white} marginTop={66} />
          <ViewSigninStyled onPress={_gotoSignin}>
            <View style={[{ marginRight: scale(8) }]}>
              <TextOrStyled>
                <TextOrStyled color={Colors.white}>Already have an account?</TextOrStyled>
              </TextOrStyled>
            </View>
            <View>
              <TextOrStyled>
                <TextOrStyled color={Colors.Pure_Yellow} style={{ fontWeight: 'bold' }}>
                  Sign in!
                </TextOrStyled>
              </TextOrStyled>
            </View>
          </ViewSigninStyled>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
