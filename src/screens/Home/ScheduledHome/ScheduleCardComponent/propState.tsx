import { FieldSchedule } from '@/stores';
import { Conversation } from '@/stores/types/record.type';

export interface StyleProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  fontWeight?: string;
  color?: string;
  marginLeft?: number;
}

export interface IProps {
  data: Conversation;
  navigation: any;
  screen?: string;
  field: FieldSchedule;
}
