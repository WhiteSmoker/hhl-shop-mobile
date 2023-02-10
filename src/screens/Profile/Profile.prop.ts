import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { APP_NAVIGATION } from '@/constants';
import { RootStackParam } from '@/navigators';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { ProfileStackParam } from '@/navigators/ProfileNavigator';

export interface IProfileProps {
  navigation: NavigationProfile;
}

export type NavigationProfile = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.PROFILE>,
  CompositeNavigationProp<NativeStackNavigationProp<ProfileStackParam>, NativeStackNavigationProp<RootStackParam>>
>;

interface CustomerId {
  phoneNumber: string;
  _id: string;
  username: string;
}

export interface IUserOrder {
  byDate: Date;
  total: number;
  phoneNumber: string;
  address: string;
  status: string;
  _id: string;
  code: string;
  customerId: CustomerId;
  customerName: string;
  createdAt: Date;
  updatedAt: Date;
}
