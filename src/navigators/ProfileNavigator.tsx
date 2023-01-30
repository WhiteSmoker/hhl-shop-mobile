import { PROFILE_NAVIGATION } from '@/constants';
import ProfileComponent from '@/screens/Profile/Profile.screen';
import Settings from '@/screens/Profile/Settings';
import { IUserInfo } from '@/stores/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import IconHeader from './headers/StumpHeader';
import RootHeader from './headers/RootHeader';
import { Blocking } from '@/screens/Profile/Blocking';
import FollowScreen from '@/screens/Profile/FollowScreen';
import ProfileHeader from './headers/ProfileHeader';
import FollowHeader from './headers/FollowHeader';
import EditProfile from '@/screens/Profile/EditProfile';
import { ChangePasswordComponent } from '@/screens';
export type ProfileStackParam = {
  [PROFILE_NAVIGATION.DETAIL_PROFILE]: { userId: number; indexActive?: { index: number } };
  [PROFILE_NAVIGATION.CHANGE_PASSWORD]: { email: string; screen?: string };
  [PROFILE_NAVIGATION.EDIT_PROFILE]: { profileInfo?: IUserInfo; screen?: string };
  [PROFILE_NAVIGATION.VIEW_PROFILE]: { userId: number; screen?: string };
  [PROFILE_NAVIGATION.FOLLOW_SCREEN]: { userInfo: IUserInfo; indexActive: number; userIdRoute: number };
  [PROFILE_NAVIGATION.FOLLOW_SCREEN_PROFILE]: { userInfo: IUserInfo; indexActive: number; userIdRoute: number };
  [PROFILE_NAVIGATION.SETTINGS]: undefined;
  [PROFILE_NAVIGATION.BLOCKING]: undefined;
  [PROFILE_NAVIGATION.PREFERENCE]: { email?: string; screen?: string };
};
const Stack = createNativeStackNavigator<ProfileStackParam>();
const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={PROFILE_NAVIGATION.DETAIL_PROFILE}
      screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={PROFILE_NAVIGATION.DETAIL_PROFILE}
        component={ProfileComponent}
        options={({ route, navigation }) => ({
          header: () => (
            <RootHeader
              showArrow={true}
              hideRight={false}
              route={route}
              navigation={navigation}
              screen={PROFILE_NAVIGATION.DETAIL_PROFILE}
            />
          ),
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.VIEW_PROFILE as any}
        component={ProfileComponent}
        options={({ route, navigation }) => ({
          header: () => <ProfileHeader navigation={navigation} showArrow={true} route={route} isGoBack={false} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.EDIT_PROFILE}
        component={EditProfile}
        options={({ route, navigation }) => ({
          header: () => <ProfileHeader navigation={navigation} showArrow={true} route={route} isGoBack={false} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.CHANGE_PASSWORD}
        component={ChangePasswordComponent}
        options={({ route, navigation }) => ({
          header: () => <ProfileHeader navigation={navigation} showArrow={true} route={route} isGoBack={false} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.SETTINGS}
        component={Settings}
        options={({ route, navigation }) => ({
          header: () => <IconHeader navigation={navigation} showArrow={true} route={route} isGoBack={true} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.BLOCKING}
        component={Blocking}
        options={({ route, navigation }) => ({
          header: () => <ProfileHeader navigation={navigation} showArrow={true} route={route} isGoBack={true} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.FOLLOW_SCREEN}
        component={FollowScreen}
        options={({ route, navigation }) => ({
          header: () => <FollowHeader navigation={navigation} showArrow={true} route={route} />,
        })}
      />
      <Stack.Screen
        name={PROFILE_NAVIGATION.FOLLOW_SCREEN_PROFILE}
        component={FollowScreen as any}
        options={({ route, navigation }) => ({
          header: () => <FollowHeader navigation={navigation} showArrow={true} route={route} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default React.memo(ProfileNavigator);
