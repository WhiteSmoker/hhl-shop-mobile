import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface ILoginProps {
  navigation: NavigationGuest;
  defaultEmail?: string;
}

export type NavigationGuest = NativeStackNavigationProp<any>;
export interface StyledProps {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  textDecorationLine?: string;
  color?: string;
  textAlign?: string;
}
