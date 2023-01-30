import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const styles = StyleSheet.create({
  touchChange: {
    backgroundColor: Colors.Background3,
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    marginLeft: scale(18),
  },
  viewChangeAvatar: {
    flexDirection: 'row',
    marginTop: scale(10),
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: scale(10),
    height: 'auto',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(10),
  },
  headerText: {
    textAlign: 'center',
    fontSize: scale(14),
    lineHeight: scale(30),
    fontFamily: 'Lexend-Bold',
    color: Colors.Dark_Gray1,
  },
  buttonCancel: {
    width: scale(100),
    borderWidth: scale(1),
    borderColor: Colors.Background,
    borderRadius: scale(10),
  },
  containerOtpInput: {
    width: '80%',
    height: scale(100),
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: scale(30),
    height: scale(45),
    color: Colors.blackOriginal,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: Colors.blackOriginal,
  },
  //-----------`
  viewPhoneInput: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
  },
  containerPhone: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.White,
    borderRadius: scale(12),
  },
  containerInput: {
    fontStyle: 'normal',
    fontSize: scale(14),
    alignItems: 'center',
    color: Colors.dark,
    width: '100%',
    padding: scale(0),
    backgroundColor: Colors.White,
  },
  containerCodeText: {
    width: scale(50),
    fontSize: scale(14),
    padding: 0,
    backgroundColor: Colors.White,
    marginLeft: scale(-15),
  },
  flagButtonStyle: {
    padding: 0,
    margin: 0,
    width: scale(60),
  },
  textContainerStyle: {
    backgroundColor: Colors.White,
    borderRadius: scale(12),
  },
  countryPickerButtonStyle: {
    backgroundColor: Colors.White,
  },
});

export const ViewTextInputStyled = styled.View`
  background-color: ${Colors.White};
  border-radius: ${scale(6)}px;
  padding-horizontal: ${scale(12)}px;
  margin-horizontal: ${scale(1)}px;
`;

export const TextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  height: ${scale(40)}px;
  color: ${Colors.Emperor};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
`;

export const TextAreaStyled = styled.TextInput`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.Emperor};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
  justify-content: flex-start;
  align-items: flex-start;
  text-align-vertical: top;
`;

export const TextTitleStyled = styled.Text<StyleProps>`
  color: ${Colors.dark};
  font-size: ${scale(17)}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'bold'};
  line-height: ${scale(22)}px;
  padding-vertical: ${scale(8)}px;
`;

export const SmallTextStyled = styled.Text`
  color: ${Colors.red};
  font-size: ${scale(12)}px;
  line-height: ${scale(22)}px;
  font-weight: normal;
  margin-right: ${scale(6)}px;
`;
export const MediumTextStyled = styled.Text`
  color: ${Colors.White};
  font-size: ${scale(13)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
`;
export const NormalTextStyled = styled.Text`
  color: ${Colors.White};
  font-size: ${scale(17)}px;
  line-height: ${scale(20)}px;
  font-weight: normal;
  text-transform: uppercase;
`;

export const CreateTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Background};
  border-radius: ${scale(12)}px;
  width: 45%;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-top: ${scale(20)}px;
  padding-vertical: ${scale(12)}px;
  margin-bottom: ${scale(18)}px;
`;

export const ImageStyled = styled(FastImage)`
  width: ${scale(100)}px;
  height: ${scale(100)}px;
  border-radius: ${scale(100)}px;
`;
