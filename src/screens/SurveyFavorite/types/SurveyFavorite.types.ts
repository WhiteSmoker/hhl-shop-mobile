import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface ISurveyProps {
  route: any;
  navigation: NavigationUser;
}

export type NavigationUser = NativeStackNavigationProp<any>;

export interface StyledProps {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  textDecorationLine?: string;
  color?: string;
  textAlign?: string;
}
