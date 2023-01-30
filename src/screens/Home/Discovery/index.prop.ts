import { APP_NAVIGATION, HOME_NAVIGATION, RECORD_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { HomeStackParam } from '@/navigators/HomeNavigator';
import { IStumpData } from '@/stores/types/discovery.type';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IDiscoveryProps {
  navigation: any;
  route: RouteProp<HomeStackParam, HOME_NAVIGATION.DISCOVERY>;
}

export type NavigationDiscovery = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.HOME>,
  CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParam, HOME_NAVIGATION.DISCOVERY>,
    NativeStackNavigationProp<TabBottomStackParam, APP_NAVIGATION.CREATE>
  >
>;

export interface IDiscoveryState {
  data: IStumpData[];
  currentPage: number;
  maxPage: number;
  loadingMore: boolean;
  refreshing: boolean;
}
