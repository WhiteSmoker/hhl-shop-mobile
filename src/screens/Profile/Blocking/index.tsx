import React from 'react';
import { FlatList } from 'react-native';

import { IProps } from './propState';
import { TextMessageStyled, ViewWrapStyled } from '@/screens/Home/Home.style';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { useAuth } from '@/hooks/useAuth';
import { IUserInfo, useAppDispatch } from '@/stores';
import { PROFILE_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { IRenderItem } from '@/stores/types/common.type';
import { CardUserFollow } from '@/containers/components/CardUserFollow';
import { userController } from '@/controllers';

export const Blocking = ({ navigation }: IProps) => {
  const userInfo = useAuth();
  const dispatch = useAppDispatch();
  const { isBlockMe } = useUserBlockMe();

  const memoData = React.useMemo(() => userInfo?.blocks || [], [userInfo]);
  const _gotoProfile = React.useCallback(
    (userId: number) => {
      try {
        isBlockMe(userId);
        navigation.push(PROFILE_NAVIGATION.VIEW_PROFILE, { userId, screen: PROFILE_NAVIGATION.BLOCKING });
      } catch (error) {
        console.log(error);
      }
    },
    [isBlockMe, navigation],
  );

  const _block = React.useCallback(
    async (userId: number) => {
      try {
        globalLoading(true);
        const res_block = await userController.blockUser(userId);
        if (res_block.status === 1) {
          dispatch(fetchUser(false));
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch],
  );

  const renderItem = React.useCallback(
    ({ item }: IRenderItem<IUserInfo>) => {
      return (
        <CardUserFollow
          item={item}
          clickAvatar={_gotoProfile}
          clickBlock={_block}
          myId={userInfo?.id || 0}
          listBlock={userInfo?.blocks || []}
          mode="block"
        />
      );
    },
    [_block, _gotoProfile, userInfo?.blocks, userInfo?.id],
  );

  const keyExtractor = React.useCallback((item: IUserInfo) => item.id.toString(), []);
  const ListEmptyComponent = React.useMemo(
    () => (
      <ViewWrapStyled>
        <TextMessageStyled>{`You haven't blocked anyone.`}</TextMessageStyled>
      </ViewWrapStyled>
    ),
    [],
  );

  return (
    <FlatList
      data={memoData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
Blocking.displayName = 'Profile/Blocking';
