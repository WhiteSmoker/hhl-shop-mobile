import { Config } from 'react-native-config';

export const baseURL = Config.DEVELOPMENT_BASE_URL;
export const socketURL = baseURL;
export const socketChatURL = baseURL + '/chat';
export const apiURL = baseURL + '/api/v1';

export const headers = {
  'Content-Type': 'application/json',
};

export const timeout = 10000;
