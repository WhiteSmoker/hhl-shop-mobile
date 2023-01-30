import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface StyledProps {
  marginTop?: number;
  backgroundColor?: string;
  bottomBorder?: number;
  sizeImage?: number;
  color?: string;
}
export interface IImage {
  uri?: string;
  data: string;
  type: string;
  name: string;
  filename: string;
}
export type IState = {
  uri: string;
  image?: IImage;
};

export type IProps = {
  navigation: NativeStackNavigationProp<any>;
};
