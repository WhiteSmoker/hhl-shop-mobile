import { RECORD_NAVIGATION } from '@/constants';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { RouteProp } from '@react-navigation/native';

export interface IProps {
  navigation: any;
  route: RouteProp<CreateStackParam, RECORD_NAVIGATION.PUBLISH_SUCCESS>;
}

export interface StyleProps {
  marginTop?: number;
  marginLeft?: number;
}
