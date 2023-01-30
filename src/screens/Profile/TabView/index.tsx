import { NUMBER_BREAK_PAGE } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { Stump, TFieldStumpTab, useAppDispatch, useAppSelector } from '@/stores';
import { Colors } from '@/theme/colors';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Platform, Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { ViewProfileData } from '../Profile.prop';
import SceneTab from '../SceneTab';
import { styles } from './styles';
import { stumpController } from '@/controllers/stump.controller';
import { ApiRoutes } from '@/controllers';
import { changeStatusLikeStump } from '@/containers/actions/like_stump.action';
import { useGetMyId } from '@/hooks/useGetMyId';
import { cloneDeep } from 'lodash';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { validFindIndex } from '@/utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { TextComponent } from '@/containers/components/TextComponent';

const TAB = {
  CREATED: 'Created',
  LIKED: 'Liked',
  SHARED: 'Shared',
  JOINED: 'Joined',
};

interface Props {
  navigation: any;
  indexActive?: { index: number };
  clearParam(): void;
  scrollY: Animated.Value;
  scrollYClamped: Animated.AnimatedDiffClamp<number>;
  heightHeader: number;
  userId?: number;
  displayName?: string;
}

const LazyPlaceholder = ({ route }: any) => (
  <View style={styles.scene}>
    <Text>Loading {route.title}…</Text>
  </View>
);

type IState = {
  created: ViewProfileData;
  liked: ViewProfileData;
  restumped: ViewProfileData;
  joined: ViewProfileData;
};

const TabViewComponent = (props: Props) => {
  const [index, setIndex] = React.useState(0);
  const dispatch = useAppDispatch();
  const myId = useGetMyId();
  const isFocus = useIsFocused();

  const likedStumpPayload = useAppSelector(rootState => rootState.stumpState.likedStump);
  const editedStumpPayload = useAppSelector(rootState => rootState.stumpState.editStump);
  const deletedStumpPayload = useAppSelector(rootState => rootState.stumpState.deleteStump);
  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: TAB.CREATED, title: TAB.CREATED },
    { key: TAB.JOINED, title: TAB.JOINED },
    { key: TAB.LIKED, title: TAB.LIKED },
    { key: TAB.SHARED, title: TAB.SHARED },
  ]);

  const [state, setState] = useState<IState>({
    created: {
      data: [],
      currentPage: 1,
      maxPage: 1,
      count: 0,
    },
    liked: {
      data: [],
      currentPage: 1,
      maxPage: 1,
      count: 0,
    },
    restumped: {
      data: [],
      currentPage: 1,
      maxPage: 1,
      count: 0,
    },
    joined: {
      data: [],
      currentPage: 1,
      maxPage: 1,
      count: 0,
    },
  });

  const fieldTabCreated = 'created';
  const fieldTabLiked = 'liked';
  const fieldTabRestumped = 'restumped';
  const fieldTabJoined = 'joined';

  const eventFetchShared = props.userId
    ? EDeviceEmitter.FETCH_SHARED_TAB_OTHER_PROFILE
    : EDeviceEmitter.FETCH_SHARED_TAB_PROFILE;

  const eventUpdateUnshare = props.userId
    ? EDeviceEmitter.UPDATE_NUMBER_UNSHARE_OTHER_PROFILE
    : EDeviceEmitter.UPDATE_NUMBER_UNSHARE_PROFILE;

  const eventUpdateCountLiked = props.userId
    ? EDeviceEmitter.UPDATE_COUNT_LIKE_OTHER_PROFILE
    : EDeviceEmitter.UPDATE_COUNT_LIKE_PROFILE;

  const eventUpdateShare = props.userId
    ? EDeviceEmitter.UPDATE_NUMBER_SHARE_OTHER_PROFILE
    : EDeviceEmitter.UPDATE_NUMBER_SHARE_PROFILE;

  const renderSubject = () => (props.userId ? props.displayName : 'You');

  useEffect(() => {
    if (props.indexActive) {
      setIndex(props.indexActive.index);
      props.clearParam();
    }
  }, [props.indexActive]);

  useEffect(() => {
    if (!isFocus) {
      return;
    }

    if (index === 2) {
      _getPageOne(ApiRoutes.stump.getListStumpLike, fieldTabLiked);
    }
    if (index === 3) {
      _getPageOne(ApiRoutes.stump.getListStumpShared, fieldTabRestumped);
    }
    if (index === 1) {
      _getPageOne(ApiRoutes.stump.getListStumpJoined, fieldTabJoined);
    }
    if (index === 0) {
      _getPageOne(ApiRoutes.stump.getListStumpCreated, fieldTabCreated);
    }
  }, [index, isFocus]);

  const onChangeMoreData = useCallback((field: 'created' | 'liked' | 'restumped' | 'joined', stumps: Stump[]) => {
    setState(preState => ({
      ...preState,
      [field]: {
        ...preState[field],
        data: stumps,
      },
    }));
  }, []);

  useEffect(() => {
    if (!deletedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      created: {
        ...preState.created,
        data: preState.created.data.filter(st => st.id !== deletedStumpPayload),
        count: preState.created.data.find(st => st.id === deletedStumpPayload)
          ? preState.created.count - 1
          : preState.created.count,
      },
      joined: {
        ...preState.joined,
        data: preState.joined.data.filter(st => st.id !== deletedStumpPayload),
        count: preState.joined.data.find(st => st.id === deletedStumpPayload)
          ? preState.joined.count - 1
          : preState.joined.count,
      },
      liked: {
        ...preState.liked,
        data: preState.liked.data.filter(st => st.id !== deletedStumpPayload),
        count: preState.liked.data.find(st => st.id === deletedStumpPayload)
          ? preState.liked.count - 1
          : preState.liked.count,
      },
      restumped: {
        ...preState.restumped,
        data: preState.restumped.data.filter(st => st.id !== deletedStumpPayload),
        count: preState.restumped.data.find(st => st.id === deletedStumpPayload)
          ? preState.restumped.count - 1
          : preState.restumped.count,
      },
    }));
  }, [deletedStumpPayload]);

  useEffect(() => {
    if (!editedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      created: {
        ...preState.created,
        data: preState.created.data.map(st => {
          if (st.id === editedStumpPayload.id) {
            return { ...st, ...editedStumpPayload };
          }
          return st;
        }),
      },
      joined: {
        ...preState.joined,
        data: preState.joined.data.map(st => {
          if (st.id === editedStumpPayload.id) {
            return { ...st, ...editedStumpPayload };
          }
          return st;
        }),
      },
      liked: {
        ...preState.liked,
        data: preState.liked.data.map(st => {
          if (st.id === editedStumpPayload.id) {
            return { ...st, ...editedStumpPayload };
          }
          return st;
        }),
      },
      restumped: {
        ...preState.restumped,
        data: preState.restumped.data.map(st => {
          if (st.id === editedStumpPayload.id) {
            return { ...st, ...editedStumpPayload };
          }
          return st;
        }),
      },
    }));
  }, [editedStumpPayload]);

  useEffect(() => {
    if (!likedStumpPayload) {
      return;
    }
    setState(preState => ({
      ...preState,
      created: {
        ...preState.created,
        data: changeStatusLikeStump(cloneDeep(preState.created.data), likedStumpPayload?.id, myId),
      },
      joined: {
        ...preState.joined,
        data: changeStatusLikeStump(cloneDeep(preState.joined.data), likedStumpPayload?.id, myId),
      },
      liked: {
        ...preState.liked,
        data: changeStatusLikeStump(cloneDeep(preState.liked.data), likedStumpPayload?.id, myId),
      },
      restumped: {
        ...preState.restumped,
        data: changeStatusLikeStump(cloneDeep(preState.restumped.data), likedStumpPayload?.id, myId),
      },
    }));
  }, [likedStumpPayload]);

  useEmitter(eventUpdateUnshare, (payload: { id: number; userId: number }) => {
    setState(preState => ({
      ...preState,
      created: {
        ...preState.created,
        data: preState.created.data.map(st => {
          if (st.id === payload.id) {
            const i = st.userShared?.findIndex(e => e === payload.userId) || -1;
            if (validFindIndex(i)) {
              st.userShared?.splice(i, 1);
            }
            return { ...st, userShared: [...(st.userShared || [])] };
          }
          return st;
        }),
      },
      liked: {
        ...preState.liked,
        data: preState.liked.data.map(st => {
          if (st.id === payload.id) {
            const i = st.userShared?.findIndex(e => e === payload.userId) || -1;
            if (validFindIndex(i)) {
              st.userShared?.splice(i, 1);
            }
            return { ...st, userShared: [...(st.userShared || [])] };
          }
          return st;
        }),
      },
      joined: {
        ...preState.joined,
        data: preState.joined.data.map(st => {
          if (st.id === payload.id) {
            const i = st.userShared?.findIndex(e => e === payload.userId) || -1;
            if (validFindIndex(i)) {
              st.userShared?.splice(i, 1);
            }
            return { ...st, userShared: [...(st.userShared || [])] };
          }
          return st;
        }),
      },
    }));
  });

  useEmitter(eventFetchShared, () => {
    _getPageOne(ApiRoutes.stump.getListStumpShared, fieldTabRestumped);
  });

  useEmitter(eventUpdateCountLiked, (payload: number) => {
    setState(preState => ({
      ...preState,
      liked: { ...preState.liked, count: Number(preState.liked.count) + Number(payload) },
    }));
  });

  useEmitter(
    eventUpdateShare,
    (payload: { id: number; userId: number }) => {
      setState(preState => ({
        ...preState,
        created: {
          ...preState.created,
          data: preState.created.data.map(st => {
            if (st.id === payload.id) {
              return { ...st, userShared: [...(st.userShared || []), payload.userId] };
            }
            return st;
          }),
        },
        joined: {
          ...preState.joined,
          data: preState.joined.data.map(st => {
            if (st.id === payload.id) {
              return { ...st, userShared: [...(st.userShared || []), payload.userId] };
            }
            return st;
          }),
        },
        liked: {
          ...preState.liked,
          data: preState.liked.data.map(st => {
            if (st.id === payload.id) {
              return { ...st, userShared: [...(st.userShared || []), payload.userId] };
            }
            return st;
          }),
        },
        restumped: {
          ...preState.restumped,
          data: preState.restumped.data.map(st => {
            if (st.id === payload.id) {
              return { ...st, userShared: [...(st.userShared || []), payload.userId] };
            }
            return st;
          }),
        },
      }));
    },
    [],
  );

  useEmitter(EDeviceEmitter.FETCH_ALL_TAB, () => {
    _focus();
  });

  const _renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case TAB.CREATED:
        return (
          <SceneTab
            navigation={props.navigation}
            url={ApiRoutes.stump.getListStumpCreated}
            userId={props.userId}
            key={route.key}
            field={fieldTabCreated}
            data={{
              data: state[fieldTabCreated].data,
              currentPage: state[fieldTabCreated].currentPage,
              maxPage: state[fieldTabCreated].maxPage,
            }}
            textEmptyList={renderSubject() + ' has not created any stumps.'}
            scrollY={props.scrollY}
            heightHeader={props.heightHeader}
            index={0}
            currentIndex={index}
            onChangeMoreData={onChangeMoreData}
          />
        );
      case TAB.LIKED:
        return (
          <SceneTab
            navigation={props.navigation}
            url={ApiRoutes.stump.getListStumpLike}
            userId={props.userId}
            key={route.key}
            field={fieldTabLiked}
            data={{
              data: state[fieldTabLiked].data,
              currentPage: state[fieldTabLiked].currentPage,
              maxPage: state[fieldTabLiked].maxPage,
            }}
            textEmptyList={renderSubject() + ' has not liked any stumps.'}
            scrollY={props.scrollY}
            heightHeader={props.heightHeader}
            index={2}
            currentIndex={index}
            onChangeMoreData={onChangeMoreData}
          />
        );
      case TAB.SHARED:
        return (
          <SceneTab
            navigation={props.navigation}
            url={ApiRoutes.stump.getListStumpShared}
            userId={props.userId}
            key={route.key}
            field={fieldTabRestumped}
            data={{
              data: state[fieldTabRestumped].data,
              currentPage: state[fieldTabRestumped].currentPage,
              maxPage: state[fieldTabRestumped].maxPage,
            }}
            textEmptyList={renderSubject() + ' has not shared any stumps.'}
            scrollY={props.scrollY}
            heightHeader={props.heightHeader}
            index={3}
            currentIndex={index}
            onChangeMoreData={onChangeMoreData}
          />
        );
      case TAB.JOINED:
        return (
          <SceneTab
            navigation={props.navigation}
            url={ApiRoutes.stump.getListStumpJoined}
            userId={props.userId}
            key={route.key}
            field={fieldTabJoined}
            data={{
              data: state[fieldTabJoined].data,
              currentPage: state[fieldTabJoined].currentPage,
              maxPage: state[fieldTabJoined].maxPage,
            }}
            textEmptyList={renderSubject() + ' has not joined any stumps.'}
            scrollY={props.scrollY}
            heightHeader={props.heightHeader}
            index={1}
            currentIndex={index}
            onChangeMoreData={onChangeMoreData}
          />
        );
      default:
        return null;
    }
  };

  React.useEffect(() => {
    _focus();
  }, []);

  const _getPageOne = async (url: string, field: TFieldStumpTab) => {
    const res = await stumpController.getListStumpProfile({ url, pageNumber: 1, userId: props.userId });
    if (res.status === 1) {
      setState(preState => ({
        ...preState,
        [field]: {
          data: res.data.stumps,
          currentPage: 1,
          maxPage: Math.ceil(res.data.count / NUMBER_BREAK_PAGE) || 1,
          count: res.data.count || 0,
        },
      }));
    }
  };

  const _focus = async () => {
    try {
      globalLoading(true);
      await Promise.all([
        _getPageOne(ApiRoutes.stump.getListStumpCreated, fieldTabCreated),
        _getPageOne(ApiRoutes.stump.getListStumpLike, fieldTabLiked),
        _getPageOne(ApiRoutes.stump.getListStumpShared, fieldTabRestumped),
        _getPageOne(ApiRoutes.stump.getListStumpJoined, fieldTabJoined),
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  const _renderLazyPlaceholder = ({ route }: any) => <LazyPlaceholder route={route} />;

  const _renderTabBar = (tabBarProps: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    return (
      <TabBar
        {...tabBarProps}
        style={styles.tabBar}
        tabStyle={styles.tabStyle}
        pressColor={'transparent'}
        indicatorStyle={{ backgroundColor: Colors.Background2 }}
        renderLabel={({ route, focused }) => {
          let count = 0;
          if (route.title === TAB.CREATED) {
            count = state[fieldTabCreated].count || 0;
          }
          if (route.title === TAB.LIKED) {
            count = state[fieldTabLiked].count || 0;
          }
          if (route.title === TAB.SHARED) {
            count = state[fieldTabRestumped].count || 0;
          }
          if (route.title === TAB.JOINED) {
            count = state[fieldTabJoined].count || 0;
          }
          return (
            <View>
              <TextComponent style={{ ...styles.tabBarText, color: !focused ? Colors.DarkGray : Colors.Background2 }}>
                {`${route.title}`}
              </TextComponent>
              <TextComponent style={{ ...styles.tabBarText, color: !focused ? Colors.DarkGray : Colors.Background2 }}>
                {`(${count})`}
              </TextComponent>
            </View>
          );
        }}
        activeColor={Colors.Background2}
      />
    );
  };
  const scrollYClamped = React.useMemo(
    () => Animated.diffClamp(props.scrollY, 0, props.heightHeader),
    [props.heightHeader, props.scrollY],
  );

  const y = React.useMemo(
    () =>
      scrollYClamped.interpolate({
        inputRange: [0, props.heightHeader / 3],
        outputRange: [props.heightHeader, 0],
        extrapolate: 'clamp',
      }),
    [props.heightHeader, scrollYClamped],
  );

  const styleAni = React.useMemo(
    () => (Platform.OS === 'ios' ? { transform: [{ translateY: y }], flex: 1 } : { flex: 1 }),
    [y],
  );

  return (
    <Animated.View style={styleAni as any}>
      <TabView
        lazy={true}
        navigationState={{ index, routes }}
        renderScene={_renderScene}
        renderTabBar={_renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderLazyPlaceholder={_renderLazyPlaceholder}
      />
    </Animated.View>
  );
};

export default React.memo(TabViewComponent);
