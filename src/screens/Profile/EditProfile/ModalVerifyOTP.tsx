import { TextComponent } from '@/containers/components/TextComponent';
import { userController } from '@/controllers';
import { TextErrorStyled } from '@/screens/Login/Login.style';
import { Colors } from '@/theme/colors';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import { styles } from './styles';
interface IProps {
  offModal(): void;
  onSuccess(): void;
  phone: string;
}
const ModalVerifyOTP = (props: IProps) => {
  const [state, setState] = useState({
    errorOTP: '',
    loading: false,
  });

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const onCodeFilled = async (code: string) => {
    try {
      setState(preState => ({ ...preState, loading: true, errorOTP: '' }));
      await userController.verifyOtp(code, props.phone);
      props.onSuccess();
      props.offModal();
    } catch (error: any) {
      console.log(error);
      setState(preState => ({ ...preState, errorOTP: error.message }));
    } finally {
      setState(preState => ({ ...preState, loading: false }));
    }
  };

  const _offModal = () => {
    props.offModal();
  };

  return (
    <Modal visible={true} animationType="none" transparent={true}>
      <TouchableWithoutFeedback onPress={keyboardDismiss}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalView]}>
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
              <TouchableOpacity style={styles.buttonCancel} onPress={_offModal}>
                <TextComponent style={styles.headerText}>Cancel</TextComponent>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default React.memo(ModalVerifyOTP);
