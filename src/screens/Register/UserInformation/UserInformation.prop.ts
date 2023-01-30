import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type IProps = {
  navigation: NativeStackNavigationProp<any>;
};

export interface StyledProps {
  marginTop?: number;
  backgroundColor?: string;
  color?: string;
}
