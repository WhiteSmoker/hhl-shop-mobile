import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class SearchController {
  constructor() {}

  searchByName(keySearch: string, pageNumber: number, withoutBlock = false) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.search.searchByName,
      data: { keySearch, pageNumber, withoutBlock },
    });
  }

  getDefaultSearch() {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.search.getDefaultSearch,
      data: {},
    });
  }

  searchStump(pageNumber: number, searchText: string, type: string) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.search.searchStump + `?pageNumber=${pageNumber}&searchText=${searchText}&type=${type}`,
      data: undefined,
    });
  }

  getNumberStump(pageNumber: number, type?: string | null, id?: number | null) {
    console.log(`pageNumber=${pageNumber}&type=${type}&id=${id}`);
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.search.getNumberStump + `?pageNumber=${pageNumber}&type=${type}&id=${id}`,
      data: undefined,
    });
  }
}

export const searchController = new SearchController();
