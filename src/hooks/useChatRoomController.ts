import { globalLoading } from '@/containers/actions/emitter.action';
import { userController } from '@/controllers';
import { chatController } from '@/controllers/chat.controller';
import { HEIGHT_INPUT } from '@/screens/Chat/InRoomChat';
import { useAppDispatch } from '@/stores';
import { chatSlice } from '@/stores/reducers';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { fetchDetailRoom, loadMessages } from '@/stores/thunks/chat.thunk';
import { TRoomType } from '@/stores/types/chat.type';
import React from 'react';

export const useChatRoomController = (roomId: number, navigation: any, type: TRoomType, partnerId: number) => {
  const dispatch = useAppDispatch();
  const pageRef = React.useRef({
    currentPage: 1,
    maxPage: 1,
  });

  const isLoadMoreRef = React.useRef(false);

  const [state, setState] = React.useState({
    isLoadMore: false,
    inputHeightChange: HEIGHT_INPUT,
  });

  React.useEffect(() => {
    if (roomId) {
      dispatch(
        fetchDetailRoom({
          roomId,
          type,
          onSuccess: (total: number) => {
            pageRef.current = { currentPage: 1, maxPage: Math.ceil(total / 20) || 1 };
          },
        }),
      );
    }
    return () => {
      dispatch(chatSlice.actions.chatSliceClear());
    };
  }, [dispatch, roomId, type]);

  const loadMoreMessage = React.useCallback(() => {
    if (state.isLoadMore) {
      return;
    }
    if (isLoadMoreRef.current) {
      return;
    }
    if (pageRef.current.currentPage >= pageRef.current.maxPage) {
      return;
    }
    isLoadMoreRef.current = true;
    setState(prev => ({ ...prev, isLoadMore: true }));
    dispatch(
      loadMessages({
        roomId,
        pageNumber: pageRef.current.currentPage + 1,
        onSuccess: () => {
          pageRef.current = { ...pageRef.current, currentPage: pageRef.current.currentPage + 1 };
          isLoadMoreRef.current = false;
          setState(prev => ({ ...prev, isLoadMore: false }));
        },
      }),
    );
  }, [dispatch, roomId, state.isLoadMore]);

  const acceptMessage = React.useCallback(async () => {
    try {
      globalLoading(true);
      await chatController.acceptMessageRequest(roomId);
      navigation.setParams({ roomId, screen: '', type: 'CHAT' });
      dispatch(chatSlice.actions.updateTypeRoom(roomId));
    } catch (error) {
      //
      console.log(error);

    } finally {
      globalLoading();
    }
  }, [dispatch, navigation, roomId]);

  const deleteMessage = React.useCallback(async () => {
    try {
      globalLoading(true);
      await chatController.archiveRoomRequest(roomId);
      dispatch(chatSlice.actions.deleteRoom(roomId));
      navigation.goBack();
    } catch (error) {
      //
    } finally {
      globalLoading();
    }
  }, [dispatch, navigation, roomId]);

  const blockUser = React.useCallback(async () => {
    try {
      globalLoading(true);
      await userController.blockUser(partnerId);
      dispatch(fetchUser(true));
    } catch (error) {
      //
    } finally {
      globalLoading();
    }
  }, [dispatch, partnerId]);

  const unblockUser = React.useCallback(async () => {
    try {
      globalLoading(true);
      await userController.blockUser(partnerId);
      dispatch(fetchUser(false));
    } catch (error) {
      //
    } finally {
      globalLoading();
    }
  }, [dispatch, partnerId]);

  const onInputSizeChanged = React.useCallback(({ width, height }: any) => {
    if (height > 2 * HEIGHT_INPUT) {
      return;
    }
    if (height > HEIGHT_INPUT) {
      setState(prev => ({ ...prev, inputHeightChange: height }));
    } else {
      setState(prev => ({ ...prev, inputHeightChange: HEIGHT_INPUT }));
    }
  }, []);

  return { ...state, loadMoreMessage, acceptMessage, deleteMessage, blockUser, unblockUser, onInputSizeChanged };
};
