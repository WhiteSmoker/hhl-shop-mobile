import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileHeader from './Header/ProfileHeader';

import { PROFILE_NAVIGATION } from '@/constants';
import { ProfilePage } from '@/screens';

export type ProfileStackParam = {
  [PROFILE_NAVIGATION.USERPROFILE]: undefined;
};
const Stack = createNativeStackNavigator<ProfileStackParam>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={PROFILE_NAVIGATION.USERPROFILE}
      screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={PROFILE_NAVIGATION.USERPROFILE}
        component={ProfilePage}
        options={({ route, navigation }) => ({
          header: () => <ProfileHeader />,
        })}
      />
      {/* <Stack.Screen
        name={CART_NAVIGATION.PAYMENTCART}
        component={CartPaymentPage}
        options={({ route, navigation }) => ({
          header: () => <CartHeader title="Thanh toán" showArrow={true} navigation={navigation} />,
        })}
      /> */}
    </Stack.Navigator>
  );
};

export default React.memo(ProfileNavigator);
