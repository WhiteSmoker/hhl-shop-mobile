import { NOTIFICATION_NAVIGATION } from '@/constants';
import NotificationScreen from '@/screens/Notification/Notification.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import RootHeader from './headers/RootHeader';

export type NotificationStackParam = {
  [NOTIFICATION_NAVIGATION.NOTIFICATION]: undefined;
};
const Stack = createNativeStackNavigator<NotificationStackParam>();

const NotificationNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={NOTIFICATION_NAVIGATION.NOTIFICATION}
      screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={NOTIFICATION_NAVIGATION.NOTIFICATION}
        component={NotificationScreen}
        options={({ route, navigation }) => ({
          header: () => (
            <RootHeader
              showArrow={true}
              hideRight={false}
              route={route}
              navigation={navigation}
              screen={NOTIFICATION_NAVIGATION.NOTIFICATION}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
export default React.memo(NotificationNavigator);
