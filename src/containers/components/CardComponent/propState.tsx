import { Stump } from '@/stores/types';

export interface StyleProps {
  width?: number;
  height?: number;
  color?: string;
  fontWeight?: string;
  marginLeft?: number;
  borderRadius?: number;
}

export interface IProps {
  data: Stump;
  navigation: any;
  screen?: string;
  share?: boolean;
  indexCard?: number;
}
