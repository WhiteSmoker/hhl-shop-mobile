import { RECORD_NAVIGATION } from '@/constants';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export interface IProps {
  navigation: NativeStackNavigationProp<CreateStackParam, RECORD_NAVIGATION.FIRST_STEP>;
  route: any;
}

export interface StyleProps {
  marginTop?: number;
  backgroundColor?: string;
}
