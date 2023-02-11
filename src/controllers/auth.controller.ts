import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class AuthController {
  constructor() {}

  login({ username, password }: { username: string; password: string }) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.login,
      data: { username, password },
    });
  }
  register(state: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.register,
      data: { ...state },
    });
  }
  forgotPassword(email: string) {
    console.log(email);
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.forgotPassword,
      data: { email },
    });
  }
  changePassword(email: string, password: string, code?: string | null) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.changePassword,
      data: { email, password, code },
    });
  }
}

export const authController = new AuthController();
