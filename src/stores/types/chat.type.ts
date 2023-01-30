import { CHAT_NAVIGATION } from '@/constants';
import { ChatStackParam } from '@/navigators/ChatNavigator';
import { RouteProp } from '@react-navigation/native';
import { Animated } from 'react-native';
import { IMessage, SendProps } from 'react-native-gifted-chat';
import { IUserInfo } from '.';

export type TRoomType = 'CHAT' | 'GROUP_CHAT' | 'MESSAGE_REQUESTS';
export type TMessageType = 'TEXT' | 'AUDIO' | 'IMAGE' | 'VIDEO';

export interface IRoomChat {
  id: number;
  name?: any;
  conversationId?: any;
  totalMessages: number;
  type: TRoomType;
  status: 'ACTIVE';
  reading?: boolean;
  members: (IUserInfo & { lastMsgId?: number })[];
  messages: MessageChat[];
}

export interface ITempMessage extends IMessage {
  _id: number;
  tempId?: number | string;
  thumbnail?: string;
  seenUsers?: IUserInfo[];
  likedBy?: IUserInfo[];
}

export interface MessageChat {
  _id: number;
  roomId: number;
  id: number;
  senderId: number;
  message: string;
  thumbnail: string;
  type: TMessageType;
  createdAt: Date;
  likedBy: IUserInfo[];
}

export interface IAllConversationProps {
  navigation: any;
  route: RouteProp<ChatStackParam, CHAT_NAVIGATION.ALL_CONVERSATION>;
}
export interface ISearchRoomProps {
  navigation: any;
  searchData?: IRoomChat[];
  focusAnim: Animated.Value;
}
export interface ICardConversationProps {
  navigation: any;
  item: IRoomChat;
  mode?: 'search';
}

export interface IInRoomChatProps {
  navigation: any;
  route: RouteProp<ChatStackParam, CHAT_NAVIGATION.IN_ROOM_CHAT>;
}
export interface IMessageMediaProps {
  isLike: boolean;
  messageId: number | string;
  navigation: any;
  type: 'video' | 'image' | 'audio';
  uri: string;
  thumbnail?: string;
  onLongPressMedia: (id: number | string, isLike: boolean) => () => void;
  onDoubleTap: () => void;
}
export interface IMessageAudioProps {
  isLike: boolean;
  messageId: number | string;
  position: 'left' | 'right';
  uri: string;
  onLongPressAudio: (id: number | string, isLike: boolean) => () => void;
  onDoubleTap: () => void;
}

export interface IUserGiftedChat {
  _id: number | string;
  name: string;
  avatar: string;
}
export interface ISendTextProps extends SendProps<ITempMessage> {
  userGiftedChat: IUserGiftedChat;
  onChange?: (messages: ITempMessage[]) => void;
}
export interface ILaunchGalleryProps {
  userGiftedChat: IUserGiftedChat;
  onChange?: (messages: ITempMessage[]) => void;
  containerStyle?: any;
  mode: 'take' | 'pick';
  iconName?: string;
  tintColorIcon?: string;
}
export interface IRecordSpeechProps {
  userGiftedChat: IUserGiftedChat;
  onChange: (messages: ITempMessage[]) => void;
}
export interface IRecordSpeechRef {
  open: () => void;
}

export interface IAmountLikeMsgProps {
  position: 'left' | 'right';
  likedBy: IUserInfo[];
  messageId: number;
}

export interface IEditNamePopupProps {
  roomId: number;
  name: string;
}
export interface IEditNamePopupRef {
  open: () => void;
  close: () => void;
  isShow: () => boolean;
}
export interface Pagination {
  total_count: number;
  count: number;
  offset: number;
}
export interface IGifData {
  data: GifObject[];
  pagination: Pagination;
  meta: Meta;
}

export interface Meta {
  status: number;
  msg: string;
  response_id: string;
}

export interface GifObject {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: GifImages;
  user: any;
  analytics_response_payload: string;
}

export interface GifImages {
  original: GifSize;
  downsized: GifSize;
  downsized_large: GifSize;
  downsized_medium: GifSize;
  downsized_small: GifSize;
  downsized_still: GifSize;
  fixed_height: GifSize;
  fixed_height_downsampled: GifSize;
  fixed_height_small: GifSize;
  fixed_height_small_still: GifSize;
  fixed_height_still: GifSize;
  fixed_width: GifSize;
  fixed_width_downsampled: GifSize;
  fixed_width_small: GifSize;
  fixed_width_small_still: GifSize;
  fixed_width_still: GifSize;
  looping: Looping;
  original_still: GifSize;
  original_mp4: OriginalMp4;
  preview: OriginalMp4;
  preview_gif: OriginalMp4;
  preview_webp: OriginalMp4;
}

export interface GifSize {
  height: string;
  width: string;
  size: string;
  url: string;
}
export interface Looping {
  mp4_size: string;
  mp4: string;
}
export interface OriginalMp4 {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
  url: string;
}
