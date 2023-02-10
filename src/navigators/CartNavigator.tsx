import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CartHeader from './Header/CartHeader';

import { CART_NAVIGATION } from '@/constants';
import { CartPage, CartPaymentPage } from '@/screens';

export type CartStackParam = {
  [CART_NAVIGATION.ITEMSCART]: undefined;
  [CART_NAVIGATION.PAYMENTCART]: undefined;
};
const Stack = createNativeStackNavigator<CartStackParam>();

const CartNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={CART_NAVIGATION.ITEMSCART} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={CART_NAVIGATION.ITEMSCART}
        component={CartPage}
        options={({ route, navigation }) => ({
          header: () => <CartHeader title="Giỏ hàng" />,
        })}
      />
      <Stack.Screen
        name={CART_NAVIGATION.PAYMENTCART}
        component={CartPaymentPage}
        options={({ route, navigation }) => ({
          header: () => <CartHeader title="Thanh toán" showArrow={true} navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default React.memo(CartNavigator);
