import { IUserInfo } from '@/stores';
import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class AuthController {
  constructor() {}

  login({ email, password, signupCode }: { email: string; password: string; signupCode: string | null }) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.login,
      data: { email, password, signupCode },
    });
  }
  forgotPassword(email: string) {
    console.log(email);
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.forgotPassword,
      data: { email },
    });
  }
  changePassword(email: string, password: string, code?: string | null) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.changePassword,
      data: { email, password, code },
    });
  }
  loginApple(auth: IUserInfo) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.loginApple,
      data: { ...auth },
    });
  }
  loginTwitter(auth: any) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.loginTwitter,
      data: { ...auth },
    });
  }
  twitterRequestToken() {
    return networkService.request<{ oauth_token: string; oauth_token_secret: string }>({
      method: 'GET',
      url: ApiRoutes.authentication.twitterRequestToken,
      data: undefined,
    });
  }
  twitterVerifyCredentials(oauth_token: string, oauth_verifier: string) {
    return networkService.request<{
      userID: string;
      email: string;
    }>({
      method: 'POST',
      url: ApiRoutes.authentication.twitterVerifyCredentials,
      data: { oauth_token, oauth_verifier },
    });
  }
  loginLinkedin(authenticationCode?: string, signupCode?: string) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.loginLinkedin,
      data: { authenticationCode, signupCode },
    });
  }
  loginFacebook(accesstoken: string, userId: string, signupCode?: string) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.loginFacebook,
      data: { accesstoken, userId, signupCode },
    });
  }
  register(state: any) {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.authentication.register,
      data: { ...state },
    });
  }
  addDevice({ deviceType, deviceToken, uuid, firstLogin, timezone }: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.addDevice,
      data: { deviceType, deviceToken, uuid, firstLogin, timezone },
    });
  }
  removeDevice({ deviceToken, uuid }: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.authentication.removeDevice,
      data: { deviceToken, uuid },
    });
  }
}

export const authController = new AuthController();
