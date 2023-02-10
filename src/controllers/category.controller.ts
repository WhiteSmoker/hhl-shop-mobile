import { ApiRoutes } from './api-routes';

import { networkService } from '@/networking';

export class CategoryController {
  constructor() {}

  getCategories() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.category.categories,
      data: undefined,
    });
  }
}

export const categoryController = new CategoryController();
