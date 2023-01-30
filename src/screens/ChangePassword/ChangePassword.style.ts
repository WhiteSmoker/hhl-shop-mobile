import { Colors } from '@/theme/colors';
import { Platform } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyledProps } from './ChangePassword.prop';

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-top: ${scale(200)}px;
`;

export const ViewTextInputStyled = styled.View<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(44)}px`};
`;

export const TextInputStyled = styled.TextInput`
  flex: 1;
  background: ${Colors.White};
  border-width: ${scale(2)}px;
  border-color: ${Colors.manatee};
  border-radius: ${scale(5)}px;
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding-horizontal: ${scale(12)}px;
  padding-vertical: ${scale(12)}px;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(44)}px`};
`;
export const TextCodeInputStyled = styled.TextInput`
  background: ${Colors.White};
  border-width: ${scale(2)}px;
  border-color: ${Colors.manatee};
  border-radius: ${scale(5)}px;
  font-style: normal;
  font-weight: 700;
  font-size: ${scale(30)}px;
  align-items: center;
  text-align: center;
  color: ${Colors.dark};
  padding-horizontal: ${scale(12)}px;
  padding-vertical: ${scale(12)}px;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(84)}px`};
  width: ${Platform.OS === 'ios' ? 'auto' : `${scale(174)}px`};
`;
export const TouchChangePasswordStyled = styled.TouchableOpacity<StyledProps>`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 32)}px;
  background: ${Colors.Pure_Orange};
  border-radius: ${scale(5)}px;
  width: 60%;
  align-self: center;
`;
export const TouchChangePasswordTextStyled = styled.Text<StyledProps>`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  text-align: center;
  padding-vertical: ${scale(12)}px;
  color: ${(props: StyledProps) => props.color || Colors.White};
`;

export const ViewErrorStyled = styled.View<StyledProps>`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 32)}px;
`;

export const TextErrorStyled = styled.Text`
  color: ${Colors.red};
  text-align: center;
`;
