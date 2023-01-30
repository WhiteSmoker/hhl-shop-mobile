import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SEARCH_NAVIGATION } from '@/constants';
import SearchComponent from '@/screens/Search/Search.screen';
import RootHeader from './headers/RootHeader';

export type ChatStackParam = {
  [SEARCH_NAVIGATION.SEARCH]: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParam>();

const ChatNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={SEARCH_NAVIGATION.SEARCH} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={SEARCH_NAVIGATION.SEARCH}
        component={SearchComponent}
        options={({ route, navigation }) => ({
          header: () => (
            <RootHeader
              showArrow={true}
              hideRight={false}
              route={route}
              navigation={navigation}
              screen={SEARCH_NAVIGATION.SEARCH}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
export default React.memo(ChatNavigation);
