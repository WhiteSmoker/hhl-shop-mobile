import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { ASYNC_STORE, storage } from '@/storage';
import { selectAuth } from '@/stores/selectors';
import { ContainerStyled } from '@/styles/styled-component';
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  ProfileImageStyled,
  ProfileImageViewContentStyled,
  ProfileImageViewStyled,
  SkipTextStyled,
  SkipViewTextStyled,
  TextStyled,
  TouchRegisterStyled,
  TouchRegisterTextStyled,
  ViewStyled,
} from './ChoosePhoto.style';
import Toast from 'react-native-toast-message';
import { IProps, IState } from './ChoosePhoto.prop';
import ImagePicker from 'react-native-image-crop-picker';
import { format } from 'date-fns';
import RNFetchBlob from 'rn-fetch-blob';
import { _uploadPresignedUrl, getType } from '@/utils/helper';
import { authController } from '@/controllers';
import UserIconSvg from '@/assets/icons/user_icon.svg';
import { globalLoading } from '@/containers/actions/emitter.action';
import { loginAfterSignup } from '@/stores/thunks/auth.thunk';
import { TAppDispatch } from '@/stores';
import { requestStoragePermission } from '@/utils/permission';

export const ChoosePhotoComponent = (props: IProps) => {
  const dispatch = useDispatch<TAppDispatch>();
  const registerState = useSelector(selectAuth);
  const [state, setState] = useState<IState>({
    uri: '',
  });

  const _chooseImage = async () => {
    const permission = await requestStoragePermission();
    if (!permission) {
      return;
    }
    const result = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.5,
    });
    const img = {
      uri: result.path,
      data: RNFetchBlob.wrap(Platform.OS === 'android' ? result.path : result.path.replace('file://', '')),
      type: result.mime || 'image/jpeg',
      name: format(new Date(), 't'),
      filename: format(new Date(), 't') + getType(result.mime || 'image/jpeg'),
    };
    setState(preState => ({ ...preState, uri: result.path, image: img }));
  };

  const _navigate = (isSkip: boolean) => async () => {
    try {
      const { email, firstName, lastName, displayName, password } = registerState;
      globalLoading(true);
      let url = '';
      if (!isSkip && state.image) {
        const imgS3 = await _uploadPresignedUrl(state.image);
        url = imgS3?.url ?? '';
      }
      const signupCode = await storage.getItem(ASYNC_STORE.SIGNUP_CODE);

      const res_register = await authController.register({
        email,
        firstName,
        lastName,
        displayName,
        avatar: url || '',
        password,
        signupCode,
      });
      if (res_register.status === 1) {
        Toast.show({
          type: 'success',
          text1: 'You have signed up successfully.',
          text2: 'You may login now to use Stump service.',
        });
        // props.navigation.push(AUTH_NAVIGATION.SURVEY_FAV);
        dispatch(loginAfterSignup(res_register.data));
      }
    } catch (error: any) {
      Alert.alert('', error.error);
    } finally {
      globalLoading();
    }
  };

  return (
    <DismissKeyboard>
      <ContainerStyled>
        <ViewStyled>
          <SkipViewTextStyled onPress={_navigate(true)}>
            <SkipTextStyled>Skip</SkipTextStyled>
          </SkipViewTextStyled>
          <ProfileImageViewStyled onPress={_chooseImage}>
            <ProfileImageViewContentStyled>
              {!state.uri ? <UserIconSvg /> : <ProfileImageStyled source={{ uri: state.uri }} sizeImage={200} />}
            </ProfileImageViewContentStyled>
          </ProfileImageViewStyled>

          <TextStyled>Select image from gallery</TextStyled>
          <TouchRegisterStyled onPress={_navigate(false)} marginTop={60}>
            <TouchRegisterTextStyled>Next</TouchRegisterTextStyled>
          </TouchRegisterStyled>
        </ViewStyled>
      </ContainerStyled>
    </DismissKeyboard>
  );
};
