import { RECORD_NAVIGATION } from '@/constants';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IProps {
  navigation: NativeStackNavigationProp<CreateStackParam, RECORD_NAVIGATION.SECOND_STEP>;
  route: RouteProp<CreateStackParam, RECORD_NAVIGATION.SECOND_STEP> | any;
}

export interface StyleProps {
  marginTop?: number;
  backgroundColor?: string;
}
