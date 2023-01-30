import { Participant, UrlSchedule } from '@/stores';
import { Conversation } from '@/stores/types/record.type';
import { networkService } from '../networking/NetworkService';
import { ApiRoutes } from './api-routes';
interface ParamAddConversation {
  hostId?: number;
  mode: number;
  scheduleMode: number;
  scheduledStart: Date | string;
  message: string;
  status: number;
  participant: any;
}

export class ConversationController {
  constructor() {}

  getDetailConversation(conversationId: number) {
    return networkService.request<Conversation[]>({
      method: 'POST',
      url: ApiRoutes.conversation.getDetailConversation,
      data: { conversationId },
    });
  }
  getConversationNumber() {
    return networkService.request<{ scheduledCount: number; draftCount: number; acceptedCount: number }>({
      method: 'GET',
      url: ApiRoutes.conversation.getConversationNumber,
      data: undefined,
    });
  }

  addConversation(params: ParamAddConversation) {
    return networkService.request<Conversation>({
      method: 'POST',
      url: ApiRoutes.conversation.addConversation,
      data: { ...params },
    });
  }

  removeConversation = async (conversationId: number) => {
    return networkService.request<[{ count: number }, Conversation[]]>({
      method: 'POST',
      url: ApiRoutes.conversation.removeConversation,
      data: { conversationId },
    });
  };

  getListDraft = async (pageNumber: number) => {
    return networkService.request<[{ count: number }, Conversation[]]>({
      method: 'POST',
      url: ApiRoutes.conversation.getConversationFinished,
      data: { pageNumber },
    });
  };

  getListSchedule = async (url: UrlSchedule, pageNumber: number) => {
    return networkService.request<[{ count: number }, Conversation[]]>({
      method: 'POST',
      url,
      data: { pageNumber },
    });
  };

  declineAcceptedConversation = async (hostId: number, conversationId: number) => {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.conversation.declineAcceptedConversation,
      data: { hostId, conversationId },
    });
  };

  updateDraft = async (conversationId: number, draft: string) => {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.conversation.updateDraft,
      data: { conversationId, draft },
    });
  };

  editConversation = async (params: {
    id: number;
    scheduledStart: Date | string;
    message: string;
    scheduleMode: number;
  }) => {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.conversation.editConversation,
      data: { ...params },
    });
  };

  findInviteCode = async (inviteCode: string, inviteValue?: string) => {
    return networkService.request<Participant>({
      method: 'POST',
      url: ApiRoutes.conversation.findInviteCode,
      data: { inviteCode, inviteValue },
    });
  };
}

export const conversationController = new ConversationController();
