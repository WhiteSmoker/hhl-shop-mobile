import { Stump, TFieldStumpTab } from '@/stores';
import { Animated } from 'react-native';
import { NavigationProfile, ViewProfileData } from '../Profile.prop';

export interface IState {
  currentPage: number;
  maxPage: number;
  loadingMore: boolean;
}
export type IProps = {
  navigation: NavigationProfile;
  url: string;
  field: TFieldStumpTab;
  data: Omit<ViewProfileData, 'count'>;
  scrollY: Animated.Value;
  heightHeader: number;
  textEmptyList: string;
  index?: number;
  currentIndex?: number;
  userId?: number;
  onChangeMoreData: any;
};
