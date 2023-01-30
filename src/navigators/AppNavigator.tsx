import {
  IconDotRecordTab,
  IconHomeTab,
  IconNotificationTab,
  IconProfileTab,
  IconRecordTab,
  IconSearchTab,
  IconSelectedDotRecordTab,
  IconSelectedHomeTab,
  IconSelectedNotificationTab,
  IconSelectedProfileTab,
  IconSelectedRecordTab,
  IconSelectedSearchTab,
} from '@/assets/icons/Icon';
import { APP_NAVIGATION } from '@/constants/navigation';
import useSocketRecord from '@/hooks/useSocketRecord';
import { socketRecord } from '@/networking';
import { selectTabActive, useAppSelector } from '@/stores';
import { commonSlice, recordSlice } from '@/stores/reducers';
import { Colors } from '@/theme/colors';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { AppState, Platform, Text } from 'react-native';
import { scale } from 'react-native-size-scaling';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { ifNotchIphone } from '../theme/scale';
import ChatNavigator from './ChatNavigator';
import CommentNavigator from './CommentNavigator';
import CreateStumpNavigator from './CreateStumpNavigator';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';
import NotificationNavigator from './NotificationNavigator';
import SearchNavigator from './SearchNavigator';
import useSocketChat from '@/hooks/useSocketChat';
import { stumpController, userController } from '@/controllers';
import { socketChat } from '@/networking/SocketChat';
import { delay } from '@/utils/debounce';
import { useIsRecording } from '@/hooks/useIsRecording';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { globalLoading } from '@/containers/actions/emitter.action';

export type TabBottomStackParam = {
  [APP_NAVIGATION.HOME]: undefined;
  [APP_NAVIGATION.SEARCH]: undefined;
  [APP_NAVIGATION.CREATE]: undefined;
  [APP_NAVIGATION.NOTIFICATION]: undefined;
  [APP_NAVIGATION.PROFILE]: undefined;
};
const Tab = createBottomTabNavigator<TabBottomStackParam>();
// tabBarVisible: false no longer exists on v6 but you can use tabBarStyle: { display: 'none' } instead. I found out here

// https://reactnavigation.org/docs/upgrading-from-5.x/#the-tabbarvisible-option-is-no-longer-present

const tabBarIconComponents = {
  IconSelectedHomeTab,
  IconSelectedSearchTab,
  IconSelectedRecordTab,
  IconSelectedDotRecordTab,
  IconSelectedNotificationTab,
  IconSelectedProfileTab,
  IconHomeTab,
  IconSearchTab,
  IconRecordTab,
  IconDotRecordTab,
  IconNotificationTab,
  IconProfileTab,
};

const RenderTabBarIcon = (
  component: keyof typeof tabBarIconComponents,
  selectedComponent: keyof typeof tabBarIconComponents,
  focused: boolean,
) => {
  const Component = tabBarIconComponents[component];
  const SelectedComponent = tabBarIconComponents[selectedComponent];
  if (focused) {
    return (
      <ViewIcon>
        <SelectedComponent width={scale(36)} height={scale(36)} />
      </ViewIcon>
    );
  }
  return (
    <ViewIcon>
      <Component width={scale(36)} height={scale(36)} />
    </ViewIcon>
  );
};

export const TAB_BAR_HEIGHT = scale(ifNotchIphone(100, 82));

export function AppNavigator() {
  const isRecording = useIsRecording();
  const dispatch = useDispatch();
  const tabActive = useAppSelector(selectTabActive);
  const {
    count: countScheduled,
    countDraft,
    countAccepted,
    countNewNotification,
  } = useAppSelector(rootState => rootState.counterState);

  const recordingScreen = useAppSelector(rootState => rootState.recordState.recordingScreen);

  const { connectSocket } = useSocketRecord();

  const { connectSocketChat } = useSocketChat();

  useEmitter(EDeviceEmitter.DEEP_LINK_PLAY_STUMP, async (stumpId: number) => {
    try {
      globalLoading(true);
      const res = await stumpController.getDetailStump(stumpId);
      if (res.status === 1 && res.data[0]) {
        dispatch(commonSlice.actions.setPlayStump({ ...res.data[0], screen: APP_NAVIGATION.HOME }));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  });

  const _handleAppStateChange = async (nextAppState: string) => {
    try {
      if (nextAppState === 'active') {
        await userController.clearBadge();
        if (Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
      }
      if (nextAppState === 'active' && !socketRecord.socket?.connected) {
        await connectSocket();
        await delay(1000);
        if (!socketRecord.socket?.connected) {
          await connectSocket();
        }
      }
      if (nextAppState === 'active' && !socketChat.socket?.connected) {
        await connectSocketChat();
        await delay(1000);
        if (!socketChat.socket?.connected) {
          await connectSocketChat();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    SplashScreen.hide();
    //app state change
    const sub = AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={APP_NAVIGATION.HOME}
      screenOptions={{ headerShown: false, tabBarStyle: { height: TAB_BAR_HEIGHT } }}>
      <Tab.Screen
        name={APP_NAVIGATION.HOME}
        component={HomeNavigator}
        listeners={{
          focus: () => {
            dispatch(commonSlice.actions.setTabActive(APP_NAVIGATION.HOME));
          },
        }}
        options={({ route }) => ({
          tabBarLabel: () => <Text />,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconHomeTab', 'IconSelectedHomeTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.SEARCH}
        component={SearchNavigator}
        listeners={{
          focus: () => {
            dispatch(commonSlice.actions.setTabActive(APP_NAVIGATION.SEARCH));
          },
        }}
        options={({ route }) => ({
          tabBarLabel: () => <Text />,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconSearchTab', 'IconSelectedSearchTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.CREATE}
        component={CreateStumpNavigator}
        listeners={{
          blur: () => {
            !isRecording &&
              dispatch(
                recordSlice.actions.setConfig({
                  postId: undefined,
                  matchId: undefined,
                  sportId: undefined,
                  leagueId: undefined,
                  teamId: undefined,
                  marketId: undefined,
                }),
              );
          },
          focus: () => {
            dispatch(commonSlice.actions.setTabActive(APP_NAVIGATION.CREATE));
          },
          tabPress: e => {
            if (
              e.target?.indexOf('CREATE') !== -1 &&
              recordingScreen === 'recording' &&
              tabActive === APP_NAVIGATION.CREATE
            ) {
              e.preventDefault();
            }
          },
        }}
        options={({ route }) => ({
          tabBarLabel: () => <Text />,
          tabBarIcon: props => {
            return countScheduled + countDraft + countAccepted < 0
              ? RenderTabBarIcon('IconRecordTab', 'IconSelectedRecordTab', props.focused)
              : RenderTabBarIcon('IconDotRecordTab', 'IconSelectedDotRecordTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.NOTIFICATION}
        component={NotificationNavigator}
        listeners={{
          focus: () => {
            dispatch(commonSlice.actions.setTabActive(APP_NAVIGATION.NOTIFICATION));
          },
        }}
        options={({ route }) => ({
          tabBarLabel: () => <Text />,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconNotificationTab', 'IconSelectedNotificationTab', props.focused);
          },
          tabBarBadge: countNewNotification || undefined,
          tabBarBadgeStyle: { fontSize: scale(10) },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.PROFILE}
        component={ProfileNavigator}
        listeners={({ navigation }) => ({
          focus: () => {
            dispatch(commonSlice.actions.setTabActive(APP_NAVIGATION.PROFILE));
          },
        })}
        options={({ route }) => ({
          tabBarLabel: () => <Text />,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconProfileTab', 'IconSelectedProfileTab', props.focused);
          },
        })}
      />
    </Tab.Navigator>
  );
}

interface StyleProps {
  backgroundColor?: string;
  color?: string;
}

export const LabelNavigationStyled = styled.Text<StyleProps>`
  padding-bottom: ${scale(7)}px;
  padding-top: ${scale(6)}px;
  font-size: ${scale(10)}px;
  line-height: ${scale(12)}px;
  text-align: center;
  width: 100%;
  color: ${(props: StyleProps) => props.color || Colors.Dark_Gray_8B};
`;

export const ViewIcon = styled.View`
  margin-top: ${scale(15)}px;
`;

export const DotStyled = styled.View`
  position: absolute;
  background-color: #ff3a30;
  width: ${scale(9)}px;
  height: ${scale(9)}px;
  border-radius: ${scale(20)}px;
  z-index: 1;
  top: ${scale(10)}px;
  right: ${scale(-4)}px;
`;
