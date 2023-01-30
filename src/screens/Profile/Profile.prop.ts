import { APP_NAVIGATION, PROFILE_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { RootStackParam } from '@/navigators';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { ProfileStackParam } from '@/navigators/ProfileNavigator';
import { Stump } from '@/stores';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export interface IProps {
  navigation: any;
  route: RouteProp<ProfileStackParam, PROFILE_NAVIGATION.DETAIL_PROFILE>;
}

export type NavigationProfile = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.PROFILE>,
  CompositeNavigationProp<
    NativeStackNavigationProp<ProfileStackParam, PROFILE_NAVIGATION.DETAIL_PROFILE>,
    NativeStackNavigationProp<RootStackParam, ROOT_ROUTES.PROFILE_PREFERENCE>
  >
>;
export interface IState {
  search: string;
  isShowList: boolean;
  isShowModalReport: boolean;
  loading: boolean;
  start: number;
  end: number;
  dataFlastList: object[];
}

export interface StyleProp {
  backgroundColor: string;
}
export type ViewProfileData = {
  data: Stump[];
  currentPage: number;
  maxPage: number;
  count: number;
};
