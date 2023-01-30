import { IUserInfo } from '.';
import { TRoomType } from './chat.type';

export interface Notification {
  createdAt: Date;
  data: DataNotification;
  id: number;
  status: number;
  stumpId: number | null;
  type: number;
  userId: number;
  isHide: boolean;
}
export interface DataNotification {
  createdAt: Date;
  message: string;
  time: string;
  users: IUserInfo[] & IUserInfo;
  userInfo: IUserInfo[] & IUserInfo;
  conversationId: number;
  stumpId: number;
  commentId: number;
  roomId: number;
  roomType: TRoomType;
}
