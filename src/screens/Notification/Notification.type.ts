import { Notification } from '@/stores/types/notification.type';

export interface StyleProps {
  backgroundColor?: string;
  fontWeight?: string;
  color?: string;
  width?: number;
}

export interface IProps {
  navigation: any;
}

export type IState = {
  currentPage: number;
  maxPage: number;
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  lazy: boolean;
  showToggle: boolean;
  data: Notification[];
};
