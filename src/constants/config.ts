import { Config } from 'react-native-config';

export const EnvLinkedIn = {
  LI_CLIENT_ID: Config.LI_CLIENT_ID || '',
  LI_REDIRECT_URI: Config.LI_REDIRECT_URI || '',
  LI_CLIENT_SECRET: Config.LI_CLIENT_SECRET || '',
};

export const EnvFacebook = {
  FB_APP_ID: Config.FB_APP_ID,
  FB_APP_SERCET: Config.FB_APP_SERCET,
};

export const EnvTwitter = {
  TWITTER_KEY: Config.TWITTER_KEY,
  TWITTER_SECRET: Config.TWITTER_SECRET,
};

export const AGORA_APP_ID = Config.AGORA_APP_ID;

export const EnvGifphy = {
  API_KEY_GIPHY: Config.API_KEY_GIPHY,
  API_URL_TRENDING_GIF: Config.API_URL_TRENDING_GIF,
  API_URL_SEARCH_GIF: Config.API_URL_SEARCH_GIF,
};
