import { ApiRoutes } from './api-routes';

import { networkService } from '@/networking';
import { parseParams } from '@/utils/format';

export class ProductController {
  constructor() {}

  getProducts(keyword?: string, categoryId?: string) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.product.products + `?keyword=${keyword || ''}&categoryId=${categoryId || ''}`,
      data: undefined,
    });
  }

  getProduct(id: string) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.product.products + `/${id}`,
      data: undefined,
    });
  }
}

export const productController = new ProductController();
