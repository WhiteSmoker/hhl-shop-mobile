import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HOME_NAVIGATION } from '@/constants/navigation';
import { HomePage } from '@/screens/Home/Home.screen';

export type HomeStackParam = {
  [HOME_NAVIGATION.NEW_FEED]: undefined;
};
const Stack = createNativeStackNavigator<HomeStackParam>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={HOME_NAVIGATION.NEW_FEED} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={HOME_NAVIGATION.NEW_FEED}
        component={HomePage}
        options={({ route, navigation }) => ({
          header: () => null,
          // (
          //   <RootHeader
          //     showArrow={true}
          //     hideRight={false}
          //     route={route}
          //     navigation={navigation}
          //     screen={HOME_NAVIGATION.NEW_FEED}
          //   />
          // ),
        })}
      />
      {/* <Stack.Screen
        name={HOME_NAVIGATION.DISCOVERY}
        component={Discovery}
        options={({ route, navigation }) => ({
          header: () => (
            <StumpHeader showArrow={true} hideRight={false} route={route} navigation={navigation} isGoBack={false} />
          ),
        })}
      /> */}
      {/* <Stack.Screen
        name={HOME_NAVIGATION.DRAFTHOME}
        component={DraftHome}
        options={({ route, navigation }) => ({
          header: () => (
            <HomeHeader
              title={'Drafts'}
              showArrow={true}
              route={route}
              navigation={navigation}
              hideRight={false}
              isGoBack={true}
            />
          ),
        })}
      /> */}
      {/* <Stack.Screen
        name={HOME_NAVIGATION.SCHEDULEDHOME}
        component={TabViewSchedule}
        options={({ route, navigation }) => ({
          header: () => (
            <HomeHeader
              title={'Scheduled Stumps'}
              showArrow={true}
              route={route}
              navigation={navigation}
              hideRight={true}
              isGoBack={true}
            />
          ),
        })}
      /> */}
      {/* <Stack.Screen
        name={HOME_NAVIGATION.RESCHEDULEHOME}
        component={RescheduleHome}
        options={({ route, navigation }) => ({
          header: () => (
            <HomeHeader
              title={'Re-schedule'}
              showArrow={true}
              route={route}
              navigation={navigation}
              hideRight={true}
              isGoBack={true}
            />
          ),
        })}
      /> */}
      {/* <Stack.Screen
        name={HOME_NAVIGATION.EDIT_STUMP}
        component={Publish as any}
        options={({ route, navigation }) => ({
          header: () => (
            <HomeHeader
              title={'Re-schedule'}
              showArrow={true}
              route={route}
              navigation={navigation}
              hideRight={true}
              isGoBack={false}
            />
          ),
        })}
      /> */}
    </Stack.Navigator>
  );
};
export default React.memo(HomeNavigator);
