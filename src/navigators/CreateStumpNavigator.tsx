import React from 'react';
import { RECORD_NAVIGATION } from '@/constants';
import { Stump } from '@/stores';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootHeader from './headers/RootHeader';
import FirstStep from '@/screens/CreateStump/FirstStep';
import SecondStep from '@/screens/CreateStump/SecondStep';
import SecondStepHeader from './headers/CreateStump/SecondStepHeader';
import ThirdStep from '@/screens/CreateStump/ThirdStep';
import Recording from '@/screens/CreateStump/Recording';
import RecordingHeader from './headers/CreateStump/RecordingHeader';
import Publish from '@/screens/CreateStump/Publish';
import PublishSuccess from '@/screens/CreateStump/PublishSuccess';

export type CreateStackParam = {
  [RECORD_NAVIGATION.FIRST_STEP]:
    | { postId?: number; matchId?: number; sportId?: number; leagueId?: number; teamId?: number; marketId?: number }
    | undefined;
  [RECORD_NAVIGATION.SECOND_STEP]:
    | { postId?: number; matchId?: number; sportId?: number; leagueId?: number; teamId?: number; marketId?: number }
    | {
        inviteCode?: string;
        email?: string;
        inviteValue?: string; //email or phone number
      }
    | undefined;
  [RECORD_NAVIGATION.THIRD_STEP]: undefined;
  [RECORD_NAVIGATION.RECORDING]: {
    conversationId: string | null;
    inviteCode?: string | null;
  };
  [RECORD_NAVIGATION.PUBLISH]: { title: string; tag: string[]; description: string; screen: string } | undefined;
  [RECORD_NAVIGATION.PUBLISH_SUCCESS]: {
    newStump: Stump;
    screen: string;
  };
};

const Stack = createNativeStackNavigator<CreateStackParam>();

const CreateStumpNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={RECORD_NAVIGATION.FIRST_STEP} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={RECORD_NAVIGATION.FIRST_STEP}
        component={FirstStep}
        options={({ route, navigation }) => ({
          header: () => (
            <RootHeader
              showArrow={true}
              hideRight={false}
              route={route}
              navigation={navigation}
              title={'New Stump'}
              screen={RECORD_NAVIGATION.FIRST_STEP}
            />
          ),
        })}
      />
      <Stack.Screen
        name={RECORD_NAVIGATION.SECOND_STEP}
        component={SecondStep}
        options={({ navigation }) => ({
          header: () => (
            <SecondStepHeader title={'New Stump'} showArrow={true} navigation={navigation} hideRight={true} />
          ),
        })}
      />
      <Stack.Screen
        name={RECORD_NAVIGATION.THIRD_STEP}
        component={ThirdStep}
        options={({ route, navigation }) => ({
          header: () => (
            <SecondStepHeader title={'New Stump'} showArrow={true} navigation={navigation} hideRight={true} />
          ),
        })}
      />
      <Stack.Screen
        name={RECORD_NAVIGATION.RECORDING}
        component={Recording}
        options={{
          header: () => <RecordingHeader title={'Recording'} hideRight={true} />,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RECORD_NAVIGATION.PUBLISH}
        component={Publish}
        options={({ route, navigation }) => ({
          header: () => (
            <SecondStepHeader
              title={'Publish'}
              showArrow={false}
              navigation={navigation}
              hideRight={true}
              route={route}
            />
          ),
        })}
      />
      <Stack.Screen
        name={RECORD_NAVIGATION.PUBLISH_SUCCESS}
        component={PublishSuccess}
        options={({ route, navigation }) => ({
          header: () => (
            <SecondStepHeader
              title={'Publish'}
              showArrow={true}
              navigation={navigation}
              hideRight={true}
              route={route}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default React.memo(CreateStumpNavigator);
