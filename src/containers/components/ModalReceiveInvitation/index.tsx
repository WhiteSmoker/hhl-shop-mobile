import { APP_NAVIGATION, CONVERSATION_STATUS, PARTICIPANT_STATUS, RECORD_NAVIGATION } from '@/constants';
import { userController } from '@/controllers';
import { conversationController } from '@/controllers/conversation.controller';
import { navigationRef } from '@/navigators/refs';
import { TextErrorStyled } from '@/screens/Login/Login.style';
import { ASYNC_STORE, storage } from '@/storage';
import { recordSlice } from '@/stores/reducers';
import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { requestMicroPermission } from '@/utils/permission';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { styles } from './styles';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { IconUserGroup } from '@/assets/icons/Icon';
import { useAuth } from '@/hooks/useAuth';
import { TextComponent } from '../TextComponent';

interface DeepLinkState {
  invitationCode: string;
  hasOTP: boolean;
  invitationValue: string;
}

const ModalReceiveInvitation = () => {
  const dispatch = useDispatch();
  const modalToastRef: any = React.useRef(undefined);
  const [deepLinkState, setDeepLinkState] = useState<DeepLinkState>({
    invitationCode: '',
    hasOTP: false,
    invitationValue: '',
  });

  const userInfo = useAuth();
  const [bgModal, setBgModal] = useState('transparent');
  const [state, setState] = useState({
    inviteCode: '',
    errorOTP: '',
    loading: false,
  });
  const slideYAnim = React.useRef(new Animated.Value(300)).current;

  useEmitter(EDeviceEmitter.DEEP_LINK_INVITATION, (payload: DeepLinkState) => {
    setDeepLinkState(payload);
  });

  useEffect(() => {
    if (userInfo) {
      if (deepLinkState.invitationCode) {
        setState(prevState => ({ ...prevState, inviteCode: deepLinkState.invitationCode }));
      } else {
        storage.getItem(ASYNC_STORE.INVITE_CODE).then(value => {
          if (value) {
            setState(prevState => ({ ...prevState, inviteCode: value }));
          }
        });
      }
    }
  }, [deepLinkState.invitationCode, userInfo]);

  const _closeModal = async () => {
    await _aniOffSlideY();
    await storage.removeItem(ASYNC_STORE.INVITE_CODE);
    setDeepLinkState(preState => ({ ...preState, invitationCode: '', hasOTP: false, invitationValue: '' }));
    setState(prevState => ({ ...prevState, loading: false, inviteCode: '', errorOTP: '' }));
  };

  const _cancelOTP = () => {
    setDeepLinkState(preState => ({ ...preState, hasOTP: false }));
  };

  const onShow = async () => {
    setBgModal('rgba(0,0,0,0.4)');
    await _aniSlideY();
    keyboardDismiss();
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const _aniSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const _aniOffSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 1000,
        useNativeDriver: true,
        duration: 100,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const onCodeFilled = async (code: string) => {
    try {
      setState(prevState => ({ ...prevState, loading: true, errorOTP: '' }));
      await userController.verifyOtp(code, deepLinkState.invitationValue);
      _cancelOTP();
    } catch (error: any) {
      console.log(error);
      setState(prevState => ({ ...prevState, errorOTP: error.message }));
    } finally {
      setState(prevState => ({ ...prevState, loading: false }));
    }
  };

  const _joinNow = async () => {
    try {
      const permission = await requestMicroPermission();
      if (!permission) {
        return;
      }

      setState(prevState => ({ ...prevState, loading: true }));
      const res = await conversationController.findInviteCode(state.inviteCode, deepLinkState.invitationValue);
      if (res.status === 1 && res?.data) {
        const res_get_detail = await conversationController.getDetailConversation(res.data.conversationId!);
        if (res_get_detail.status === 1) {
          //check code active/inactive.
          if (res.data.active === PARTICIPANT_STATUS.ACTIVE) {
            Alert.alert('', 'This user is already connect on another device. Only one device may join per user.');
            return;
          }

          //check conversation deleted.
          if (res_get_detail.data[0].status === CONVERSATION_STATUS.ARCHIVED) {
            Alert.alert('', 'The conversation was deleted by host.');
            return;
          }

          //check conversation ended.
          if (
            res_get_detail.data[0].status === CONVERSATION_STATUS.UPLOADING ||
            res_get_detail.data[0].status === CONVERSATION_STATUS.PUBLISHED ||
            res_get_detail.data[0].status === CONVERSATION_STATUS.FINISHED
          ) {
            Alert.alert('', 'The Stump ended.');
            return;
          }
          //else navigate recording screen
          // dispatch(setIsFetchNoti(true));
          // dispatch(setTab(APP_NAVIGATION.CREATE));
          dispatch(
            recordSlice.actions.setConfig({
              role: 'participant',
              roomDetail: res_get_detail.data[0],
              participantToEmit: res_get_detail.data[0].participants,
              stoped: false,
              start_time: 0,
              duration: res_get_detail.data[0]?.duration || 0,
            }),
          );
          await _closeModal();
          Toast.show({
            type: 'success',
            text1: 'You have joined the conversation',
          });
          navigationRef?.current?.navigate(APP_NAVIGATION.CREATE, {
            screen: RECORD_NAVIGATION.RECORDING,
            params: {
              conversationId: res.data.conversationId!.toString(),
              inviteCode: res.data.inviteCode,
            },
          });
        }
      } else {
        Toast?.show({
          type: 'error',
          text1: `Stump`,
          text2: `The invitation code does not exist or has expired`,
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setState(prevState => ({ ...prevState, loading: false }));
    }
  };

  return state.inviteCode ? (
    <Modal visible={!!state.inviteCode} animationType="none" transparent={true} onShow={onShow}>
      {!deepLinkState.hasOTP ? (
        <TouchableWithoutFeedback>
          <View style={[styles.modalContainer, { backgroundColor: bgModal }]}>
            <Animated.View style={[styles.modalView, { transform: [{ translateY: slideYAnim }] }]}>
              <View style={styles.viewIcon}>
                <IconUserGroup width={scale(50)} height={scale(50)} />
              </View>
              <TextComponent style={styles.headerText}>
                You have just received an invitation to join a conversation.
              </TextComponent>
              <TextComponent style={styles.headerText}>Do you want to join this conversation now ?</TextComponent>
              <View style={styles.viewButton}>
                <TouchableOpacity style={styles.buttonCancel} onPress={_closeModal}>
                  <TextComponent style={styles.headerText}>Cancel</TextComponent>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonJoin} disabled={state.loading} onPress={_joinNow}>
                  {state.loading && <ActivityIndicator size={scale(14)} color={Colors.White} />}
                  <Text style={[styles.headerText, commonStyles.textWhite]}>Join now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={keyboardDismiss}>
          <View style={[styles.modalContainer, { backgroundColor: bgModal }]}>
            <Animated.View style={[styles.modalView, { transform: [{ translateY: slideYAnim }] }]}>
              <TextComponent style={styles.headerText}>Enter your OTP</TextComponent>
              <OTPInputView
                style={styles.containerOtpInput}
                pinCount={6}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={onCodeFilled}
                keyboardType={'number-pad'}
              />
              <TextErrorStyled>{state.errorOTP}</TextErrorStyled>
              {state.loading ? (
                <ActivityIndicator size={scale(18)} color={Colors.DarkGray} />
              ) : (
                <TouchableOpacity style={styles.buttonCancel} onPress={_cancelOTP}>
                  <TextComponent style={styles.headerText}>Cancel</TextComponent>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  ) : null;
};

export default ModalReceiveInvitation;
