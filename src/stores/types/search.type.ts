import { SearchStump } from '@/screens/Search/Search.type';
import { IUserInfo, Stump } from '.';

export type SearchState = {
  search_stumps: {
    category: Stump[];
    username: IUserInfo[];
    title: Stump[];
  };
  default_search: {
    default: SearchStump[];
  };
};
