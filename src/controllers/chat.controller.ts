import { EnvGifphy } from '@/constants';
import { IGifData, IRoomChat, TRoomType } from '@/stores/types/chat.type';
import { parseParams } from '@/utils/format';
import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

interface IParamSendMessageApi {
  roomId: number;
  message: {
    text: string;
    user: {
      id: number;
      name?: string;
      avatar?: any;
    };
    image?: string;
    video?: string;
    audio?: string;
  };
}
export class ChatController {
  requestTokenAgora(channelName: string, uid: number) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.agora.getAccessToken + '?' + parseParams({ channelName, uid }),
      data: undefined,
    });
  }
  getAllRoomChat() {
    return networkService.request<IRoomChat[]>({
      method: 'GET',
      url: ApiRoutes.chat.getAllRoomChat,
      data: undefined,
    });
  }
  getDetailRoomChat(roomId: number, pageNumber = 1) {
    return networkService.request<IRoomChat>({
      method: 'GET',
      url: ApiRoutes.chat.getAllRoomChat + `/${roomId}/${pageNumber}`,
      data: undefined,
    });
  }
  createRoom(members: number[], type: 'CHAT' | 'GROUP_CHAT', conversationId: number | null = null) {
    return networkService.request<{ roomId: number; type: TRoomType }>({
      method: 'POST',
      url: ApiRoutes.chat.getAllRoomChat,
      data: { members, type, conversationId },
    });
  }
  editRoom(id: number, name: string) {
    return networkService.request<any>({
      method: 'PUT',
      url: ApiRoutes.chat.getAllRoomChat,
      data: { id, name },
    });
  }
  sendMessage(params: IParamSendMessageApi) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.chat.message,
      data: { ...params },
    });
  }
  getThumnailVideo(formData: FormData) {
    return networkService.request<{ video: string; thumbnail: string }>({
      method: 'POST',
      url: ApiRoutes.chat.video,
      data: formData,
    });
  }
  acceptMessageRequest(roomId: number) {
    return networkService.request<any>({
      method: 'PUT',
      url: ApiRoutes.chat.getAllRoomChat + `/${roomId}`,
      data: undefined,
    });
  }
  deleteMessageRequest(roomId: number) {
    return networkService.request<any>({
      method: 'DELETE',
      url: ApiRoutes.chat.getAllRoomChat + `/${roomId}`,
      data: undefined,
    });
  }
  archiveRoomRequest(roomId: number) {
    return networkService.request<any>({
      method: 'PUT',
      url: ApiRoutes.chat.archiveRoom + `/${roomId}`,
      data: { roomId },
    });
  }
  seeMessage(roomId: number, messageId: number) {
    return networkService.request<any>({
      method: 'PUT',
      url: ApiRoutes.chat.message,
      data: { roomId, messageId },
    });
  }
  likeMessage(messageId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.chat.reaction,
      data: { messageId },
    });
  }
  getTrendingGif() {
    return fetch(
      `${EnvGifphy.API_URL_TRENDING_GIF}?${parseParams({ api_key: EnvGifphy.API_KEY_GIPHY, limit: 20 })}`,
    ).then(res => res.json() as Promise<IGifData>);
  }
  searchGif(query: string) {
    return fetch(
      `${EnvGifphy.API_URL_SEARCH_GIF}?${parseParams({ api_key: EnvGifphy.API_KEY_GIPHY, limit: 20, q: query })}`,
    ).then(res => res.json()) as Promise<IGifData>;
  }
}

export const chatController = new ChatController();
