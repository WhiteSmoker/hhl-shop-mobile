import { ApiRoutes } from './api-routes';

import { networkService } from '@/networking';

export class OrderController {
  constructor() {}

  createOrder(payload: any) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.order.orders,
      data: payload,
    });
  }

  getOrderByUserId(id: string) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.order.orderByUserId + `/${id}`,
      data: undefined,
    });
  }
}

export const orderController = new OrderController();
