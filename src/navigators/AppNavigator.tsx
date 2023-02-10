import React from 'react';
import { scale } from 'react-native-size-scaling';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';

import { ifNotchIphone } from '../theme/scale';
import CartNavigator from './CartNavigator';
import HomeNavigator from './HomeNavigator';
import ProductNavigator from './ProductNavigator';
import ProfileNavigator from './ProfileNavigator';

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
import { Colors } from '@/theme/colors';

export type TabBottomStackParam = {
  [APP_NAVIGATION.HOME]: undefined;
  [APP_NAVIGATION.PRODUCT]: undefined;
  [APP_NAVIGATION.CART]: undefined;
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

export const TAB_BAR_HEIGHT = scale(ifNotchIphone(72, 60));

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={APP_NAVIGATION.HOME}
      screenOptions={{ headerShown: false, tabBarStyle: { height: TAB_BAR_HEIGHT } }}>
      <Tab.Screen
        name={APP_NAVIGATION.HOME}
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarLabel: () => <></>,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconHomeTab', 'IconSelectedHomeTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.PRODUCT}
        component={ProductNavigator}
        options={({ route }) => ({
          tabBarLabel: () => <></>,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconSearchTab', 'IconSelectedSearchTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.CART}
        component={CartNavigator}
        options={({ route }) => ({
          tabBarLabel: () => <></>,
          tabBarIcon: props => {
            return RenderTabBarIcon('IconRecordTab', 'IconSelectedRecordTab', props.focused);
          },
        })}
      />
      <Tab.Screen
        name={APP_NAVIGATION.PROFILE}
        component={ProfileNavigator}
        options={({ route }) => ({
          tabBarLabel: () => <></>,
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
  margin-top: ${scale(0)}px;
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
