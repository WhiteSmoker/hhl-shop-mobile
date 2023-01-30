import { APP_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { HomeStackParam } from '@/navigators/HomeNavigator';
import { Stump } from '@/stores/types';
import { IMatch, IPost } from '@/stores/types/discovery.type';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IHomeProps {
  navigation: NavigationHome;
}

export type NavigationHome = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.HOME>,
  CompositeNavigationProp<NativeStackNavigationProp<HomeStackParam>, NativeStackNavigationProp<any>>
>;
export type NavigationSubHome = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.CREATE>,
  NativeStackNavigationProp<HomeStackParam>
>;
export interface IHomeState {
  data: Stump[];
  currentPage: number;
  maxPage: number;
  loadingMore: boolean;
  refreshing: boolean;
  typeSort?: string;
  listEvent: IPost[];
  listMatch: IMatch[];
}
