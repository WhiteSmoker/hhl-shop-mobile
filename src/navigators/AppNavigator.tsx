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
import { selectTabActive, useAppSelector } from '@/stores';
import { commonSlice } from '@/stores/reducers';
import { Colors } from '@/theme/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { ifNotchIphone } from '../theme/scale';
// import HomeNavigator from './HomeNavigator';
// import ProfileNavigator from './ProfileNavigator';
// import SearchNavigator from './SearchNavigator';

export type TabBottomStackParam = {
  [APP_NAVIGATION.HOME]: undefined;
  [APP_NAVIGATION.SEARCH]: undefined;
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
  const dispatch = useDispatch();
  const tabActive = useAppSelector(selectTabActive);

  return (
    <Tab.Navigator
      initialRouteName={APP_NAVIGATION.HOME}
      screenOptions={{ headerShown: false, tabBarStyle: { height: TAB_BAR_HEIGHT } }}>
      {/* <Tab.Screen
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
      /> */}
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
