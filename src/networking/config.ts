import { Config } from 'react-native-config';

export const baseURL = Config.DEVELOPMENT_BASE_URL;
export const apiURL = baseURL + '/api/';

export const headers = {
  'Content-Type': 'application/json',
};

export const timeout = 10000;
