import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { ContainerStyled } from '@/styles/styled-component';
import React, { Fragment } from 'react';
import { IProps } from './ChangePassword.prop';
import {
  TextCodeInputStyled,
  TextErrorStyled,
  TextInputStyled,
  TouchChangePasswordStyled,
  TouchChangePasswordTextStyled,
  ViewErrorStyled,
  ViewStyled,
  ViewTextInputStyled,
} from './ChangePassword.style';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { authController } from '@/controllers';
import { AUTH_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { useDispatch } from 'react-redux';
import { TAppDispatch, useAppSelector } from '@/stores';
import { logOut } from '@/stores/thunks/auth.thunk';
type FormData = {
  newPassword: string;
  confirmPassword: string;
  code?: string;
};

const schema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'The password must be at least 6 characters')
    .required('Please enter your new password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Please enter confirm password'),
  code: Yup.string(),
});

export const ChangePasswordComponent = (props: IProps) => {
  const user = useAppSelector(state => state.userState.userInfo);
  const dispatch = useDispatch<TAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string; code: string }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { newPassword, code } = data;
    const email = props?.route?.params?.email || '';
    try {
      globalLoading(true);
      const res = user
        ? await authController.changePassword(email, newPassword)
        : await authController.changePassword(email, newPassword, code);
      if (res.status === 1) {
        Toast.show({
          type: 'success',
          text1: 'Your password has been changed',
        });
        dispatch(logOut({ url: `user/removeDevice` }));
        if (user) {
          props.navigation?.goBack();
        } else {
          props.navigation?.navigate(AUTH_NAVIGATION.LOGIN);
        }
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '',
        text2: error.message || error.error,
      });
    } finally {
      globalLoading(false);
    }
  };
  return (
    <DismissKeyboard>
      <ContainerStyled>
        <ViewStyled>
          <ViewTextInputStyled>
            <Controller
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInputStyled
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="New Password"
                  secureTextEntry={true}
                />
              )}
              name="newPassword"
              defaultValue={''}
            />
          </ViewTextInputStyled>
          <ViewErrorStyled marginTop={scale(10)}>
            {errors.newPassword && <TextErrorStyled>{errors.newPassword?.message ?? ' '}</TextErrorStyled>}
          </ViewErrorStyled>
          <ViewTextInputStyled marginTop={scale(10)}>
            <Controller
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInputStyled
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                />
              )}
              name="confirmPassword"
              defaultValue={''}
            />
          </ViewTextInputStyled>
          <ViewErrorStyled marginTop={scale(10)}>
            {errors.confirmPassword && <TextErrorStyled>{errors.confirmPassword?.message ?? ' '}</TextErrorStyled>}
          </ViewErrorStyled>
          {!user && (
            <Fragment>
              <ViewTextInputStyled marginTop={scale(30)}>
                <Controller
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextCodeInputStyled onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Code" />
                  )}
                  name="code"
                  defaultValue={''}
                />
              </ViewTextInputStyled>

              <ViewErrorStyled marginTop={scale(25)}>
                {errors.code && <TextErrorStyled>{errors.code?.message ?? ' '}</TextErrorStyled>}
              </ViewErrorStyled>
            </Fragment>
          )}
          <TouchChangePasswordStyled onPress={handleSubmit(onSubmit)} marginTop={scale(15)}>
            <TouchChangePasswordTextStyled>Submit</TouchChangePasswordTextStyled>
          </TouchChangePasswordStyled>
        </ViewStyled>
      </ContainerStyled>
    </DismissKeyboard>
  );
};
