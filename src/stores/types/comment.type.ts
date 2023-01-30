import { COMMENT_NAVIGATION } from '@/constants';
import { CommentStackParam } from '@/navigators/CommentNavigator';
import { RouteProp } from '@react-navigation/native';
import { Animated, TextInputProps, ViewStyle } from 'react-native';
import { IUserInfo } from '.';

export type NavigationComment = any;

export interface IComment {
  _id?: number;
  id: number;
  content: string;
  parentId: number;
  user: IUserInfo;
  childs?: IComment[];
  likedBy: IUserInfo[];
  totalReact: number;
  isReacted: boolean;
  createdAt?: string;
  expand?: boolean;
  isHighlight?: boolean;
  type: 'TEXT' | 'MEDIA';
}

export interface IMentionInputProps extends TextInputProps {
  onSearch: (keyword: string, idx: number) => void;
  scrollToEnd: () => void;
  scrollToIdx: (parentId: number) => void;
  sendReply: (content: string, parentId: number, type: 'TEXT' | 'MEDIA', _id?: number, onSuccess?: () => void) => void;
  appearView: () => Promise<void>;
  disappearView: () => Promise<void>;
  containerInputStyle?: ViewStyle;
  buttonSendStyle?: ViewStyle;
}

export interface IAllCommentProps {
  navigation: any;
  route: RouteProp<any, COMMENT_NAVIGATION.ALL_COMMENT>;
}

export interface AllCommentSliceState {
  allComment: IComment[];
  replyComment?: IComment;
  likeComment?: IComment;
  commentLikeReply?: { comment: IComment; totalReact: number; isReacted: boolean };
}

export interface ICommentLikesProps {
  navigation: any;
  route: RouteProp<CommentStackParam, COMMENT_NAVIGATION.COMMENT_LIKES>;
}

export interface IUseMentionCommentState {
  fetching: boolean;
  loadingMore: boolean;
  canViewAll: boolean;
  mentionUsers: IUserInfo[];
  searching: boolean | string;
}

export interface IMentionInputRef {
  mention: (user: IUserInfo) => void;
  getValue: () => string;
  getKeyword: () => string;
}
export interface IRenderTextCommentProps {
  comment: string;
  commentator: IUserInfo;
  navigation: any;
}

export interface ISearchUserMentionProps {
  data: IUserInfo[];
  onSelectUser: (user: IUserInfo) => void;
  aniAppearView: Animated.Value;
  searching: boolean | string;
}
