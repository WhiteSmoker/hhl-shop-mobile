import { Colors } from '@/theme/colors';
import { Platform } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-bottom: ${scale(10)}px;
`;

export const ViewTextInputStyled = styled.View<any>`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props: any) => scale(props.marginTop)}px;
  background: ${Colors.Very_Light_Gray};
  border-bottom-color: ${Colors.Gray};
  border-bottom-width: ${scale(1)}px;
  border-style: solid;
  padding: 1px;
`;

export const TextInputStyled = styled.TextInput`
  background: ${Colors.Very_Light_Gray};
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding-horizontal: ${scale(12)}px;
  padding-vertical: ${scale(12)}px;
  flex: 1;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(44)}px`};
`;
export const TouchRegisterStyled = styled.TouchableOpacity<any>`
  margin-top: ${(props: any) => scale(props.marginTop || 32)}px;
  background: ${Colors.Pure_Orange};
  border-radius: ${scale(5)}px;
  width: 60%;
  align-self: center;
`;

export const TouchRegisterTextStyled = styled.Text<any>`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  text-align: center;
  padding-vertical: ${scale(12)}px;
  color: ${(props: any) => props.color || Colors.White};
`;

export const TextErrorStyled = styled.Text`
  font-size: ${scale(12)}px;
  line-height: ${scale(14)}px;
  font-style: italic;
  color: ${Colors.Pure_Orange};
  padding-top: ${scale(3)}px;
`;
