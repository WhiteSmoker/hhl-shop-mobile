export enum RESPONSE_STATUS {
  SUCCESS = 200,
  NOT_FOUND = 404,
  INTERVAL_SERVER = 500,
  FORBIDDEN = 403,
}
export enum METHOD {
  POST = 'POST',
  DELETE = 'DELETE',
  GET = 'GET',
  PUT = 'PUT',
}
export enum RECORD_MODE {
  SOLO = 1,
  FRIENDS = 2,
}

export enum SCHEDULE_MODE {
  NOW = 1,
  SCHEDULE = 2,
}

export const DURATION = 1000 * 60;
