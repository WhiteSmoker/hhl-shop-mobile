import { userController } from '@/controllers';
import { commentController } from '@/controllers/comment.controller';
import { searchController } from '@/controllers/search.controller';
import { stumpController } from '@/controllers/stump.controller';
import { useAppSelector } from '@/stores';
import { commentSlice, searchSlice, stumpSlice } from '@/stores/reducers';
import { IComment, IUseMentionCommentState } from '@/stores/types/comment.type';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './useAuth';

export const useMentionComment = (
  stumpId: number,
  commentId?: number,
  mentionedComment?: IComment,
  navigation?: any,
) => {
  const dispatch = useDispatch();
  const userInfo = useAuth();
  const allComment = useAppSelector(rootState => rootState.commentState.allComment);
  const [state, setState] = useState<IUseMentionCommentState>({
    fetching: true,
    loadingMore: false,
    mentionUsers: [],
    searching: false,
    canViewAll: false,
  });

  const keywordRef = useRef('');
  const cacheDataRef = useRef<any>({});
  const pageRef = useRef<{
    currentPage: number;
    maxPage: number;
  }>({ currentPage: 1, maxPage: 1 });
  let timeout = useRef<number>().current;

  React.useEffect(() => {
    if (!stumpId) {
      return;
    }
    if (mentionedComment) {
      const isParent = commentId === mentionedComment?.id;
      const newData = [mentionedComment].map(e => {
        if (isParent) {
          return { ...e, expand: true, isHighlight: true };
        } else {
          return {
            ...e,
            expand: true,
            childs: e.childs?.map(child => ({ ...child, isHighlight: child.id === commentId ? true : false })),
          };
        }
      });
      dispatch(commentSlice.actions.setAllComment(newData));
      setState(prevState => ({ ...prevState, fetching: false, canViewAll: true }));
    } else {
      getAllComment();
    }
  }, [mentionedComment, commentId, stumpId, dispatch]);

  const updateNumberComment = async () => {
    const res: any = await stumpController.getDetailStump(stumpId);
    // dispatch(stumpSlice.actions.updateStumpHome(res.data[0]));
    dispatch(searchSlice.actions.updateStumpInSearch(res.data[0]));
  };

  const getAllComment = async () => {
    try {
      const res = await commentController.getAllComment(stumpId, mentionedComment?.id);
      if (res.status === 1) {
        pageRef.current = { currentPage: 1, maxPage: res.data.totalPage };
        dispatch(commentSlice.actions.setAllComment(res.data.comments));
        setState(prevState => ({ ...prevState, fetching: false }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRelatedMentionComments = async () => {
    try {
      setState(preState => ({ ...preState, loadingMore: true }));
      const res = await commentController.getAllComment(stumpId, mentionedComment?.id);
      if (res.status === 1) {
        pageRef.current = { currentPage: 1, maxPage: res.data.totalPage };
        dispatch(commentSlice.actions.setLoadMoreComment(res.data.comments));
        setState(prevState => ({ ...prevState, loadingMore: false, canViewAll: false }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreComment = React.useCallback(async () => {
    try {
      const { currentPage, maxPage } = pageRef.current;
      if (state.loadingMore) {
        return;
      }
      if (currentPage >= maxPage) {
        return;
      }
      setState(preState => ({ ...preState, loadingMore: true }));
      const res = await commentController.getAllComment(stumpId, mentionedComment?.id, currentPage + 1);
      if (res.status === 1) {
        pageRef.current = { currentPage: currentPage + 1, maxPage: res.data.totalPage };
        setState(prevState => ({ ...prevState, loadingMore: false }));
        dispatch(commentSlice.actions.setLoadMoreComment(res.data.comments));
      }
    } catch (error) {
      console.log(error);
    }
  }, [state.loadingMore, stumpId, mentionedComment?.id, dispatch]);

  const onSearch = React.useCallback(async (keyword: string, idx: number) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    keywordRef.current = keyword;
    if (cacheDataRef.current[keyword]) {
      setState(prevState => ({ ...prevState, mentionUsers: cacheDataRef.current[keyword] }));
      return;
    }
    try {
      setState(prevState => ({ ...prevState, searching: `Searching for "${keyword}"` }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(async () => {
        const res = await searchController.searchByName(keyword, 1);
        if (res.status === 1) {
          cacheDataRef.current = { ...cacheDataRef.current, [keyword]: res.data.users };
          setState(prevState => ({ ...prevState, searching: false, mentionUsers: res.data.users }));
        }
      }, 350);
    } catch (error) {
      console.log(error);
      setState(prevState => ({ ...prevState, searching: false }));
    }
  }, []);

  const onRefresh = React.useCallback(async () => {
    if (mentionedComment) {
      navigation.setParams({ stumpId, commentId: undefined, mentionedComment: undefined });
    } else {
      await getAllComment();
    }
  }, [mentionedComment, navigation, stumpId]);

  const sendReply = React.useCallback(
    async (content: string, parentId = 0, type = 'TEXT', _id = 0, onSuccess?: () => void) => {
      try {
        const res = await commentController.sendReply(content.trim(), stumpId, type, parentId || 0, _id);
        if (res.status === 1) {
          const newResData = { ...res.data, user: userInfo };
          if (res.data.type === 'TEXT') {
            dispatch(commentSlice.actions.addResReplyComment(newResData));
          }
          if (onSuccess) {
            onSuccess();
          }
          await updateNumberComment();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, stumpId, userInfo],
  );

  const unmount = React.useCallback(() => {
    setState(prevState => ({ ...prevState, fetching: true }));
  }, []);

  return {
    ...state,
    comments: allComment,
    onSearch,
    onRefresh,
    sendReply,
    loadMoreComment,
    unmount,
    viewAllFromMention: getRelatedMentionComments,
  };
};
