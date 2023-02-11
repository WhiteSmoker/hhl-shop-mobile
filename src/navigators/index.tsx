import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { navigationRef } from './refs';

import '@/networking';
import { ROOT_ROUTES } from '@/constants';
import { useAppSelector } from '@/stores';
export type RootStackParam = {
  [ROOT_ROUTES.APP_NAVIGATION]: undefined;
  [ROOT_ROUTES.AUTH_NAVIGATION]: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParam>();

export function RootNavigator() {
  const user = useAppSelector(state => state.userState.userInfo);

  const chooseScreen = React.useMemo(() => {
    return user ? (
      <RootStack.Screen name={ROOT_ROUTES.APP_NAVIGATION} component={AppNavigator} options={{ header: () => null }} />
    ) : (
      <RootStack.Screen name={ROOT_ROUTES.AUTH_NAVIGATION} component={AuthNavigator} options={{ header: () => null }} />
    );
  }, [user]);
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_right',
        }}>
        {chooseScreen}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
