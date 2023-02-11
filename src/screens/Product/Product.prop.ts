import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { APP_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { ProductStackParam } from '@/navigators/ProductNavigator';

export interface IProductProps {
  navigation: NavigationProduct;
}

type NavigationProduct = CompositeNavigationProp<
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.PRODUCT>,
  NativeStackNavigationProp<ProductStackParam>
>;

export interface ICategory {
  image?: any;
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IImage {
  _id: string;
  publicId: string;
  url: string;
}

interface IQuantity {
  _id: string;
  color: string;
  size: string;
  amount: number;
}

export interface IProduct {
  description: string;
  price: number;
  image: IImage;
  status: number;
  amount: number;
  _id: string;
  name: string;
  quantity: IQuantity[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
