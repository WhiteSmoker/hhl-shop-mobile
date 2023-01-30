export const STATUS = {
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  NOT_STARTED: 'NOT_STARTED',
  SUCCESS: 'SUCCESS',
};

export const CONVERSATION_STATUS = {
  SCHEDULED: 1,
  RECORDING: 2,
  FINISHED: 3,
  PUBLISHED: 4,
  PAUSED: 5,
  UPLOADING: 6,
  ARCHIVED: 7,
  RESCHEDULED: 8,
  RESUMING: 100,
  STARTING: 99,
};

export const FILE_TYPE = {
  MERGE: 1,
  PARTIAL: 2,
};

export const STATUS_NOTIFICATION = {
  NOT_SEEN: 1,
  SEEN: 2,
  JOIN_NOW: 3,
};

export const PARTICIPANT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const TYPE_NOTIFICATION = {
  FOLLOW: 1,
  LIKE: 2,
  CREATE_CONVERSATION: 3,
  ADD_STUMP: 4,
  SYSTEM: 5,
  HIDE_NOTI: 6,
  CONTACT: 7,
  DISABLE_CREATE_CONVERSATION: 8,
  REMIND_CONVERSATION: 9,
  RESCHEDULE: 10,
  REPORT_NOTI: 11,
  MENTION: 12,
  CHAT: 13,
  SEND_MESSAGE: 13,
};

export const PHONE_STATUS = {
  UNREGISTERED: 1,
  NEW: 2,
  CLAIMED: 3,
};

export const REPORT_STATUS = {
  IGNORE_OR_ENABLE: 1,
  DISABLE: 2,
  SPAM: 3,
  INAPPROPRIATE: 4,
  TROUBLE: 5,
  DIFFERENT: 6,
};