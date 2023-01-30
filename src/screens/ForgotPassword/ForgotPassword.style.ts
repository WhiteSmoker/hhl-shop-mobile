import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyledProps } from './ForgotPassword.prop';

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-top: ${scale(150)}px;
`;

export const TextTitle = styled.Text`
  font-size: 24px;
  font-family: Lexend-Bold;
  color: #000000;
  margin-bottom: ${scale(10)}px;
`;

export const TextSubTitle = styled.Text`
  font-size: 14px;
  color: ${Colors.Dark_Gray1};
  margin-bottom: ${scale(16)}px;
`;
export const ViewTextInputStyled = styled.View<StyledProps>`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
`;
export const TextInputStyled = styled.TextInput`
  flex: 1;
  background: ${Colors.Light_grey3};
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(15)}px;
  line-height: ${scale(20)}px
  align-items: center;
  color: ${Colors.dark};
  width: 90%;
  padding: ${scale(16)}px;
  border-color: ${Colors.Light_grey3};
  border-width: ${scale(1)}px;
  border-radius: ${scale(6)}px;
  align-self: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
`;
export const TextErrorStyled = styled.Text`
  color: ${Colors.red};
`;

export const TouchForgotPasswordTextStyled = styled.Text<StyledProps>`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(16)}px;
  line-height: ${scale(16)}px;
  text-align: center;
  color: ${(props: StyledProps) => props.color || Colors.White};
  font-family: Lexend-Bold;
`;
export const TouchForgotPasswordStyled = styled.TouchableOpacity<StyledProps>`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 32)}px;
  background: ${Colors.Pure_Red};
  border-radius: ${scale(6)}px;
  width: 100%;
  align-self: center;
  padding: ${scale(16)}px;
`;
