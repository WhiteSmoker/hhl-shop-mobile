// listStump by postId/matchId interface
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  email: string;
  phone: string;
  password: string;
  described: string;
  website: string;
  role?: any;
  loginMethod: number;
  forgotPasswordCode?: any;
  isAdvancedUser: boolean;
  createdAt: Date;
  updatedAt: Date;
  isUpdatedSurvey: boolean;
  isAllowDownload: boolean;
}

export interface IParticipant {
  id: number;
  inviteMethod?: any;
  inviteValue: string;
  inviteCode?: any;
  agoraUid?: any;
  active: number;
  userId: number;
  conversationId: number;
  isHost: boolean;
  isSignupSuccess: boolean;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
}

export interface IFile {
  id: number;
  participantId: number;
  conversationId: number;
  duration: number;
  counter?: any;
  fileName: string;
  filePath: string;
  fileTrialPath?: any;
  fileType: number;
  createdAt: Date;
}

export interface IReactions {
  count: number;
  rows: any[];
}

export interface IStumpData {
  id: number;
  hostId: number;
  mode: number;
  title: string;
  duration: number;
  conversationId: number;
  createdAt: Date;
  updatedAt: Date;
  sharedAt?: any;
  allowedToShow?: any;
  status?: any;
  playCounter: number;
  userShared?: any;
  listStump: any[];
  sportId: number;
  marketId: number;
  leagueId: number;
  teamId: number;
  postId: number;
  matchId: number;
  description: string;
  participants: IParticipant[];
  tag: any[];
  file: IFile[];
  reactions: IReactions;
  comments: number;
}

export interface IStump {
  count: number;
  stumpData?: IStumpData[];
  stumps?: IStumpData[];
}

export interface IDiscoveryStumpResponse {
  status: number;
  data: IStump;
}

// listPost interface
export interface IPost {
  id: number;
  title: string;
  avatarUrl: string;
  pageUrl: string;
  author: string;
  content?: any;
  publishedAt: Date;
  stumpId?: any;
  leagueId: number;
  createdAt: Date;
  countStump: number;
  leagueName: string;
  sportName: string;
}

// listMatch interface
export interface IMatch {
  id: number;
  name?: string;
  home?: string;
  away?: string;
  date?: any;
  stumpId?: any;
  oddAway?: any;
  oddHome?: any;
  sportId?: number;
  leagueId?: number;
  scoreHome?: number;
  scoreAway?: number;
  homeLogo?: string;
  awayLogo?: string;
  roundId?: number;
  homeNickname?: string;
  awayNickname?: string;
  createdAt?: Date;
  countStump?: number;
  leagueName?: string;
  sportName?: string;
}

export interface ITrendingResponse {
  status: number;
  data: IMatch[] | IPost[] | IDiscovery[];
}

export interface IDiscovery {
  type: string;
  id: number;
  name: string;
}
