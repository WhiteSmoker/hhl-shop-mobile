import { Stump } from '@/stores/types';
import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class StumpController {
  getListStump(pageNumber: number, type: string | undefined) {
    return networkService.request<{ count: number; stumps: Stump[] }>({
      method: 'POST',
      url: ApiRoutes.stump.getListStump + `?type=${type || ''}&pageNumber=${pageNumber.toString()}`,
      data: {},
    });
  }

  getListStumpProfile({ url, pageNumber, userId }: { url: string; pageNumber: number; userId?: null | number }) {
    return networkService.request<{ count: number; stumps: Stump[] }>({
      method: 'POST',
      url,
      data: { pageNumber, userId },
    });
  }

  counterPlayAudio(stumpId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.counterPlayAudio,
      data: { stumpId },
    });
  }

  getDetailStump(stumpId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.getDetailStump,
      data: { stumpId },
    });
  }

  reactionStump(userId: number, stumpId: number, type: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.reactionStump,
      data: { userId, stumpId, type },
    });
  }

  shareStump(stumpId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.shareStump,
      data: { stumpId },
    });
  }

  unShareStump(stumpId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.unShareStump,
      data: { stumpId },
    });
  }

  followUser(userId: number, followId: number) {
    return networkService.request<{ count: number; stumps: Stump[] }>({
      method: 'POST',
      url: ApiRoutes.stump.followUser,
      data: { userId, followId },
    });
  }

  addStump(params: any) {
    return networkService.request<{ newStump: Stump; fileData: any }>({
      method: 'POST',
      url: ApiRoutes.stump.addStump,
      data: { ...params },
    });
  }

  removeStump(stumpId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.removeStump,
      data: { stumpId },
    });
  }
  editStump(params: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.editStump,
      data: { ...params },
    });
  }
  uploadAudio(formData: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.uploadAudio,
      data: formData,
    });
  }
  reportStump(stumpId: number, type: number, description: string) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.stump.reportStump,
      data: { stumpId, type, description },
    });
  }
  getRamdomAds() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.stump.getRamdomAds,
      data: undefined,
    });
  }
}

export const stumpController = new StumpController();
