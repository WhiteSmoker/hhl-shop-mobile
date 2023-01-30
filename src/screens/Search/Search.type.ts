import { APP_NAVIGATION, HOME_NAVIGATION, PROFILE_NAVIGATION, SEARCH_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { HomeStackParam } from '@/navigators/HomeNavigator';
import { ProfileStackParam } from '@/navigators/ProfileNavigator';
import { Stump } from '@/stores';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';

export interface IProps {
  navigation: NavigationSearch;
  route: RouteProp<any, SEARCH_NAVIGATION.SEARCH>;
}

export type NavigationSearch = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.SEARCH>,
  CompositeNavigationProp<
    NativeStackNavigationProp<ProfileStackParam, PROFILE_NAVIGATION.DETAIL_PROFILE>,
    NativeStackNavigationProp<HomeStackParam, HOME_NAVIGATION.DISCOVERY>
  >
>;
export interface IState {
  dataDefault: SearchStump[];
  dataSearch?: SearchStump[];
  maxPage: number;
  currentPage: number;
  loadingMore: boolean;
  loadingSkeleton: boolean;
  refreshing: boolean;
  viewAll?: {
    tagName: string;
    show: boolean;
  };
  isFocused: boolean;
  recentList: string[];
}
export interface SearchStump {
  id: number;
  tagName: string;
  stumps: Stump[];
}
