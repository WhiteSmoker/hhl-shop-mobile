import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { ContainerStyled } from '@/styles/styled-component';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import {
  TextErrorStyled,
  TextInputStyled,
  TextSubTitle,
  TextTitle,
  TouchForgotPasswordStyled,
  TouchForgotPasswordTextStyled,
  ViewStyled,
  ViewTextInputStyled,
} from './ForgotPassword.style';
import * as Yup from 'yup';
import { AUTH_NAVIGATION } from '@/constants';
import Toast from 'react-native-toast-message';
import { globalLoading } from '@/containers/actions/emitter.action';
import { authController } from '@/controllers';
import { IProps } from './ForgotPassword.prop';

const schema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
});

export const ForgotPassword = (props: IProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange', resolver: yupResolver(schema) });

  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    try {
      globalLoading(true);
      await authController.forgotPassword(email);
      props.navigation.navigate(AUTH_NAVIGATION.CHANGE_PASSWORD, { email });
      Toast.show({
        type: 'success',
        text1: 'Code sent! Please check your email',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message?.toString(),
      });
    } finally {
      globalLoading(false);
    }
  };
  return (
    <DismissKeyboard>
      <ContainerStyled>
        <ViewStyled>
          {/* <Formik initialValues={initialValues} onSubmit={_onSubmit} validationSchema={_validationSchema}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => ( */}
          <View>
            <TextTitle>Forgot Password</TextTitle>
            <TextSubTitle>Enter your registered email in the box below to reset your password</TextSubTitle>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputStyled
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Enter your email"
                  />
                )}
                name="email"
                defaultValue={''}
              />
            </ViewTextInputStyled>
            {errors.email && <TextErrorStyled>{errors.email?.message ?? ' '}</TextErrorStyled>}
            <TouchForgotPasswordStyled onPress={handleSubmit(onSubmit)}>
              <TouchForgotPasswordTextStyled>Submit</TouchForgotPasswordTextStyled>
            </TouchForgotPasswordStyled>
          </View>
          {/* )}
          </Formik> */}
        </ViewStyled>
      </ContainerStyled>
    </DismissKeyboard>
  );
};
