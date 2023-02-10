import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { APP_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { CartStackParam } from '@/navigators/CartNavigator';
import { ProductStackParam } from '@/navigators/ProductNavigator';

export interface ICartPaymentProps {
  navigation: NavigationCartPayment;
}

type NavigationCartPayment = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.CART>,
  CompositeNavigationProp<NativeStackNavigationProp<CartStackParam>, NativeStackNavigationProp<ProductStackParam>>
>;
