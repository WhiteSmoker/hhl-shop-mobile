import { PHONE_STATUS, VALIDATION_INPUT } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { userController } from '@/controllers';
import { validatePhoneNumber } from '@/hooks/useDeepLink';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { TextErrorStyled } from '@/screens/Login/Login.style';
import { IImage } from '@/screens/Register/ChoosePhoto/ChoosePhoto.prop';
import { ASYNC_STORE, storage } from '@/storage';
import { useAppDispatch } from '@/stores';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { _uploadPresignedUrl, getType, promptHelper } from '@/utils/helper';
import { requestStoragePermission } from '@/utils/permission';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { parsePhoneNumber } from 'libphonenumber-js';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import { CountryCode } from 'react-native-country-picker-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import * as Yup from 'yup';
import ModalVerifyOTP from './ModalVerifyOTP';
import { Props } from './propState';
import {
  CreateTouchStyled,
  MediumTextStyled,
  NormalTextStyled,
  styles,
  TextAreaStyled,
  TextInputStyled,
  TextTitleStyled,
  ViewTextInputStyled,
} from './styles';

type FormDataEdit = {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  described: string;
  website: string;
};
export type IState = {
  uri: string;
  image?: IImage;
  showModal: boolean;
};

const schema = Yup.object().shape({
  email: Yup.string().required('Please enter your email address.').email('Please enter a valid email address.'),
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  displayName: Yup.string()
    .required('This field is required')
    .matches(VALIDATION_INPUT.NAME.regex, VALIDATION_INPUT.NAME.message),
  described: Yup.string(),
  website: Yup.string()
    .matches(
      /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
      'Please enter a valid URL.',
    )
    .notRequired(),
});

const EditProfileComponent = (props: Props) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<IState>({
    uri: '',
    showModal: false,
  });
  const formikRef = useRef<any>(undefined);
  const phoneInput = useRef<PhoneInput>(null);
  const [bottomHeight, setBottomHeight] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormDataEdit>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      email: props.route?.params?.profileInfo?.email || '',
      firstName: props.route?.params?.profileInfo?.firstName || '',
      lastName: props.route?.params?.profileInfo?.lastName || '',
      displayName: props.route?.params?.profileInfo?.displayName || '',
      described: props.route?.params?.profileInfo?.described || '',
      website: props.route?.params?.profileInfo?.website || '',
    },
  });

  useEffect(() => {
    try {
      if (props.route?.params?.profileInfo?.phone) {
        const number = props.route?.params?.profileInfo?.phone?.replace(new RegExp(String.fromCharCode(160), 'g'), '');
        const pn = parsePhoneNumber(number);
        phoneInput.current?.setState(preState => ({
          ...preState,
          countryCode: pn.country as CountryCode,
          code: pn.countryCallingCode as string,
          number: pn.format('NATIONAL').split(' ').join(''),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.route?.params?.profileInfo?.phone]);

  const _onSubmit = async (data: FormDataEdit) => {
    try {
      globalLoading(true);
      const validatePhone = getPhoneNumber();
      if (validatePhone.value && !validatePhone.valid) {
        Alert.alert('', 'Please enter a valid phone number.');
        return;
      }
      if (!validatePhone.value && !validatePhone.valid) {
        await userController.updatePhoneNumber('');
      }
      if (validatePhone.valid) {
        const type = await validatePhoneNumber(validatePhone.value);
        if (type === PHONE_STATUS.CLAIMED) {
          await promptHelper('', 'Someone is using this phone number already. Do you want to verify it?', 'No', 'Yes');

          await userController.sendOtp(validatePhone.value);
          toggleModal(true)();

          return;
        } else {
          await userController.updatePhoneNumber(validatePhone.value);
        }
      }

      let fileUrl = props.route?.params?.profileInfo?.avatar || '';
      if (state.image) {
        const imgS3 = await _uploadPresignedUrl(state.image);
        fileUrl = imgS3?.url || '';
      }
      const loginMethod = await storage.getItem(ASYNC_STORE.LOGIN_METHOD);
      const res = await userController.editProfile({
        ...data,
        avatar: fileUrl,
        loginMethod: loginMethod ?? '',
      });
      if (res.status === 1) {
        Toast.show({
          type: 'success',
          text1: 'Stump',
          text2: 'Edit your profile successfully!',
        });
        dispatch(fetchUser(false));
        if (state.image) {
          emitter(EDeviceEmitter.FETCH_DATA_DRAFT);
          emitter(EDeviceEmitter.FETCH_DATA_SCHEDULE);
          emitter(EDeviceEmitter.FETCH_ALL_TAB);
        }

        props.navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: `${error}`,
      });
    } finally {
      globalLoading();
    }
  };
  const _chooseImage = async () => {
    const permission = await requestStoragePermission();
    if (!permission) {
      return;
    }
    const result = await ImagePicker.openPicker({
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

  const handleFocus =
    (field: 'firstName' | 'lastName' | 'displayName' | 'described' | 'email' | 'phone' | 'website') => () => {
      if (field === 'email') {
        setBottomHeight(scale(300));
      }
      if (field === 'firstName') {
        setBottomHeight(scale(300));
      }
      if (field === 'lastName') {
        setBottomHeight(scale(280));
      }
      if (field === 'displayName') {
        setBottomHeight(scale(250));
      }
      if (field === 'phone') {
        setBottomHeight(scale(250));
      }
      if (field === 'described') {
        setBottomHeight(scale(150));
      }
      if (field === 'website') {
        setBottomHeight(scale(150));
      }
    };

  const getPhoneNumber = () => {
    const value = phoneInput.current?.state?.number ?? '';
    if (phoneInput.current?.isValidNumber(value)) {
      const { formattedNumber } = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
      return { value: formattedNumber, valid: true };
    } else {
      return { value, valid: false };
    }
  };

  const toggleModal = (showModal: boolean) => () => {
    setState(preState => ({ ...preState, showModal }));
  };

  const getOTPSuccess = async () => {
    await formikRef?.current?.submitForm();
  };

  return (
    <ContainerStyled>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraHeight={bottomHeight}
        enableOnAndroid={true}
        style={[commonStyles.pd_horizontal_16]}>
        <Fragment>
          {state.showModal && (
            <ModalVerifyOTP offModal={toggleModal(false)} onSuccess={getOTPSuccess} phone={getPhoneNumber().value} />
          )}

          <View style={styles.viewChangeAvatar}>
            {state.uri ? (
              <ImageComponent uri={state.uri || ''} width={scale(100)} height={scale(100)} borderRadius={scale(100)} />
            ) : (
              <ImageComponent
                uri={props.route?.params?.profileInfo?.avatar || ''}
                width={scale(100)}
                height={scale(100)}
                borderRadius={scale(100)}
              />
            )}

            <View style={commonStyles.containerView}>
              <TouchableOpacity style={styles.touchChange} onPress={_chooseImage}>
                <MediumTextStyled>Change avatar</MediumTextStyled>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <TextTitleStyled>Email</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    value={value}
                    onFocus={handleFocus('email')}
                    onChangeText={onChange}
                    placeholder="Enter your email"
                  />
                )}
                name="email"
              />
            </ViewTextInputStyled>
            {errors.email && <TextErrorStyled>{errors.email?.message ?? ' '}</TextErrorStyled>}
          </View>
          <View>
            <TextTitleStyled>First Name</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    value={value}
                    onFocus={handleFocus('firstName')}
                    onChangeText={onChange}
                    placeholder="Enter your first name"
                  />
                )}
                name="firstName"
              />
            </ViewTextInputStyled>
            {errors.firstName && <TextErrorStyled>{errors.firstName?.message ?? ' '}</TextErrorStyled>}
          </View>
          <View>
            <TextTitleStyled>Last Name</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    value={value}
                    onFocus={handleFocus('lastName')}
                    onChangeText={onChange}
                    placeholder="Enter your last name"
                  />
                )}
                name="lastName"
              />
            </ViewTextInputStyled>
            {errors.lastName && <TextErrorStyled>{errors.lastName?.message ?? ' '}</TextErrorStyled>}
          </View>
          <View>
            <TextTitleStyled>Display Name</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    value={value}
                    onFocus={handleFocus('displayName')}
                    onChangeText={onChange}
                    placeholder="Enter your display name"
                  />
                )}
                name="displayName"
              />
            </ViewTextInputStyled>
            {errors.displayName && <TextErrorStyled>{errors.displayName?.message ?? ' '}</TextErrorStyled>}
          </View>
          <TextTitleStyled>Phone Number</TextTitleStyled>
          <View style={styles.viewPhoneInput}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={''}
              defaultCode={'US'}
              layout="first"
              withDarkTheme={true}
              disableArrowIcon={true}
              autoFocus={false}
              containerStyle={styles.containerPhone}
              textInputStyle={styles.containerInput}
              codeTextStyle={styles.containerCodeText}
              flagButtonStyle={styles.flagButtonStyle}
              textContainerStyle={styles.textContainerStyle}
              countryPickerButtonStyle={styles.countryPickerButtonStyle}
              textInputProps={{
                maxLength: 12,
                onFocus: handleFocus('phone'),
              }}
            />
          </View>
          <View>
            <TextTitleStyled>Bio</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextAreaStyled
                    value={value}
                    onFocus={handleFocus('described')}
                    onChangeText={onChange}
                    placeholder="Enter your description"
                    numberOfLines={3}
                    multiline={true}
                  />
                )}
                name="described"
              />
            </ViewTextInputStyled>
          </View>
          <View>
            <TextTitleStyled>Website</TextTitleStyled>
            <ViewTextInputStyled>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    value={value}
                    onFocus={handleFocus('website')}
                    onChangeText={onChange}
                    placeholder="Enter your website"
                  />
                )}
                name="website"
              />
            </ViewTextInputStyled>
            {errors.website && <TextErrorStyled>{errors.website?.message ?? ' '}</TextErrorStyled>}
          </View>
          <CreateTouchStyled onPress={handleSubmit(_onSubmit)}>
            <NormalTextStyled>SAVE</NormalTextStyled>
          </CreateTouchStyled>
        </Fragment>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};

export default React.memo(EditProfileComponent);
