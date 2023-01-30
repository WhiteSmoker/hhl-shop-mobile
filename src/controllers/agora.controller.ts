import { parseParams } from '@/utils/format';
import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class AgoraController {
  requestTokenAgora(channelName: string, uid: number) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.agora.getAccessToken + '?' + parseParams({ channelName, uid }),
      data: undefined,
    });
  }
}

export const agoraController = new AgoraController();
