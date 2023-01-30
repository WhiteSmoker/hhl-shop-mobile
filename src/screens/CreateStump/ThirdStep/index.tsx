import { commonStyles, ContainerStyled } from '@/styles/common';
import { parsePhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Animated, Keyboard, LayoutChangeEvent, Platform, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/Ionicons';
import { IProps, IState } from './propState';
import RenderList from './RenderList';
import styles, {
  CreateTouchStyled,
  NomarlTextStyled,
  SearchTextInputStyled,
  TextInputStyled,
  TextOrStyled,
  TextStyled,
  TextTitleStyled,
  ViewListPhone,
  ViewSearchStyled,
} from './styles';
import useBottomHeight from './useBottomHeight';
import { ListFriendHorizontal } from './ListFriendHorizontal';
import { ListFriendVertical } from './ListFriendVertical';
import { scale } from 'react-native-size-scaling';
import { APP_NAVIGATION, HOME_NAVIGATION, NUMBER_BREAK_PAGE, RECORD_NAVIGATION, SCHEDULE_MODE } from '@/constants';
import { requestMicroPermission } from '@/utils/permission';
import { recordSlice } from '@/stores/reducers';
import { globalLoading } from '@/containers/actions/emitter.action';
import { IUserInfo, useAppDispatch, useAppSelector } from '@/stores';
import { Colors } from '@/theme/colors';
import DateTimePicker from '@/containers/components/DateTimePicker';
import TagComponent from '@/containers/components/TagComponent';
import { ViewListEmail } from '@/containers/components/TagComponent/styles';
import { convertTimeToUTC } from '@/utils/format';
import { randomCode } from '@/utils/helper';
import { conversationController } from '@/controllers/conversation.controller';
import { userController } from '@/controllers';
import useKeyboard from '@/hooks/useKeyboard';
import { useAuth } from '@/hooks/useAuth';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { IconArrowInCircle, IconContact } from '@/assets/icons/Icon';
import ContactComponent from './ContactComponent';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
const INVITE_METHOD = {
  EMAIL: '1',
  PHONE_NUMBER: '2',
  CONTACT: '3',
};

const NewStumpComponent = (props: IProps) => {
  const dispatch = useAppDispatch();
  const timeout = React.useRef<any>();
  const userInfo = useAuth();
  const { stumpNow, recordMode, countryCode } = useAppSelector(rootState => rootState.recordState);

  const { height, status } = useKeyboard();
  const { bottomHeight, handleFocus } = useBottomHeight();

  const { control, handleSubmit, setValue } = useForm<{
    message: string;
    string_search: string;
    email: string;
    phoneNumber: string;
  }>();

  const contactRef = useRef<any>();
  const phoneInput = useRef<PhoneInput>(null);
  const transtaleXValueExit = React.useRef(new Animated.Value(scale(300))).current;
  const opacityValueExit = React.useRef(new Animated.Value(1)).current;
  const transtaleYValue = React.useRef(new Animated.Value(scale(1000))).current;
  const [state, setState] = useState<IState>({
    estimateTime: new Date(),
    emailTags: [],
    phoneNumberTags: [],
    listPhoneFromContact: [],
    modeDateTime: 'date',
    heightSearch: 0,
    currentPage: 1,
    maxPage: 1,
    loadingSearch: false,
    loadingMore: false,
    currentPageUserSystem: 1,
    maxPageUserSystem: 1,
    loadingMoreUserSystem: false,
    usersChecked: [],
    phoneFromContact: '',
  });

  useEffect(() => {
    loadMoreUserSystemApi('', 1);
  }, []);

  const _onSubmit = (data: any) => {
    Keyboard.dismiss();
    if (!status) {
      _navigate(data.message);
    }
  };

  const onChangeText = (text: string) => {
    setValue('string_search', text);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      _onSearch();
    }, 1000);
  };

  //search friend
  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    const text = control._formValues?.string_search || '';
    loadMoreSearchFriendApi(text, state.currentPage);
  }, [state.currentPage]);

  //search user system
  useEffect(() => {
    if (state.currentPageUserSystem === 1) {
      return;
    }
    const text = control._formValues?.string_search || '';
    loadMoreUserSystemApi(text, state.currentPageUserSystem);
  }, [state.currentPageUserSystem]);

  const debounceFnc = async (_searchVal: string) => {
    try {
      if (_searchVal === '') {
        setState(preState => ({ ...preState, filterList: undefined }));
        return;
      }
      setState(preState => ({ ...preState, loadingSearch: true }));
      const res_search = await userController.searchByName(_searchVal, 1);

      setState(preState => ({
        ...preState,
        filterList: res_search.data.users,
        currentPage: 1,
        maxPage: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
        loadingSearch: false,
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const loadMoreSearchFriendApi = async (text: string, pageNumber: number) => {
    const res_search = await userController.searchByName(text, pageNumber);
    setState(preState => ({
      ...preState,
      filterList: [...(preState.filterList ?? []), ...res_search.data.users].filter(user => user.id !== userInfo?.id),
      maxPage: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
      loadingMore: false,
    }));
  };

  const loadMoreUserSystemApi = async (text: string, pageNumber: number) => {
    const res_search = await userController.searchByName(text, pageNumber);
    setState(preState => ({
      ...preState,
      userSystem: [...(preState.userSystem ?? []), ...res_search.data.users].filter(user => user.id !== userInfo?.id),
      maxPageUserSystem: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
      loadingMoreUserSystem: false,
    }));
  };

  const _loadMore = React.useCallback(() => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  }, [state.currentPage, state.loadingMore, state.maxPage]);

  const _loadMoreUserSystem = React.useCallback(() => {
    if (state.loadingMoreUserSystem) {
      return;
    }
    if (state.currentPageUserSystem >= state.maxPageUserSystem) {
      return;
    }
    setState(preState => ({
      ...preState,
      currentPageUserSystem: preState.currentPageUserSystem + 1,
      loadingMoreUserSystem: true,
    }));
  }, [state.currentPageUserSystem, state.loadingMoreUserSystem, state.maxPageUserSystem]);

  const _checkExistEmail = async (email: string) => {
    try {
      const response = await userController.findUser(email.toLowerCase());

      if (response.status === 1) {
        return response.data?.length
          ? {
              inviteCode: randomCode(5),
              inviteValue: email.toLowerCase(),
              inviteMethod: INVITE_METHOD.EMAIL,
              userId: response.data[0].id,
              isHost: 0,
            }
          : {
              inviteCode: randomCode(5),
              inviteValue: email.toLowerCase(),
              inviteMethod: INVITE_METHOD.EMAIL,
              userId: null,
              isHost: 0,
            };
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const _navigate = async (message: string) => {
    try {
      globalLoading(true);
      const emailPromise: any = [];
      const friend =
        [...(state.usersChecked ?? [])].map(p => ({
          inviteCode: randomCode(5),
          inviteValue: p.email.toLowerCase(),
          inviteMethod: INVITE_METHOD.EMAIL,
          userId: p.id,
          isHost: 0,
        })) || [];
      const maximum =
        state.emailTags.length + state.phoneNumberTags.length + state.listPhoneFromContact.length + friend.length;
      if (maximum > 3) {
        Alert.alert('', 'Maximum 3 chosen participants');
        return;
      }
      if (maximum < 1) {
        Alert.alert('', 'Minimum 1 chosen participant');
        return;
      }
      const listEmailFriend = friend.map(e => e.inviteValue);
      const newEmailTags = state.emailTags
        .map(email => {
          if (listEmailFriend.includes(email)) {
            return '';
          } else {
            return email;
          }
        })
        .filter(item => !!item);
      newEmailTags.forEach(email => {
        emailPromise.push(_checkExistEmail(email));
      });

      const phoneNumbers = state.phoneNumberTags.map(phone => {
        return {
          inviteCode: randomCode(5),
          inviteValue: phone,
          inviteMethod: INVITE_METHOD.PHONE_NUMBER,
          userId: null,
          isHost: 0,
        };
      });

      const phoneNumberContacts = state.listPhoneFromContact.map(phone => {
        return {
          inviteCode: randomCode(5),
          signupCode: randomCode(6),
          inviteValue: phone,
          inviteMethod: INVITE_METHOD.CONTACT,
          userId: null,
          isHost: 0,
        };
      });
      const emails = await Promise.all(emailPromise);

      const host = [
        {
          inviteCode: null,
          inviteValue: userInfo?.email,
          inviteMethod: null,
          userId: userInfo?.id,
          isHost: 1,
        },
      ];
      const res_create = await conversationController.addConversation({
        hostId: userInfo?.id,
        mode: recordMode,
        scheduleMode: stumpNow ? SCHEDULE_MODE.NOW : SCHEDULE_MODE.SCHEDULE,
        scheduledStart: convertTimeToUTC(state.estimateTime),
        message,
        status: 1,
        participant: [...host, ...friend, ...emails, ...phoneNumbers, ...phoneNumberContacts],
      });
      if (res_create.status === 1) {
        dispatch(getNumberConversation());
        const permission = await requestMicroPermission();
        if (!permission) {
          props.navigation.navigate(APP_NAVIGATION.HOME, {
            screen: HOME_NAVIGATION.SCHEDULEDHOME,
            initial: false,
            params: { screen: RECORD_NAVIGATION.THIRD_STEP },
          });
          return;
        }
        if (stumpNow) {
          const res_get_detail = await conversationController.getDetailConversation(res_create.data.id);
          if (res_get_detail.status === 1) {
            dispatch(
              recordSlice.actions.setConfig({
                role: 'host',
                roomDetail: res_get_detail.data[0],
                participantToEmit: res_get_detail.data[0].participants,
                stoped: false,
                start_time: 0,
                duration: res_get_detail.data[0]?.duration || 0,
              }),
            );
            props.navigation.push(RECORD_NAVIGATION.RECORDING, { conversationId: res_create.data.id.toString() });
          }
        } else {
          props.navigation.popToTop();
          props.navigation.navigate(APP_NAVIGATION.HOME, {
            screen: HOME_NAVIGATION.SCHEDULEDHOME,
            initial: false,
            params: { screen: RECORD_NAVIGATION.THIRD_STEP },
          });
        }
        emitter(EDeviceEmitter.FETCH_DATA_SCHEDULE);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  const _pickFriend = React.useCallback(
    (user: IUserInfo) => {
      try {
        const index = state.usersChecked.findIndex(userChecked => userChecked.id === user.id);
        const maximum =
          state.emailTags.length +
          state.phoneNumberTags.length +
          state.listPhoneFromContact.length +
          state.usersChecked.length;
        if (index === -1) {
          if (maximum > 2) {
            Alert.alert('', 'Maximum 3 chosen participants');
            return;
          }
          const newUsersChecked = [...state.usersChecked, user];
          setState(preState => ({ ...preState, usersChecked: newUsersChecked }));
        } else {
          const newUsersChecked = state.usersChecked.filter(usr => usr.id !== user.id);
          setState(preState => ({ ...preState, usersChecked: newUsersChecked }));
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [state.emailTags.length, state.listPhoneFromContact.length, state.phoneNumberTags.length, state.usersChecked],
  );

  const _onChangeDate = React.useCallback((selectDate: Date, mode?: 'date' | 'time') => {
    setState(preState => ({ ...preState, estimateTime: selectDate, modeDateTime: mode === 'date' ? 'time' : 'date' }));
  }, []);

  //#region action add, delete email, phone
  const _deleteElement = useCallback(
    (controlName: 'email' | 'phoneNumber') => (index: number) => {
      if (controlName === 'email') {
        const cloneEmailTag = [...state.emailTags];
        cloneEmailTag.splice(index, 1);
        setState(preState => ({ ...preState, emailTags: cloneEmailTag }));
      } else {
        const clonePhoneNumberTag = [...state.phoneNumberTags];
        clonePhoneNumberTag.splice(index, 1);
        setState(preState => ({
          ...preState,
          phoneNumberTags: clonePhoneNumberTag,
        }));
      }
    },
    [state.emailTags, state.phoneNumberTags],
  );

  const _deleteElementPhone = React.useCallback((tag: string) => {
    setState(preState => ({
      ...preState,
      phoneNumberTags: preState.phoneNumberTags.filter(e => e !== tag),
      listPhoneFromContact: preState.listPhoneFromContact.filter(e => e !== tag),
    }));
  }, []);

  const _addElement = React.useCallback(
    (controlName: 'email' | 'phoneNumber') => (text: string) => {
      if (!text) {
        return;
      }
      if (controlName === 'email') {
        setState(preState => ({ ...preState, emailTags: [...preState.emailTags, ...[text]] }));
      } else {
        setState(preState => ({
          ...preState,
          phoneNumberTags: [...new Set([...preState.phoneNumberTags, ...[text]])],
        }));
      }
    },
    [],
  );

  const _checkPhoneNumber = () => {
    const value = phoneInput.current?.state?.number ?? '';
    if (!value) {
      return;
    }
    const maximum =
      state.emailTags.length +
      state.phoneNumberTags.length +
      state.listPhoneFromContact.length +
      state.usersChecked.length;
    if (maximum > 2) {
      Alert.alert('', 'Maximum 3 chosen participants');
      return;
    }
    if (phoneInput.current?.isValidNumber(value)) {
      const { formattedNumber } = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
      if (state.phoneFromContact) {
        const newListPhoneFromContact = [...new Set([...state.listPhoneFromContact, ...[formattedNumber]])];
        setState(preState => ({ ...preState, listPhoneFromContact: newListPhoneFromContact, phoneFromContact: '' }));
      } else {
        _addElement('phoneNumber')(formattedNumber);
      }
      phoneInput.current?.setState(preState => ({ ...preState, number: '' }));
    } else {
      Alert.alert('', 'Please enter a valid phone number.');
    }
  };

  const _onChooseContact = useCallback((phoneNumber: string) => {
    let number = phoneNumber.replace(new RegExp(String.fromCharCode(160), 'g'), '');
    if (number.indexOf('+') !== -1) {
      const pn = parsePhoneNumber(number).formatInternational();
      const splitNumber = pn.split(' ');
      splitNumber.shift();
      number = splitNumber.join('');
    }

    phoneInput.current?.setState(preState => ({ ...preState, number }));
    setState(preState => ({ ...preState, phoneFromContact: number }));
  }, []);
  //#endregion
  //#region animation, search friend
  const _onFocus = (event: any) => {
    event.persist();
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 1,
        useNativeDriver: true,
        duration: 50,
      }),
    ]).start();
  };

  const _onBlur = (event: any) => {
    event.persist();
    const text = control._formValues?.string_search || '';
    if (text) {
      return;
    }
  };

  const _onSearch = (event?: any) => {
    event?.persist();
    const text = control._formValues?.string_search || '';
    debounceFnc(text);
  };

  const _clear = () => {
    setValue('string_search', '');
    _collapse();
    debounceFnc('');
  };

  const _collapse = React.useCallback(() => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(1000),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(100),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 0,
        useNativeDriver: true,
        duration: 50,
      }),
    ]).start();
  }, [opacityValueExit, transtaleXValueExit, transtaleYValue]);

  const _toggleContact = () => {
    contactRef?.current?.open();
  };

  //#endregion

  const _getHeightSearch = React.useCallback((e: LayoutChangeEvent) => {
    e.persist();
    setState(preState => ({ ...preState, heightSearch: e?.nativeEvent?.layout?.height }));
  }, []);

  const heightTagComponent = useMemo(() => ({ height: Platform.OS === 'ios' ? scale(36) : scale(43) }), []);

  const memoDataRenderList = useMemo(
    () => [...state.phoneNumberTags, ...state.listPhoneFromContact],
    [state.listPhoneFromContact, state.phoneNumberTags],
  );

  return (
    <ContainerStyled>
      <ContactComponent ref={contactRef} onChooseContact={_onChooseContact} />
      <View style={{ backgroundColor: Colors.Background }} onLayout={_getHeightSearch}>
        <ViewSearchStyled style={commonStyles.flatlist_item}>
          <Icon name="search-outline" size={scale(22)} color={Colors.Gray} />
          <Controller
            control={control}
            render={({ field: { value } }) => (
              <SearchTextInputStyled
                placeholder="Search"
                onFocus={_onFocus}
                onBlur={_onBlur}
                onChangeText={onChangeText}
                value={value}
                onSubmitEditing={_onSearch}
              />
            )}
            name="string_search"
            defaultValue={''}
          />
          <Animated.View style={{ transform: [{ translateX: transtaleXValueExit }], opacity: opacityValueExit }}>
            <TouchableOpacity onPress={_clear}>
              <Icon name="close-outline" size={scale(22)} color={Colors.Gray} />
            </TouchableOpacity>
          </Animated.View>
        </ViewSearchStyled>
      </View>
      <ListFriendVertical
        heightSearch={state.heightSearch}
        heightKeyboard={height}
        usersChecked={state.usersChecked}
        filterList={state.filterList}
        userSystem={state.userSystem}
        translateY={transtaleYValue}
        collapse={_collapse}
        pressItem={_pickFriend}
        loadMoreUserSystem={_loadMoreUserSystem}
        loadMore={_loadMore}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraHeight={bottomHeight}
        enableOnAndroid={true}>
        <TextTitleStyled>Choose participants (up to 3)</TextTitleStyled>

        <ListFriendHorizontal usersChecked={state.usersChecked} pressItem={_pickFriend} />

        <ViewListEmail>
          <TagComponent
            data={state.emailTags}
            controlName={'email'}
            focus={handleFocus}
            placeholder={'Invite by email'}
            keyboardType={'email-address'}
            addElement={_addElement}
            removeElement={_deleteElement}
            style={heightTagComponent}
          />
        </ViewListEmail>
        <ViewListPhone>
          <RenderList data={memoDataRenderList} controlName={'phoneNumber'} onPress={_deleteElementPhone} />
          <View style={styles.viewPhoneInput}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={''}
              defaultCode={countryCode}
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
                onSubmitEditing: _checkPhoneNumber,
                maxLength: 12,
                onBlur: _checkPhoneNumber,
                onFocus: handleFocus('phoneNumber'),
              }}
            />
            <TouchableOpacity style={styles.touchArrow} onPress={_checkPhoneNumber}>
              <IconArrowInCircle width={scale(20)} height={scale(20)} fill={'#fff'} stroke={'#8b8b8b'} />
            </TouchableOpacity>
          </View>
        </ViewListPhone>
        <TextOrStyled>or</TextOrStyled>
        <TouchableOpacity style={styles.viewContact} onPress={_toggleContact}>
          <TextStyled color={Colors.White}>Access to your contacts </TextStyled>
          <IconContact width={scale(22)} height={scale(22)} fill={Colors.White} />
        </TouchableOpacity>

        {!stumpNow ? (
          <>
            <TextTitleStyled>CHOOSE DATE/TIME</TextTitleStyled>
            <DateTimePicker
              label="Select a date"
              value={state.estimateTime}
              onChangeDate={_onChangeDate}
              mode={state.modeDateTime}
              containerStyle={styles.shadowInput}
            />
          </>
        ) : null}
        <TextTitleStyled>Add a message</TextTitleStyled>
        <View style={styles.shadowInput}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputStyled
                multiline={true}
                onBlur={onBlur}
                onFocus={handleFocus('message')}
                onChangeText={onChange}
                value={value}
                placeholder={`Enter your message here…`}
                height={stumpNow ? 150 : 100}
              />
            )}
            name="message"
            defaultValue={''}
          />
        </View>

        <CreateTouchStyled
          onPress={handleSubmit(_onSubmit)}
          backgroundColor={stumpNow ? Colors.Lime_Green : Colors.Strong_Blue}>
          <NomarlTextStyled>{stumpNow ? `STUMP` : `SCHEDULE`}</NomarlTextStyled>
        </CreateTouchStyled>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};

export default React.memo(NewStumpComponent);
