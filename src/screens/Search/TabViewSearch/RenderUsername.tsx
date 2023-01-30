import { APP_NAVIGATION, PROFILE_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { CardUserFollow } from '@/containers/components/CardUserFollow';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { stumpController, userController } from '@/controllers';
import { useAuth } from '@/hooks/useAuth';
import usePreventPlayAudio from '@/hooks/usePreventPlayAudio';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { IUserInfo, TAppDispatch, useAppSelector } from '@/stores';
import { searchSlice, userSlice } from '@/stores/reducers';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { commonStyles } from '@/styles/common';
import { cloneDeep } from 'lodash';
import unionBy from 'lodash/unionBy';
import React, { Fragment, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationSearch } from '../Search.type';
import { TextMessageStyled, ViewWrapStyled } from './styles';
type Props = {
  navigation: NavigationSearch;
  text: string;
  data: IUserInfo[];
  maxPage: number;
  field: string;
  myId: number;
  listFollowing: IUserInfo[];
};
type IState = {
  currentPage: number;
  maxPage: number;
  loadingMore: boolean;
};

const RenderUsername = (props: Props) => {
  const dispatch = useDispatch<TAppDispatch>();
  const userInfo = useAuth();
  const { isBlockMe } = useUserBlockMe();
  const stumpActive = useAppSelector(rootState => rootState.commonState.stumpActive);
  const { isPrevent } = usePreventPlayAudio();
  const [state, setState] = useState<IState>({
    currentPage: 1,
    maxPage: 1,
    loadingMore: false,
  });

  useEffect(() => {
    setState(preState => ({
      ...preState,
      maxPage: props.maxPage,
    }));
  }, [props.maxPage]);

  const _gotoProfile = React.useCallback(
    (userId: number | undefined) => {
      if (!userId) {
        return;
      }
      isBlockMe(userId);
      if (userId === props.myId) {
        props.navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
          initial: false,
        });
        return;
      }
      props.navigation.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.VIEW_PROFILE,
        initial: false,
        params: { userId, screen: APP_NAVIGATION.SEARCH },
      });
    },
    [isBlockMe, props.myId, props.navigation],
  );

  const _follow = React.useCallback(
    async (followId: number, follow: boolean) => {
      try {
        globalLoading(true);
        const res_follow = await stumpController.followUser(props.myId, followId);
        if (res_follow.status === 1) {
          userSlice.actions.setIdFollow({ id: followId, follow: !follow });
          dispatch(fetchUser(true));
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch, props.myId],
  );

  const RenderItem = React.useMemo(
    () =>
      ({ item }: { item: IUserInfo }) =>
        (
          <CardUserFollow
            item={item}
            clickAvatar={_gotoProfile}
            clickFollow={_follow}
            myId={props.myId}
            listFollowing={props.listFollowing}
          />
        ),
    [_gotoProfile, _follow, props.listFollowing, props.myId],
  );

  const RenderFooter = React.useMemo(() => <FooterLoadMore loadingMore={state.loadingMore} />, [state.loadingMore]);

  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    _searchMoreUser(state.currentPage);
  }, [state.currentPage]);

  const _searchMoreUser = async (pageNumber: number) => {
    try {
      const res_search = await userController.searchByName(props.text, pageNumber, true);
      if (res_search.status === 1) {
        //random list by date
        let data;
        if (props.data.length) {
          data = [...cloneDeep(props.data), ...res_search.data.users];
        } else {
          data = [...res_search.data.users];
        }
        data = data.map(user => {
          const index = userInfo?.listFollowing?.rows?.findIndex(row => row.id === user?.id);
          if (index !== -1) {
            return { ...user, isFollow: true };
          }
          return { ...user, isFollow: false };
        });
        searchSlice.actions.setListStumpSearch({ [props.field]: unionBy(data, 'id') });
        setState(preState => ({
          ...preState,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  };

  const keyExtractor = React.useMemo(() => (item: IUserInfo) => item.id.toString(), []);

  const ListEmptyComponent = React.useMemo(
    () => (
      <ViewWrapStyled>
        <TextMessageStyled>No results found.</TextMessageStyled>
      </ViewWrapStyled>
    ),
    [],
  );

  return (
    <Fragment>
      <FlatList
        style={commonStyles.containerFlatlist}
        contentContainerStyle={!stumpActive && !isPrevent ? commonStyles.p_b_0 : commonStyles.paddingLastItem}
        data={unionBy(props.data, 'id')}
        extraData={unionBy(props.data, 'id')}
        renderItem={RenderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={RenderFooter}
        ListEmptyComponent={ListEmptyComponent}
      />
    </Fragment>
  );
};

export default React.memo(RenderUsername);
