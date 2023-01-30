import { ROOT_ROUTES } from '@/constants';
import { NavigationContainer } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { AppNavigator } from '@/navigators/AppNavigator';
import { AuthNavigator } from '@/navigators/AuthNavigator';
import '@/networking';
import Preference from '@/screens/Profile/Preference';
import { useAppSelector } from '@/stores';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TitleHeader from './headers/TitleHeader';
import StumpHeader from './headers/StumpHeader';
import SurveyNavigator from './SurveyNavigator';
import { navigationRef } from './refs';
import useDeepLink from '@/hooks/useDeepLink';
import useMessageNotification from '@/hooks/useMessageNotification';
import { PlayMedia } from '@/screens/PlayMedia';
import ChatNavigator from './ChatNavigator';
import CommentNavigator from './CommentNavigator';
export type RootStackParam = {
  [ROOT_ROUTES.APP_NAVIGATION]: undefined;
  [ROOT_ROUTES.AUTH_NAVIGATION]: undefined;
  [ROOT_ROUTES.SIGN_UP_SURVEY]: undefined;
  [ROOT_ROUTES.PROFILE_PREFERENCE]: undefined;
  //Specify screen will be hide bottomtab
  [ROOT_ROUTES.MEDIA]: { uri: string; mimeType: 'video' | 'audio' | 'image' };
  [ROOT_ROUTES.CHAT]: undefined;
  [ROOT_ROUTES.COMMENT]: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParam>();

export function RootNavigator() {
  const user = useAppSelector(state => state.userState.userInfo);
  useDeepLink();
  useMessageNotification();
  const chooseScreen = useMemo(() => {
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
        <RootStack.Screen
          name={ROOT_ROUTES.SIGN_UP_SURVEY}
          component={SurveyNavigator}
          options={() => ({
            header: () => null,
          })}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.PROFILE_PREFERENCE}
          component={Preference as any}
          options={({ route, navigation }) => ({
            header: () => <TitleHeader navigation={navigation} title={'Preference'} />,
          })}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.MEDIA}
          component={PlayMedia as any}
          options={() => ({
            header: () => null,
          })}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.CHAT}
          component={ChatNavigator as any}
          options={() => ({
            header: () => null,
          })}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.COMMENT}
          component={CommentNavigator as any}
          options={() => ({
            header: () => null,
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
