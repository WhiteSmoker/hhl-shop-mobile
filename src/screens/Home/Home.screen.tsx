import { DURATION, NUMBER_BREAK_PAGE } from '@/constants';
import { APP_NAVIGATION, HOME_NAVIGATION, ROOT_ROUTES, SURVEY_FAV_NAVIGATION } from '@/constants/navigation';
import { globalLoading } from '@/containers/actions/emitter.action';
import CardComponent from '@/containers/components/CardComponent';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import TrendingComponent from '@/containers/components/TrendingComponent';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { trendingController } from '@/controllers';
import { commonSlice } from '@/stores/reducers';
import { Stump } from '@/stores/types';
import { IMatch, IPost } from '@/stores/types/discovery.type';
import { commonStyles } from '@/styles/common';
import { ContainerStyled } from '@/styles/styled-component';
import { cloneDeep, unionBy } from 'lodash';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import React, { FlatList, LayoutChangeEvent, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { stumpController } from '@/controllers/stump.controller';
import { IHomeProps, IHomeState } from './Home.prop';
import { styles, TextMessageStyled, ViewWrapStyled } from './Home.style';
import { changeStatusLikeStump } from '@/containers/actions/like_stump.action';
import { useGetMyId } from '@/hooks/useGetMyId';
import { useAppSelector } from '@/stores';
import { validFindIndex } from '@/utils/helper';
import { useAuth } from '@/hooks/useAuth';

export const Home = (props: IHomeProps) => {
  const dispatch = useDispatch();
  const myId = useGetMyId();
  const userInfo = useAuth();
  const likedStumpPayload = useAppSelector(rootState => rootState.stumpState.likedStump);
  const editedStumpPayload = useAppSelector(rootState => rootState.stumpState.editStump);
  const deletedStumpPayload = useAppSelector(rootState => rootState.stumpState.deleteStump);
  const [state, setState] = useState<IHomeState>({
    data: [],
    currentPage: 1,
    maxPage: 1,
    loadingMore: false,
    refreshing: false,
    typeSort: undefined,
    listEvent: [],
    listMatch: [],
  });

  useEffect(() => {
    console.log(userInfo);
    if (!userInfo.isUpdatedSurvey) {
      props.navigation.navigate(ROOT_ROUTES.SIGN_UP_SURVEY, {
        screen: SURVEY_FAV_NAVIGATION.SPORTS_LEAGUES,
        initial: false,
      });
    }
  }, [userInfo]);

  const getPageOne = useCallback(async (type: string | undefined) => {
    globalLoading(true);
    try {
      const res = await stumpController.getListStump(1, type);
      console.log('res', res);
      if (res.status === 1) {
        setState(preState => ({
          ...preState,
          data: res.data.stumps,
          currentPage: 1,
          maxPage: Math.ceil(res.data.count / NUMBER_BREAK_PAGE) || 1,
          refreshing: false,
        }));
        globalLoading(false);
      }
    } catch (error: any) {
      globalLoading(false);
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListStump = async (pageNumber: number, type: string | undefined) => {
    try {
      console.log('pageNumber', pageNumber, type);
      const res_list_stump: any = await stumpController.getListStump(pageNumber, type || undefined);
      if (res_list_stump.status === 1) {
        setState(preState => ({
          ...preState,
          data: [...preState.data, ...res_list_stump.data.stumps],
          maxPage: Math.ceil(res_list_stump.data.count / NUMBER_BREAK_PAGE) || 1,
          loadingMore: false,
          refreshing: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getEvents = useCallback(async () => {
    globalLoading(true);
    try {
      const res: any = await trendingController.getEvents();
      if (res.status === 1) {
        setState(preState => ({
          ...preState,
          listEvent: res.data,
        }));
      }
      globalLoading();
    } catch (error: any) {
      globalLoading();
      console.log(error);
    }
  }, []);

  const getMatches = useCallback(async () => {
    try {
      const res: any = await trendingController.getMatches();
      if (res.status === 1) {
        setState(preState => ({
          ...preState,
          listMatch: res.data,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getMatches();
    }, DURATION);
    return () => clearInterval(interval);
  }, [getMatches]);

  const onRefresh = useCallback(async () => {
    setState(preState => ({ ...preState, refreshing: true }));
    await getListStump(1, state.typeSort);
    await getEvents();
    await getMatches();
  }, [state.typeSort]);

  const loadMore = useCallback(async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  }, [state.loadingMore, state.currentPage, state.maxPage]);

  const renderStumpList = useMemo(
    () =>
      ({ item, index }: any) =>
        (
          <View style={commonStyles.flex_1}>
            <CardComponent data={item} navigation={props.navigation} screen={APP_NAVIGATION.HOME} indexCard={index} />
          </View>
        ),
    [props.navigation],
  );

  const renderFooter = useMemo(() => <FooterLoadMore loadingMore={state.loadingMore} />, [state.loadingMore]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />,
    [onRefresh, state.refreshing],
  );

  const memoizedData = useMemo(() => unionBy(state.data, 'id'), [state.data]);

  const keyExtractor = useMemo(() => (item: Stump) => item?.id?.toString(), []);

  const ListEmptyComponent = useMemo(
    () => (
      <ViewWrapStyled>
        <TextMessageStyled>You do not have any stumps.</TextMessageStyled>
      </ViewWrapStyled>
    ),
    [],
  );

  const memoizedContentContainerStyle = useMemo(() => (true ? commonStyles.p_b_0 : commonStyles.paddingLastItem), []);

  const sortBy = (typeSort: string) => () => {
    setState(preState => ({ ...preState, typeSort: typeSort }));
  };

  const handleEditHome = () => {
    props.navigation.navigate(ROOT_ROUTES.PROFILE_PREFERENCE);
  };

  const handlePostDetail = (post: IPost) => {
    props.navigation.push(HOME_NAVIGATION.DISCOVERY, { post: post, screen: APP_NAVIGATION.HOME });
  };

  const handleMatchDetail = (match: IMatch) => {
    props.navigation.push(HOME_NAVIGATION.DISCOVERY, { match: match, screen: APP_NAVIGATION.HOME });
  };

  const _getHeight = useCallback(
    (e: LayoutChangeEvent) => {
      e.persist();
      dispatch(commonSlice.actions.setHeightCommon(e?.nativeEvent?.layout?.height));
    },
    [dispatch],
  );

  useEffect(() => {
    getPageOne(state.typeSort);
    getEvents();
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.typeSort]);

  useEffect(() => {
    if (state.currentPage === 1 && state.typeSort === undefined) {
      return;
    }
    getListStump(state.currentPage, state.typeSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.typeSort]);

  useEmitter(
    EDeviceEmitter.FETCH_DATA_HOME,
    () => {
      getPageOne(state.typeSort);
    },
    [state.typeSort],
  );

  useEmitter(
    EDeviceEmitter.UPDATE_NUMBER_UNSHARE_HOME,
    (payload: { id: number; userId: number }) => {
      setState(preState => ({
        ...preState,
        data: preState.data.map(st => {
          if (st.id === payload.id) {
            const index = st.userShared?.findIndex(e => e === payload.userId) || -1;
            if (validFindIndex(index)) {
              st.userShared?.splice(index, 1);
            }
            return { ...st, userShared: [...(st.userShared ?? [])] };
          }
          return st;
        }),
      }));
    },
    [],
  );

  useEmitter(
    EDeviceEmitter.UPDATE_NUMBER_SHARE_HOME,
    (payload: { id: number; userId: number }) => {
      setState(preState => ({
        ...preState,
        data: preState.data.map(st => {
          if (st.id === payload.id) {
            return { ...st, userShared: [...(st.userShared ?? []), payload.userId] };
          }
          return st;
        }),
      }));
    },
    [],
  );

  useEffect(() => {
    if (!deletedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      data: preState.data.filter(st => st.id !== deletedStumpPayload),
    }));
  }, [deletedStumpPayload]);

  useEffect(() => {
    if (!editedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      data: preState.data.map(st => {
        if (st.id === editedStumpPayload.id) {
          return { ...st, ...editedStumpPayload };
        }
        return st;
      }),
    }));
  }, [editedStumpPayload]);

  useEffect(() => {
    if (!likedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      data: changeStatusLikeStump(cloneDeep(preState.data), likedStumpPayload?.id, myId) as Stump[],
    }));
  }, [likedStumpPayload]);

  return (
    <ContainerStyled onLayout={_getHeight}>
      <Fragment>
        <FlatList
          style={commonStyles.containerFlatlist}
          contentContainerStyle={memoizedContentContainerStyle}
          data={memoizedData}
          renderItem={renderStumpList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <>
              <TrendingComponent
                onPressPreference={handleEditHome}
                onPressPost={post => handlePostDetail(post)}
                onPressMathches={match => handleMatchDetail(match)}
                listEvent={state.listEvent}
                listMatch={state.listMatch}
              />
              <View style={styles.containerFeedStyled}>
                <View style={styles.listBtnSort}>
                  <TouchableOpacity
                    style={[styles.btnSort, state.typeSort === 'league' ? styles.btnSortActive : null]}
                    onPress={sortBy('league')}>
                    <Text style={[styles.titleButton, state.typeSort === 'league' ? styles.titleButtonActive : null]}>
                      League
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSort, state.typeSort === 'sport' ? styles.btnSortActive : null]}
                    onPress={sortBy('sport')}>
                    <Text style={[styles.titleButton, state.typeSort === 'sport' ? styles.titleButtonActive : null]}>
                      Sport
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSort, state.typeSort === 'team' ? styles.btnSortActive : null]}
                    onPress={sortBy('team')}>
                    <Text style={[styles.titleButton, state.typeSort === 'team' ? styles.titleButtonActive : null]}>
                      Team
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSort, state.typeSort === 'market' ? styles.btnSortActive : null]}
                    onPress={sortBy('market')}>
                    <Text style={[styles.titleButton, state.typeSort === 'market' ? styles.titleButtonActive : null]}>
                      City
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSort, state.typeSort === 'game' ? styles.btnSortActive : null]}
                    onPress={sortBy('game')}>
                    <Text style={[styles.titleButton, state.typeSort === 'game' ? styles.titleButtonActive : null]}>
                      Game
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          ListFooterComponent={renderFooter}
          refreshControl={refreshControl}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </Fragment>
    </ContainerStyled>
  );
};
