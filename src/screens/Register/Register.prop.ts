import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export interface IState {
  subDomain: string;
  userName: string;
  password: string;
  rememberMe: boolean;
}
export interface IProps {
  navigation: NativeStackNavigationProp<any>;
  defaultEmail?: string;
}
export interface StyledProps {
  backgroundColor?: string;
  marginTop?: number;
  width?: number;
  height?: number;
  color?: string;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
}
