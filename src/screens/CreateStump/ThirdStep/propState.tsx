import { RECORD_NAVIGATION } from '@/constants';
import { CreateStackParam } from '@/navigators/CreateStumpNavigator';
import { IUserInfo } from '@/stores';
import { RouteProp } from '@react-navigation/native';

export interface IProps {
  navigation: any;
  route: RouteProp<CreateStackParam, RECORD_NAVIGATION.THIRD_STEP>;
}

export interface StyleProps {
  marginTop?: number;
  width?: number;
  backgroundColor?: string;
  color?: string;
  height?: number;
  marginLeft?: number;
}

export interface IState {
  modeDateTime?: 'date' | 'time';
  filterList?: IUserInfo[];
  userSystem?: IUserInfo[];
  estimateTime: Date;
  emailTags: string[];
  phoneNumberTags: string[];
  heightSearch: number;
  currentPage: number;
  maxPage: number;
  loadingSearch: boolean;
  loadingMore: boolean;
  currentPageUserSystem: number;
  maxPageUserSystem: number;
  loadingMoreUserSystem: boolean;
  usersChecked: IUserInfo[];
  phoneFromContact: string;
  listPhoneFromContact: string[];
}
