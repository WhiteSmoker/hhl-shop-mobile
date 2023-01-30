import { PROFILE_NAVIGATION } from '@/constants';
import { ProfileStackParam } from '@/navigators/ProfileNavigator';
import { RouteProp } from '@react-navigation/native';

export interface StyleProps {
  marginTop?: number;
  backgroundColor?: string;
  fontWeight?: string;
}

export interface Props {
  navigation: any;
  route: RouteProp<ProfileStackParam, PROFILE_NAVIGATION.EDIT_PROFILE>;
}
