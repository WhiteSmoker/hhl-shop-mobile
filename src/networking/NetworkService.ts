import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { apiURL, headers, timeout } from '@/networking/config';
import { requestInterceptor, responseInterceptor } from '@/networking/interceptors';
interface ResponseData<T> {
  status: number;
  data: T;
  message: string;
}
class NetworkService {
  public client: AxiosInstance;
  constructor() {
    this.client = axios.create({ baseURL: apiURL, headers, timeout });
    this.client.interceptors.response.use(responseInterceptor.onFulfill, responseInterceptor.onReject);
    this.client.interceptors.request.use(requestInterceptor.onFulfill, requestInterceptor.onReject);
  }

  setAccessToken(token: string) {
    this.client.defaults.headers.common.Authorization = `bearer ${token}`;
  }

  clearAccessToken() {
    delete this.client.defaults.headers.common.authorization;
  }

  request<T>({ method, url, data, ...config }: AxiosRequestConfig<any>) {
    return this.client
      .request<ResponseData<T>>({ method, url, data, ...config })
      .then(res => res.data)
      .catch(err => console.log(err));
  }
}

export const networkService = new NetworkService();
