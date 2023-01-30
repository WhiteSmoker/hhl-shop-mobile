import { APP_NAVIGATION, RECORD_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { changeStatusLikeStump } from '@/containers/actions/like_stump.action';
import CardComponent from '@/containers/components/CardComponent';
import CompactCardComponent from '@/containers/components/CompactCardComponent';
import { useGetMyId } from '@/hooks/useGetMyId';
import { useIsRecording } from '@/hooks/useIsRecording';
import { TAppDispatch, TRootState, useAppSelector } from '@/stores';
import { fetchListByDiscovery, fetchListByMatch, fetchListByPost } from '@/stores/thunks/discovery.thunk';
import { IStumpData } from '@/stores/types/discovery.type';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { cloneDeep } from 'lodash';
import React from 'react';
import { Animated, Linking, RefreshControl, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, width } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { IDiscoveryProps, IDiscoveryState } from './index.prop';
import styles, { TextDiscovery } from './index.style';

const Discovery: React.FC<IDiscoveryProps> = props => {
  const dispatch = useDispatch<TAppDispatch>();
  const myId = useGetMyId();
  const isRecording = useIsRecording();
  const postDetail = props.route.params.post;
  const matchDetail = props.route.params.match;
  const discoveryDetail = props.route.params.discoveryDetail;
  console.log(discoveryDetail);

  const [initState, setInitState] = React.useState<IDiscoveryState>({
    data: [],
    currentPage: 1,
    maxPage: 1,
    loadingMore: false,
    refreshing: false,
  });

  const likedStumpPayload = useAppSelector(rootState => rootState.stumpState.likedStump);
  const { stumpPost, stumpMatch, stumpDiscovery } = useSelector((state: TRootState) => state.discoveryState);
  const stumpActive = useAppSelector(rootState => rootState.commonState.stumpActive);

  const getPageOne = React.useCallback(async () => {
    globalLoading(true);
    try {
      if (postDetail) {
        const payload = { id: postDetail.id, page: 1 };
        dispatch(fetchListByPost(payload));
        setInitState(prev => ({ ...prev, refreshing: false }));
      }
      if (matchDetail) {
        const payload = { id: matchDetail.id, page: 1 };
        dispatch(fetchListByMatch(payload));
        setInitState(prev => ({ ...prev, refreshing: false }));
      }
      if (discoveryDetail) {
        const payload = { id: discoveryDetail.id, pageNumber: 1, type: discoveryDetail.type };
        dispatch(fetchListByDiscovery(payload));
        setInitState(prev => ({ ...prev, refreshing: false }));
      }
      // if (marketDetail) {
      //   const payload = { listId: [marketDetail.id], pageNumber: 1, type: marketDetail.type };
      //   dispatch(fetchListByCity(payload));
      //   setInitState(prev => ({ ...prev, refreshing: false }));
      // }
    } catch (error) {
      console.log(error);
    } finally {
      globalLoading(false);
    }
  }, [dispatch, matchDetail, postDetail, discoveryDetail]);

  const refreshControl = React.useCallback(() => {
    setInitState(prev => ({ ...prev, refreshing: true }));
    getPageOne();
  }, [getPageOne]);

  React.useEffect(() => {
    getPageOne();
  }, [getPageOne]);

  React.useEffect(() => {
    setInitState(prev => ({
      ...prev,
      data:
        (postDetail && stumpPost?.data.stumpData) ||
        (matchDetail && stumpMatch?.data.stumpData) ||
        (discoveryDetail && stumpDiscovery?.data.stumps),
    }));
  }, [
    matchDetail,
    postDetail,
    discoveryDetail,
    stumpMatch?.data.stumpData,
    stumpPost?.data.stumpData,
    stumpDiscovery?.data.stumps,
  ]);

  React.useEffect(() => {
    if (!likedStumpPayload) {
      return;
    }
    setInitState(preState => ({
      ...preState,
      data: changeStatusLikeStump(cloneDeep(preState.data), likedStumpPayload?.id, myId) as IStumpData[],
    }));
  }, [likedStumpPayload, myId]);

  const handelStumpButton = () => {
    let idDiscoveryStump: any;
    switch (discoveryDetail?.type) {
      case 'sport':
        idDiscoveryStump = { sportId: discoveryDetail?.id };
        break;
      case 'league':
        idDiscoveryStump = { leagueId: discoveryDetail?.id };
        break;
      case 'market':
        idDiscoveryStump = { marketId: discoveryDetail?.id };
        break;

      default:
        idDiscoveryStump = { teamId: discoveryDetail?.id };
        break;
    }
    isRecording
      ? Toast.show({
          type: 'error',
          text1: 'Please finish your record',
        })
      : props.navigation.navigate(APP_NAVIGATION.CREATE, {
          screen: RECORD_NAVIGATION.FIRST_STEP,
          params: { postId: postDetail?.id, matchId: matchDetail?.id, ...idDiscoveryStump },
        });
  };

  const handlePostTitleClick = (url: string) => async () => {
    await Linking.openURL(url);
  };

  const renderListStump = React.useMemo(
    () =>
      ({ item, index }: { item: any; index: number }) =>
        (
          // <CompactCardComponent data={item} navigation={props.navigation} />,
          <View style={commonStyles.flex_1}>
            <CardComponent data={item} navigation={props.navigation} indexCard={index} screen={APP_NAVIGATION.SEARCH} />
          </View>
        ),
    [props.navigation],
  );

  const renderEmptyListStump = React.useCallback(
    () => (
      <View style={[commonStyles.containerView]}>
        <TextDiscovery fontSize={14} lineHeight={19} color={Colors.Light_grey5}>
          This post has no stump yet
        </TextDiscovery>
      </View>
    ),
    [],
  );

  const handleRefresh = React.useMemo(
    () => <RefreshControl refreshing={initState.refreshing} onRefresh={refreshControl} />,
    [initState.refreshing, refreshControl],
  );

  return (
    <ContainerStyled>
      <View style={styles.discoveryInfoContainer}>
        <View style={{ width: width - spacing.s - spacing.s - scale(30) }}>
          {postDetail && (
            <TextDiscovery fontSize={12} lineHeight={15} color={Colors.Dark_Gray1} numberOfLines={1}>
              {postDetail.sportName} &gt; {postDetail.leagueName} &gt;{' '}
              <TextDiscovery
                onPress={handlePostTitleClick(postDetail.pageUrl)}
                fontSize={12}
                lineHeight={15}
                color={Colors.Black}
                textDecorationLine={'underline'}>
                {postDetail.title}
              </TextDiscovery>
            </TextDiscovery>
          )}
          {matchDetail && (
            <TextDiscovery fontSize={12} lineHeight={15} color={Colors.Dark_Gray1}>
              {matchDetail.sportName} &gt; {matchDetail.leagueName} &gt;{' '}
              <TextDiscovery fontSize={12} lineHeight={15} color={Colors.Black}>
                {matchDetail.homeNickname ? matchDetail.homeNickname : matchDetail.home?.split(' ').pop()} vs{' '}
                {matchDetail.awayNickname ? matchDetail.awayNickname : matchDetail.away?.split(' ').pop()}
              </TextDiscovery>
            </TextDiscovery>
          )}
          {discoveryDetail && (
            <TextDiscovery fontSize={12} lineHeight={15} color={Colors.Black}>
              {discoveryDetail?.name}
            </TextDiscovery>
          )}
        </View>
        {postDetail && (
          <View style={styles.stumpNumber}>
            <TextDiscovery fontSize={12} lineHeight={15} color={Colors.White}>
              {postDetail.countStump}
            </TextDiscovery>
          </View>
        )}
        {matchDetail && (
          <View style={styles.stumpNumber}>
            <TextDiscovery fontSize={12} lineHeight={15} color={Colors.White}>
              {matchDetail.countStump}
            </TextDiscovery>
          </View>
        )}
      </View>
      <View style={styles.container}>
        <Animated.FlatList
          data={initState.data}
          extraData={initState.data}
          renderItem={renderListStump}
          refreshControl={handleRefresh}
          ListEmptyComponent={renderEmptyListStump}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={[styles.stumpButton, (isRecording || stumpActive) && styles.stumpButtonIsRecording]}
          onPress={handelStumpButton}>
          <TextDiscovery fontSize={16} lineHeight={21} color={Colors.white}>
            Stump about this
          </TextDiscovery>
        </TouchableOpacity>
      </View>
    </ContainerStyled>
  );
};

export default Discovery;
