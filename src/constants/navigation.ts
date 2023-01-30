export enum ROOT_ROUTES {
  AUTH_NAVIGATION = 'AUTH_NAVIGATION',
  APP_NAVIGATION = 'APP_NAVIGATION',
  SIGN_UP_SURVEY = 'SIGN_UP_SURVEY',
  PROFILE_PREFERENCE = 'PROFILE_PREFERENCE',
  MEDIA = '[APP] MEDIA',
  COMMENT = '[APP] COMMENT',
  CHAT = '[APP] CHAT',
}

export enum AUTH_NAVIGATION {
  LOGIN = '[AUTH] LOGIN',
  REGISTER = '[AUTH] REGISTER',
  FORGOT_PASSWORD = '[AUTH] FORGOT_PASSWORD',
  CHANGE_PASSWORD = '[AUTH] CHANGE_PASSWORD',
  SURVEY_FAV = '[AUTH] SURVEY_FAV',
  USER_INFORMATION = '[AUTH] USER_INFORMATION',
  CHOOSE_AVATAR = '[AUTH] CHOOSE_AVATAR',
}

export enum APP_NAVIGATION {
  HOME = '[APP] HOME',
  SEARCH = '[APP] SEARCH',
  CREATE = '[APP] CREATE',
  NOTIFICATION = '[APP] NOTIFICATION',
  PROFILE = '[APP] PROFILE',

  MARKET = '[APP] MARKET',
  SPORT = '[APP] SPORT',
}

export enum HOME_NAVIGATION {
  NEW_FEED = '[HOME] NEW_FEED',
  DRAFTHOME = '[HOME] DRAFTHOME',
  SCHEDULEDHOME = '[HOME] SCHEDULEDHOME',
  DISCOVERY = '[HOME] DISCOVERY',
  RESCHEDULEHOME = 'RESCHEDULEHOME',
  EDIT_STUMP = 'EDIT_STUMP',
}

export enum RECORD_NAVIGATION {
  FIRST_STEP = '[RECORD] FIRST_STEP',
  SECOND_STEP = '[RECORD] SECOND_STEP',
  THIRD_STEP = '[RECORD] THIRD_STEP',
  RECORDING = '[RECORD] RECORDING',
  PUBLISH = '[RECORD] PUBLISH',
  PUBLISH_SUCCESS = '[RECORD] PUBLISH_SUCCESS',
  INVITE_CODE_APP = '[RECORD] INVITE_CODE_APP',
}

export enum SEARCH_NAVIGATION {
  SEARCH = '[SEARCH] SEARCH',
}

export enum NOTIFICATION_NAVIGATION {
  NOTIFICATION = '[NOTIFICATION] NOTIFICATION',
}

export enum COMMENT_NAVIGATION {
  EMPTY = 'EMPTY',
  ALL_COMMENT = '[COMMENT] ALL_COMMENT',
  COMMENT_LIKES = 'COMMENT_LIKES',
}

export enum CHAT_NAVIGATION {
  ALL_CONVERSATION = '[CHAT] ALL_CONVERSATION',
  IN_ROOM_CHAT = '[CHAT] IN_ROOM_CHAT',
  REQUEST_CHAT = '[CHAT] REQUEST_CHAT',
}

export enum PROFILE_NAVIGATION {
  DETAIL_PROFILE = '[PROFILE] DETAIL_PROFILE',
  VIEW_PROFILE = '[PROFILE] VIEW_PROFILE',
  CHANGE_PASSWORD = '[PROFILE] CHANGE_PASSWORD',
  EDIT_PROFILE = '[PROFILE] EDIT_PROFILE',
  FOLLOW_SCREEN = '[PROFILE] FOLLOW_SCREEN',
  FOLLOW_SCREEN_PROFILE = '[PROFILE] FOLLOW_SCREEN_PROFILE',
  SETTINGS = '[PROFILE] SETTINGS',
  BLOCKING = '[PROFILE] BLOCKING',
  PREFERENCE = '[PROFILE] PREFERENCE',
}

export enum SURVEY_FAV_NAVIGATION {
  SPORTS_LEAGUES = '[SURVEY] SPORTS_LEAGUES',
  MARKETS_TEAMS = '[SURVEY] MARKETS_TEAMS',
}