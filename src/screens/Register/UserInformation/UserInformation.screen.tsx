import { AUTH_NAVIGATION, VALIDATION_INPUT } from '@/constants';
import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { userController } from '@/controllers';
import { setProfile } from '@/stores/reducers';
import React, { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { IProps } from './UserInformation.prop';
import {
  TextErrorStyled,
  TextInputStyled,
  TouchRegisterStyled,
  TouchRegisterTextStyled,
  ViewStyled,
  ViewTextInputStyled,
} from './UserInformation.style';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ContainerStyled } from '@/styles/common';

type FormData = {
  firstName: string;
  lastName: string;
  displayName: string;
};

const schema = Yup.object().shape({
  firstName: Yup.string().required('Please enter your first name'),
  lastName: Yup.string().required('Please enter your last name'),
  displayName: Yup.string()
    .required('Please enter your display name')
    .matches(VALIDATION_INPUT.NAME.regex, VALIDATION_INPUT.NAME.message),
});

export const UserInformationComponent = (props: IProps) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ firstName: string; lastName: string; displayName: string }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await userController.validateName(data.displayName);
      dispatch(setProfile(data));
      props.navigation.push(AUTH_NAVIGATION.CHOOSE_AVATAR);
    } catch (error: any) {
      Alert.alert('', error.error);
      console.log(error);
    }
  };

  return (
    <DismissKeyboard>
      <ContainerStyled>
        <ViewStyled>
          <Fragment>
            <ViewTextInputStyled marginTop={60}>
              <Controller
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputStyled
                    autoCapitalize="none"
                    keyboardType={'email-address'}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="First Name"
                  />
                )}
                name="firstName"
                defaultValue={''}
              />
            </ViewTextInputStyled>
            {errors.firstName && errors.firstName?.message && (
              <TextErrorStyled>{errors.firstName?.message}</TextErrorStyled>
            )}
            <ViewTextInputStyled marginTop={40}>
              <Controller
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputStyled
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Last Name"
                  />
                )}
                name="lastName"
                defaultValue={''}
              />
            </ViewTextInputStyled>
            {errors.lastName && errors.lastName?.message && (
              <TextErrorStyled>{errors.lastName?.message}</TextErrorStyled>
            )}
            <ViewTextInputStyled marginTop={40}>
              <Controller
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputStyled
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Display Name"
                  />
                )}
                name="displayName"
                defaultValue={''}
              />
            </ViewTextInputStyled>

            {errors.displayName && errors.displayName?.message && (
              <TextErrorStyled>{errors.displayName?.message}</TextErrorStyled>
            )}

            <TouchRegisterStyled onPress={handleSubmit(onSubmit)} marginTop={60} style={{ backgroundColor: 'red' }}>
              <TouchRegisterTextStyled>Next</TouchRegisterTextStyled>
            </TouchRegisterStyled>
          </Fragment>
        </ViewStyled>
      </ContainerStyled>
    </DismissKeyboard>
  );
};
