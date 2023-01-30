import { CardUserFollow } from '@/containers/components/CardUserFollow';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { IUserInfo, useAppDispatch } from '@/stores';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  FlatList,
  Keyboard,
  LayoutAnimation,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextMessageStyled, ViewWrapStyled } from '../SceneTab/styles';
import { SearchTextInputStyled, styles } from './styles';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { NUMBER_BREAK_PAGE, PROFILE_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { ApiRoutes, stumpController } from '@/controllers';
import { networkService } from '@/networking';
import { cloneDeep } from 'lodash';

type Props = {
  navigation: any;
  url: string;
  field: 'followers' | 'following' | 'followersProfile' | 'followingProfile';
  viewingUserId?: number;
  myId?: number;
  listFollowing: IUserInfo[];
  textNoFollow: string;
};

type State = {
  currentPage: number;
  maxPage: number;
  data: IUserInfo[];
  isLoading: boolean;
  loadingMore: boolean;
  filterList?: IUserInfo[];
};
const RenderListFollow = (props: Props) => {
  const dispatch = useAppDispatch();
  const timeout = React.useRef<number>();

  const { isBlockMe } = useUserBlockMe();
  const contentContainerStyle = usePaddingBottomFlatlist();
  const [state, setState] = useState<State>({
    data: [],
    currentPage: 1,
    maxPage: 1,
    isLoading: true,
    loadingMore: false,
  });

  const { control, setValue } = useForm<{ search: string }>();
  const transtaleXValue = React.useRef(new Animated.Value(scale(100))).current;

  useEffect(() => {
    initData(1);
  }, []);

  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    initData(state.currentPage);
  }, [state.currentPage]);

  const initData = async (pageNumber: number) => {
    try {
      const res = await networkService.request<{ count: number; data: IUserInfo[] }>({
        method: 'POST',
        url: props.url,
        data: {
          pageNumber,
          userId: props.viewingUserId,
        },
      });
      if (res.status === 1) {
        let data: any;
        if (state.data.length) {
          data = [...cloneDeep(state.data), ...res.data.data];
        } else {
          data = [...res.data.data];
        }
        setState(preState => ({
          ...preState,
          data,
          currentPage: pageNumber,
          maxPage: Math.ceil(res.data.count / NUMBER_BREAK_PAGE) || 1,
          isLoading: false,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
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
        if (userId === props.myId) {
          props.navigation.push(PROFILE_NAVIGATION.DETAIL_PROFILE, { userId });
          return;
        }
        props.navigation.push(PROFILE_NAVIGATION.VIEW_PROFILE, {
          userId,
          screen: PROFILE_NAVIGATION.FOLLOW_SCREEN,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [isBlockMe, props.myId, props.navigation],
  );

  const _follow = React.useCallback(
    async (followId: number, follow: boolean) => {
      try {
        globalLoading(true);
        const res_follow = await stumpController.followUser(props.myId!, followId);
        if (res_follow.status === 1) {
          // dispatch(setIdFollow({ id: followId, follow: !follow }));
          dispatch(fetchUser(true));
        }
      } catch (error: any) {
        console.log(error);
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
            myId={props.myId || 0}
            listFollowing={props.listFollowing}
          />
        ),
    [props.myId, props.listFollowing, _gotoProfile, _follow],
  );
  const RenderFooter = React.useMemo(() => <FooterLoadMore loadingMore={state.loadingMore} />, [state.loadingMore]);

  const loadMore = React.useCallback(async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  }, [state.loadingMore, state.currentPage, state.maxPage]);

  const keyExtractor = React.useMemo(() => (item: IUserInfo) => item.id.toString(), []);

  const memoizedData = React.useMemo(() => state.filterList || state.data, [state.filterList, state.data]);

  const ListEmptyComponent = React.useMemo(
    () => (
      <ViewWrapStyled>
        {state.filterList ? (
          <TextMessageStyled>No results found.</TextMessageStyled>
        ) : (
          <TextMessageStyled>{props.textNoFollow}</TextMessageStyled>
        )}
      </ViewWrapStyled>
    ),
    [state.filterList, props.textNoFollow],
  );

  const onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    event.persist();
    LayoutAnimation.spring();
    Animated.timing(transtaleXValue, {
      toValue: scale(0),
      useNativeDriver: true,
      duration: 100,
    }).start();
  };
  const onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    event.persist();
    if (control._formValues?.inviteCode) {
      return;
    }
    LayoutAnimation.spring();
    Animated.timing(transtaleXValue, {
      toValue: scale(100),
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  const _onSearch = () => {
    const text = control._formValues?.search || '';
    debounceFnc(text);
  };

  const _cancel = () => {
    setValue('search', '');
    debounceFnc('');
    Keyboard.dismiss();
  };

  const onChangeText = (text: string) => {
    setValue('search', text);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      _onSearch();
    }, 1000);
  };

  //search following
  const debounceFnc = (_searchVal: string) => {
    try {
      if (_searchVal.trim() === '') {
        setState(preState => ({ ...preState, filterList: undefined }));
        return;
      }
      const newData = cloneDeep(state.data);

      const result = newData?.filter(item => {
        const matchingDisplayName = item.displayName.trim().toLowerCase().includes(_searchVal.trim().toLowerCase());
        const matchingEmail = item.email.trim().toLowerCase().includes(_searchVal.trim().toLowerCase());
        const matchingFName = item.firstName.trim().toLowerCase().includes(_searchVal.trim().toLowerCase());
        const matchingLName = item.lastName.trim().toLowerCase().includes(_searchVal.trim().toLowerCase());
        const matchingFandLName = (item.firstName + item.lastName)
          .trim()
          .toLowerCase()
          .includes(_searchVal.trim().split(' ').join('').toLowerCase());
        const matchingLandFName = (item.lastName + item.firstName)
          .trim()
          .toLowerCase()
          .includes(_searchVal.trim().split(' ').join('').toLowerCase());
        return (
          matchingDisplayName ||
          matchingEmail ||
          matchingFName ||
          matchingLName ||
          matchingFandLName ||
          matchingLandFName
        );
      });
      setState(preState => ({ ...preState, filterList: result }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const placeholder = React.useMemo(
    () => (props.field === 'followers' || props.field === 'followersProfile' ? 'Search follower' : 'Search following'),
    [props.field],
  );

  return (
    <View style={styles.container}>
      <View style={styles.viewInput}>
        <View style={[styles.viewSearch]}>
          <Icon name="search-outline" size={scale(20)} color={Colors.Gray} />

          <Controller
            control={control}
            render={({ field: { value } }) => (
              <SearchTextInputStyled
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={_onSearch}
              />
            )}
            name="search"
            defaultValue={''}
          />
          <Animated.View style={[styles.viewJoin, { transform: [{ translateX: transtaleXValue }] }]}>
            <TouchableOpacity onPress={_cancel}>
              <Icon name="close-outline" size={scale(22)} color={Colors.Gray} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <FlatList
        data={memoizedData}
        extraData={memoizedData}
        contentContainerStyle={contentContainerStyle}
        renderItem={RenderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default React.memo(RenderListFollow);
