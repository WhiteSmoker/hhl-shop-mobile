import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface StyledProps {
  backgroundColor?: string;
  marginTop?: number;
  width?: number;
  height?: number;
  color?: string;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
}

export type NavigationGuest = NativeStackNavigationProp<any>;

export interface IProps {
  navigation: NavigationGuest;
}
