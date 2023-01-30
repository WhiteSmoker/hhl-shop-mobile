import { HOME_NAVIGATION } from '@/constants/navigation';
import Publish from '@/screens/CreateStump/Publish';
import Discovery from '@/screens/Home/Discovery/index.screen';
import DraftHome from '@/screens/Home/DraftHome';
import { Home } from '@/screens/Home/Home.screen';
import RescheduleHome from '@/screens/Home/RescheduleHome';
import TabViewSchedule from '@/screens/Home/ScheduledHome/TabViewSchedule';
import { FieldSchedule, Stump } from '@/stores';
import { IDiscovery, IMatch, IPost } from '@/stores/types/discovery.type';
import { Conversation } from '@/stores/types/record.type';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeHeader from './headers/HomeHeader';
import RootHeader from './headers/RootHeader';
import StumpHeader from './headers/StumpHeader';

export type HomeStackParam = {
  [HOME_NAVIGATION.NEW_FEED]: undefined;
  [HOME_NAVIGATION.DISCOVERY]: { post?: IPost; match?: IMatch; discoveryDetail?: IDiscovery; screen?: string };
  [HOME_NAVIGATION.DRAFTHOME]: undefined;
  [HOME_NAVIGATION.SCHEDULEDHOME]: { tab?: FieldSchedule };
  [HOME_NAVIGATION.RESCHEDULEHOME]: { data: Conversation };
  [HOME_NAVIGATION.EDIT_STUMP]: { stumpDetail: Stump; title: string; tag: string[]; description: string; mode: 'Edit' };
};
const Stack = createNativeStackNavigator<HomeStackParam>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={HOME_NAVIGATION.NEW_FEED} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={HOME_NAVIGATION.NEW_FEED}
        component={Home}
        options={({ route, navigation }) => ({
          header: () => (
            <RootHeader
              showArrow={true}
              hideRight={false}
              route={route}
              navigation={navigation}
              screen={HOME_NAVIGATION.NEW_FEED}
            />
          ),
        })}
      />
      <Stack.Screen
        name={HOME_NAVIGATION.DISCOVERY}
        component={Discovery}
        options={({ route, navigation }) => ({
          header: () => (
            <StumpHeader showArrow={true} hideRight={false} route={route} navigation={navigation} isGoBack={false} />
          ),
        })}
      />
      <Stack.Screen
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
      />
      <Stack.Screen
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
      />
      <Stack.Screen
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
      />
      <Stack.Screen
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
      />
    </Stack.Navigator>
  );
};
export default React.memo(HomeNavigator);
