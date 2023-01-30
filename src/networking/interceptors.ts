import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const responseInterceptor = {
  onFulfill(response: AxiosResponse<any, any>) {
    return response;
  },
  onReject(error: any) {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      return Promise.reject({ error: 'Error' });
    }
    return Promise.reject(error);
  },
};

export const requestInterceptor = {
  onFulfill(config: AxiosRequestConfig<any>) {
    if (config.method === 'get') {
      const currentTime = new Date().getTime();
      const oldUrl = config.url;
      if (oldUrl?.includes('?')) {
        config.url = `${oldUrl}&time=${currentTime}`;
      } else {
        config.url = `${oldUrl}?time=${currentTime}`;
      }
    }
    return config;
  },
  onReject(error: any) {
    return Promise.reject(error);
  },
};
