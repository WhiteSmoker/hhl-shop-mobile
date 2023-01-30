import { networkService } from '@/networking/NetworkService';
import { Notification } from '@/stores/types/notification.type';
import { ApiRoutes } from './api-routes';

export class NotificationController {
  getAllNotification(pageNumber: number) {
    return networkService.request<{ listNoti: { count: number; rows: Notification[] }; notiHide: Notification[] }>({
      method: 'POST',
      url: ApiRoutes.notification.listNotification,
      data: { pageNumber },
    });
  }

  hideNotification(notiId: number, hostId: number, conversationId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.notification.hideNotification,
      data: { notiId, hostId, conversationId },
    });
  }

  joinNowFromNotification(notiId: number, conversationId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.notification.joinNowFromNotification,
      data: { notiId, conversationId },
    });
  }

  seeNotification(notiId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.notification.seeNotification,
      data: { notiId },
    });
  }
}

export const notificationController = new NotificationController();
