import { IUserInfo } from '@/stores';
import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class UserController {
  findUser(email: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.findUser,
      data: { email },
    });
  }
  validateName(name: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.validateName,
      data: { name },
    });
  }
  searchByName(keySearch: string, pageNumber: number, withoutBlock = false) {
    return networkService.request<{ count: number; users: IUserInfo[] }>({
      method: 'POST',
      url: ApiRoutes.user.searchAllUser,
      data: { keySearch, pageNumber, withoutBlock },
    });
  }
  checkBlockStatus(email: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.checkBlockStatus,
      data: { email },
    });
  }
  allNewNotis() {
    return networkService.request<number>({
      method: 'GET',
      url: ApiRoutes.user.allNewNotis,
      data: undefined,
    });
  }
  getAllFriends() {
    return networkService.request<IUserInfo[]>({
      method: 'GET',
      url: ApiRoutes.user.getAllFriends,
      data: undefined,
    });
  }
  getSports() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.user.getSports,
      data: undefined,
    });
  }
  getMarkets() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.user.getMarkets,
      data: undefined,
    });
  }
  getLeagues() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.user.getLeagues,
      data: undefined,
    });
  }
  getTeams(id: number) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.user.getTeams + `/${id}`,
      data: undefined,
    });
  }
  fetchUser(userId?: number, loginMethod = '1') {
    return networkService.request<IUserInfo>({
      method: 'POST',
      url: ApiRoutes.user.fetchUser,
      data: { userId, loginMethod },
    });
  }
  updateUserSurvey(payload: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.updateUserSurvey,
      data: payload,
    });
  }
  findByDisplayName(displayName: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.findByDisplayName,
      data: { displayName },
    });
  }
  userSurveyInfo() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.user.userSurveyInfo,
      data: undefined,
    });
  }

  blockUser(blockId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.blockUser,
      data: { blockId },
    });
  }

  verifyOtp(verifyCode: string, phone: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.verifyOtp,
      data: { verifyCode, phone },
    });
  }
  checkValidatePhoneNumber(phone: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.validatePhone,
      data: { phone },
    });
  }
  sendOtp(phone: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.sendOtp,
      data: { phone },
    });
  }
  updatePhoneNumber(phone: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.updatePhone,
      data: { phone },
    });
  }
  editProfile(params: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.editProfile,
      data: { ...params },
    });
  }
  clearBadge() {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.user.clearBadge,
      data: {},
    });
  }
}

export const userController = new UserController();
