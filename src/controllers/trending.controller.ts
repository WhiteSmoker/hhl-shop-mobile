import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class TrendingController {
  constructor() {}

  getEvents() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.trending.getEvent,
      data: undefined,
    });
  }
  getMatches() {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.trending.getMatch,
      data: undefined,
    });
  }
  getListStumpByPost(payload: { id: number; page: number }) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.trending.getListStumpByPost + `/${payload.id}?pageNumber=${payload.page}`,
      data: undefined,
    });
  }
  getListStumpByMatch(payload: { id: number; page: number }) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.trending.getListStumpByMatch + `/${payload.id}?pageNumber=${payload.page}`,
      data: undefined,
    });
  }
  getListStumpDiscovery(payload: { type: string; pageNumber: number; id: number }) {
    console.log(
      'payload.listId',
      ApiRoutes.stump.getListStump + `?type=${payload.type}&pageNumber=${payload.pageNumber}`,
      payload,
    );

    return networkService.request<any>({
      method: 'GET',
      url:
        ApiRoutes.search.getListStumpBySurveyId +
        `?type=${payload.type}&id=${payload.id}&pageNumber=${payload.pageNumber.toString()}`,
      data: undefined,
    });
  }
}

export const trendingController = new TrendingController();
