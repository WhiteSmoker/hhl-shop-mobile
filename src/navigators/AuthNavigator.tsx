import { AUTH_NAVIGATION } from '@/constants/navigation';
import { ForgotPassword, Login, RegisterComponent } from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type AuthStackParam = {
  [AUTH_NAVIGATION.LOGIN]: undefined;
  [AUTH_NAVIGATION.REGISTER]: undefined;
  [AUTH_NAVIGATION.FORGOT_PASSWORD]: undefined;
  [AUTH_NAVIGATION.CHANGE_PASSWORD]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParam>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right', animationDuration: 150 }}>
      <Stack.Screen component={Login} name={AUTH_NAVIGATION.LOGIN} options={{ header: () => null }} />
      <Stack.Screen component={RegisterComponent} name={AUTH_NAVIGATION.REGISTER} options={{ header: () => null }} />
      <Stack.Screen
        component={ForgotPassword}
        name={AUTH_NAVIGATION.FORGOT_PASSWORD}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
