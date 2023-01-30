import { networkService } from '../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class ProviderController {
  constructor() {}

  getPresignedUrl(fileName: string) {
    return networkService.request<{ url: string }>({
      method: 'GET',
      url: ApiRoutes.provider.presignedUrl + `?fileName=${fileName}`,
      data: undefined,
    });
  }
  getShortLinkHelper(longDynamicLink: string): Promise<{ shortLink: string }> {
    const data = {
      dynamicLinkInfo: {
        domainUriPrefix: 'stump.page.link',
        link: longDynamicLink,
      },
      suffix: {
        option: 'SHORT',
      },
    };
    return fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBb5Nxup3BaeqtHWJQgsg5FZHmJ0AfuvTk`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    ).then(res => res.json());
  }
}

export const providerController = new ProviderController();
