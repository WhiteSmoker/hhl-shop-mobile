import { Conversation } from '@/stores/types/record.type';

export interface Props {
  navigation: any;
}

export interface IState {
  data: Conversation[];
  currentPage: number;
  maxPage: number;
  isLoading: boolean;
  loadingMore: boolean;
}
export interface StyledProps {
  marginTop?: number;
}
