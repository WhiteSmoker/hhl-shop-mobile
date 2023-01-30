import { HOME_NAVIGATION } from '@/constants';
import { HomeStackParam } from '@/navigators/HomeNavigator';
import { RouteProp } from '@react-navigation/native';

export interface StyleProps {
  marginTop?: number;
  marginLeft?: number;
  width?: number;
  backgroundColor?: string;
  color?: string;
}

export interface IState {
  modeDateTime?: 'date' | 'time';
  estimateTime: Date;
}

export interface IProps {
  route: RouteProp<HomeStackParam, HOME_NAVIGATION.RESCHEDULEHOME>;
  navigation: any;
}
