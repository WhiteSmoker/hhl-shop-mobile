export interface IUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  described: string;
  phone: string;
  avatar: string;
  email: string;
  website: string;
  loginMethod: string;
  forgotPasswordCode?: any;
  createdAt: string;
  updatedAt: string;
  isSignup: boolean;
  token: string;
  channelName: number;
  listFollowers: { count: number; rows: IUserInfo[] };
  listFollowing: { count: number; rows: IUserInfo[] };
  blockedBy: IUserInfo[];
  blocks: IUserInfo[];
  isFollow: boolean;
  checked: boolean;
  isAdvancedUser?: boolean;
  isUpdatedSurvey?: boolean;
}

export interface Stump {
  listLeagueTag: any;
  listMarketTag: any;
  listSportTag: any;
  listTeamTag: any;
  id: number;
  hostId: number;
  mode: number;
  title: string;
  duration: number;
  conversationId: number;
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  listStump: string[];
  tag?: Tag[];
  file: File[];
  reactions?: {
    count: number;
    rows: UserReaction[];
  };
  userShared?: number[];
  screen?: string;
  status: number;
  maximum?: boolean;
  shortLink?: string;
  draft: string;
  description: string;
  notStump: boolean;
  playCounter?: null | number;
  comments?: number;
  sharings: IUserInfo[];
  isFeaturedPost?: number;
  logo?: string;
  isAds?: boolean;
  link?: string;
}

export interface Tag {
  id: number;
  tagName: string;
  createdAt: Date;
}

export interface File {
  id: number;
  counter: number;
  participantId: number;
  conversationId: number;
  duration: number;
  fileName: string;
  filePath: string;
  fileTrialPath: string;
  fileType: number;
  createdAt: Date;
}

export interface Participant {
  id: number;
  inviteMethod?: string;
  inviteValue?: string;
  inviteCode?: string;
  agoraUid?: any;
  userId?: number;
  conversationId?: number;
  isHost?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUserInfo;
  online?: boolean;
  active?: number;
  isAccepted?: boolean;
}

export interface UserReaction {
  userId: number;
  type: number;
  user?: IUserInfo;
}

export type TFieldStumpTab =
  | 'created'
  | 'liked'
  | 'restumped'
  | 'joined'
  | 'createdProfile'
  | 'likedProfile'
  | 'restumpedProfile'
  | 'joinedProfile';

export type UrlSchedule = 'stump/getConversationScheduled' | 'stump/getListAcceptedConv';
export type FieldSchedule = 'schedule' | 'scheduleParticipatedIn';
