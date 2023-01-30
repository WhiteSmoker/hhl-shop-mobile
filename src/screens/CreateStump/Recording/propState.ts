import { APP_NAVIGATION, RECORD_NAVIGATION } from '@/constants';
import { TabBottomStackParam } from '@/navigators/AppNavigator';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { Participant } from '@/stores';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RtcEngine, { AudioOutputRouting } from 'react-native-agora';

export interface IProps {
  navigation: NavigationRecording;
  route: RouteProp<CreateStackParam, RECORD_NAVIGATION.RECORDING>;
}

export type NavigationRecording = CompositeNavigationProp<
  NativeStackNavigationProp<CreateStackParam, RECORD_NAVIGATION.RECORDING>,
  BottomTabNavigationProp<TabBottomStackParam, APP_NAVIGATION.HOME>
>;

export interface StyleProps {
  color?: string;
  width?: number;
  height?: number;
}

export interface IState {
  engine?: RtcEngine;
  channelData: {
    cname: string;
    token: string;
    uid: string;
  };
  participants: Participant[];
  routing: AudioOutputRouting;
}

export interface ITimerProps {
  conversationId: number;
  role: 'participant' | 'host';
  engine?: RtcEngine;
}

export interface StyleTimerProps {
  color?: string;
}
export interface ITimerState {
  seconds: number | string;
  minutes: number | string;
  hours: number | string;
  timestamp: number;
  userJoin?: { uid: number; elapsed: number };
}
