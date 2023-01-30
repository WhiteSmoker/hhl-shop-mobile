import { networkService } from './../networking/NetworkService';
import { ApiRoutes } from './api-routes';

export class CommentController {
  constructor() {}

  getAllComment(stumpId: number, commentId?: number, page = 1) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.comment.getComment + `?stumpId=${stumpId}&page=${page}&commentId=${commentId}`,
      data: undefined,
    });
  }
  getMentionedComment(commentId: number) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.comment.mention + `/${commentId}`,
      data: undefined,
    });
  }
  getUserLikedComment(commentId: number) {
    return networkService.request<any>({
      method: 'GET',
      url: ApiRoutes.comment.getComment + `/${commentId}`,
      data: undefined,
    });
  }
  sendReply(content: string, stumpId: number, type: string | 'TEXT' | 'MEDIA', parentId = 0, _id = 0) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.comment.sendReply,
      data: { content, stumpId, parentId, type, _id },
    });
  }
  likeReply(commentId: number) {
    return networkService.request<any>({
      method: 'POST',
      url: ApiRoutes.comment.likeReply,
      data: { commentId },
    });
  }
}

export const commentController = new CommentController();
