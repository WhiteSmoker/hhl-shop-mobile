import { NavigationSearch, SearchStump } from '../Search.type';

export interface IProps {
  data: SearchStump[];
  navigation: any;
  onRefresh: () => void;
  loadingMore: boolean;
  refreshing: boolean;
}

export interface StyleProps {
  marginTop?: number;
  backgroundColor?: string;
}

export interface IState {
  currentPage?: number;
  typeSort?: string | undefined;
  idSort?: number | undefined;
  listHighLevel: Array<object>;
  listDataTeam: Array<object>;
}
