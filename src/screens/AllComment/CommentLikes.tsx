import { APP_NAVIGATION, COMMENT_NAVIGATION, PROFILE_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { CardUserFollow } from '@/containers/components/CardUserFollow';
import { commentController } from '@/controllers/comment.controller';
import { stumpController } from '@/controllers/stump.controller';
import { useAuth } from '@/hooks/useAuth';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { IUserInfo, TAppDispatch } from '@/stores';
import { commonSlice, userSlice } from '@/stores/reducers';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { ICommentLikesProps } from '@/stores/types/comment.type';
import { Colors } from '@/theme/colors';
import React from 'react';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';

export const CommentLikes = React.memo(({ navigation, route }: ICommentLikesProps) => {
  const dispatch = useDispatch<TAppDispatch>();
  const userInfo = useAuth();
  const { isBlockMe } = useUserBlockMe();
  const commentId = React.useMemo(() => route?.params?.commentId, [route?.params?.commentId]);
  const stumpId = React.useMemo(() => route?.params?.stumpId, [route?.params?.stumpId]);
  const type = React.useMemo(() => route?.params?.type || '', [route?.params?.type]);
  const [state, setState] = React.useState<{ data: IUserInfo[] }>({
    data: [],
  });

  React.useEffect(() => {
    if (commentId) {
      getUserLikes();
    }
  }, [commentId]);

  React.useEffect(() => {
    if (stumpId) {
      const getDetailStump = async () => {
        const res: any = await stumpController.getDetailStump(stumpId);
        let data: IUserInfo[] = [];
        if (type === 'reactions') {
          data = (res.data[0].reactions?.rows || []).filter((e: any) => e?.type).map((r: any) => r.user!);
        }
        if (type === 'sharings') {
          data = res.data[0].sharings || [];
        }
        setState(prevState => ({ ...prevState, data }));
      };
      getDetailStump();
    }
  }, [stumpId]);

  const getUserLikes = async () => {
    try {
      const res = await commentController.getUserLikedComment(commentId);
      if (res.status === 1) {
        setState(prevState => ({ ...prevState, data: res.data.likedBy }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _gotoProfile = React.useCallback(
    (userId: number | undefined) => {
      try {
        if (!userId) {
          return;
        }
        isBlockMe(userId);
        if (userId === userInfo?.id) {
          navigation.navigate(APP_NAVIGATION.PROFILE, {
            screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
            initial: false,
          });
          return;
        }
        navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: false,
          params: { userId, screen: COMMENT_NAVIGATION.COMMENT_LIKES },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [isBlockMe, userInfo?.id, navigation],
  );

  const _follow = React.useCallback(
    async (followId: number, follow: boolean) => {
      try {
        globalLoading(true);
        const res_follow = await stumpController.followUser(userInfo.id!, followId);
        if (res_follow.status === 1) {
          dispatch(userSlice.actions.setIdFollow({ id: followId, follow: !follow }));
          dispatch(fetchUser(true));
        }
        globalLoading();
      } catch (error: any) {
        globalLoading();
        console.log(error);
      }
    },
    [dispatch, userInfo.id],
  );

  const memoizedData = React.useMemo(() => state.data, [state.data]);

  const RenderItem = React.useMemo(
    () =>
      ({ item }: { item: IUserInfo }) =>
        (
          <CardUserFollow
            item={item}
            clickAvatar={_gotoProfile}
            clickFollow={_follow}
            myId={userInfo?.id || 0}
            listFollowing={userInfo?.listFollowing?.rows || []}
          />
        ),
    [_gotoProfile, _follow, userInfo],
  );
  const styleFlatlist = React.useMemo(
    () => ({
      backgroundColor: Colors.White,
    }),
    [],
  );

  const memoizedContentContainerStyle = usePaddingBottomFlatlist();

  const keyExtractor = React.useMemo(() => (item: IUserInfo) => item.id.toString(), []);

  return (
    <FlatList
      data={memoizedData}
      extraData={memoizedData}
      style={styleFlatlist}
      contentContainerStyle={memoizedContentContainerStyle}
      renderItem={RenderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
});
CommentLikes.displayName = 'CommentLikes';
