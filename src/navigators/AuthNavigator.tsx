import { AUTH_NAVIGATION } from '@/constants/navigation';
import {
  ChangePasswordComponent,
  ChoosePhotoComponent,
  ForgotPassword,
  Login,
  RegisterComponent,
  UserInformationComponent,
} from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SurveyNavigator from './SurveyNavigator';

export type AuthStackParam = {
  [AUTH_NAVIGATION.LOGIN]: undefined;
  [AUTH_NAVIGATION.REGISTER]: undefined;
  [AUTH_NAVIGATION.FORGOT_PASSWORD]: undefined;
  [AUTH_NAVIGATION.CHANGE_PASSWORD]: undefined;
  [AUTH_NAVIGATION.USER_INFORMATION]: undefined;
  [AUTH_NAVIGATION.CHOOSE_AVATAR]: undefined;
  [AUTH_NAVIGATION.SURVEY_FAV]: undefined;
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
      <Stack.Screen
        component={ChangePasswordComponent}
        name={AUTH_NAVIGATION.CHANGE_PASSWORD}
        options={{ header: () => null }}
      />
      <Stack.Screen
        component={UserInformationComponent}
        name={AUTH_NAVIGATION.USER_INFORMATION}
        options={{ header: () => null }}
      />
      <Stack.Screen
        component={ChoosePhotoComponent}
        name={AUTH_NAVIGATION.CHOOSE_AVATAR}
        options={{ header: () => null }}
      />
      <Stack.Screen component={SurveyNavigator} name={AUTH_NAVIGATION.SURVEY_FAV} options={{ header: () => null }} />
    </Stack.Navigator>
  );
}
