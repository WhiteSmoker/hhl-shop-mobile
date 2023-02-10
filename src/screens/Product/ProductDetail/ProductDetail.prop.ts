import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { APP_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { ProductStackParam } from '@/navigators/ProductNavigator';

export interface IProductDetailProps {
  navigation: NavigationProduct;
  route: RouteProp<ProductStackParam>;
}

type NavigationProduct = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.PRODUCT>,
  NativeStackNavigationProp<ProductStackParam>
>;
