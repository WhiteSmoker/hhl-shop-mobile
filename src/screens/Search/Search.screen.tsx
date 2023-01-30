import { IconSearch } from '@/assets/icons/Icon';
import { Animated, Dimensions, Keyboard, StatusBar, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { IProps, IState, SearchStump } from './Search.type';
import {
  SearchTextInputStyled,
  styles,
  TextInputStyled,
  TextRecentStyled,
  TextRecentTitleStyled,
  ViewHorizontal,
  ViewRecentStyled,
  ViewSearchStyled,
  ViewSkeleton,
} from './Search.style';
import { Colors } from '@/theme/colors';
import { Controller, useForm } from 'react-hook-form';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { ASYNC_STORE, storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { searchSlice } from '@/stores/reducers';
import { searchController } from '@/controllers';
import Category from './Category';
import SkeletonCardComponent from '@/containers/components/SkeletonComponent';
import TabViewSearch from './TabViewSearch';
import { useAppSelector } from '@/stores';
import { ContainerStyled } from '@/styles/common';

const SearchCategory = (props: IProps) => {
  const { control, setValue } = useForm<{ string_search: string }>();
  const timeout = React.useRef<any>();
  const isFocused = useIsFocused();
  const dataDefault = useAppSelector(rootState => rootState.searchState.default_search.default);

  const [state, setState] = useState<IState>({
    dataDefault: [],
    maxPage: 1,
    currentPage: 1,
    loadingMore: false,
    loadingSkeleton: true,
    refreshing: false,
    isFocused: false,
    recentList: [],
  });

  const transtaleYValue = React.useRef(new Animated.Value(scale(1000))).current;
  const transtaleXValueExit = React.useRef(new Animated.Value(scale(300))).current;
  const opacityValueExit = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      _onInit();
      _getRecentList();
    }
  }, [isFocused]);

  const _getRecentList = async () => {
    const list = await storage.getItem(ASYNC_STORE.RECENT_LIST);
    let recentList: string[] = [];
    if (list) {
      recentList = JSON.parse(list).filter((_x: string, index: number) => index < 10);
    }
    setState(preState => ({ ...preState, recentList }));
  };

  const _onInit = async () => {
    try {
      const res_hashtag = await searchController.getDefaultSearch();
      if (res_hashtag.status === 1) {
        const dataDefaultSearch: SearchStump[] = res_hashtag.data.sort(
          (a: any, b: any) => b?.stumps?.length - a?.stumps?.length,
        );
        searchSlice.actions.setDefaultSearch({ default: dataDefaultSearch });
        setState(preState => ({ ...preState, loadingSkeleton: false, refreshing: false }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _clear = () => {
    searchSlice.actions.setListStumpSearch({ username: [], hashtag: [], title: [] });
    const str = control?._formValues?.string_search.trim() ?? '';
    Keyboard.dismiss();
    if (str) {
      debounceFnc('');
    }
  };

  const _onFocus = () => {
    const str = control?._formValues?.string_search.trim() ?? '';
    if (str) {
      return;
    }
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
  };

  const _onBlur = () => {
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(1000),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(100),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
  };

  const debounceFnc = React.useCallback(async (_searchVal: string) => {
    try {
      if (_searchVal === '') {
        setValue('string_search', '');
        setState(preState => ({ ...preState, dataSearch: undefined, currentPage: 1, maxPage: 1 }));
        return;
      }
      setState(preState => ({
        ...preState,
        dataSearch: [],
      }));
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  // const _onChange = (text: string) => {
  //   setValue('string_search', text);
  //   if (timeout.current) {
  //     clearTimeout(timeout.current);
  //   }
  //   timeout.current = setTimeout(async () => {
  //     await _onSearch();
  //   }, 1000);
  // };

  const _onSearch = async () => {
    const str = control?._formValues?.string_search.trim() ?? '';
    const newRecentList = [`${str}`, ...state.recentList];
    console.log(newRecentList);
    Keyboard.dismiss();
    if (str) {
      await storage.setItem(ASYNC_STORE.RECENT_LIST, JSON.stringify([...new Set(newRecentList)]));
      await _getRecentList();
    }
    debounceFnc(str);
  };

  const _pickRecentWord = (item: string) => () => {
    setValue('string_search', item);
    _onSearch();
  };

  const _onRefresh = React.useCallback(async () => {
    console.log('1111', state.dataSearch);
    if (!state.dataSearch) {
      setState(preState => ({ ...preState, refreshing: true }));
      await _onInit();
    }
  }, [state.dataSearch]);

  const RenderRecentWord = useMemo(() => {
    return state.recentList.length > 0
      ? state.recentList.map(item => (
          <ViewRecentStyled key={item} onPress={_pickRecentWord(item)}>
            <TextRecentStyled>{item}</TextRecentStyled>
          </ViewRecentStyled>
        ))
      : null;
  }, [state.recentList]);

  const onChangeText = (text: string) => {
    setValue('string_search', text);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(async () => {
      await _onSearch();
    }, 3000);
  };

  useEffect(() => {
    if (!props.route.params?.hashTag) {
      return;
    }
    setValue('string_search', props.route.params?.hashTag);
    _onSearch();
  }, [props.route.params?.hashTag]);

  return (
    <ContainerStyled>
      <View style={{ backgroundColor: Colors.Background }}>
        <ViewSearchStyled>
          <Icon name="search-outline" size={scale(22)} color={Colors.Gray} />
          <Controller
            control={control}
            render={({ field: { value } }) => (
              <SearchTextInputStyled
                placeholder="Search for Stumps"
                onFocus={_onFocus}
                onBlur={_onBlur}
                onChangeText={onChangeText}
                value={value}
                onSubmitEditing={_onSearch}
              />
            )}
            name="string_search"
            defaultValue={''}
          />
          <Animated.View style={{ transform: [{ translateX: transtaleXValueExit }], opacity: opacityValueExit }}>
            <TouchableOpacity onPress={_clear}>
              <Icon name="close-outline" size={scale(22)} color={Colors.Gray} />
            </TouchableOpacity>
          </Animated.View>
        </ViewSearchStyled>
      </View>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            padding: scale(16),
            transform: [{ translateY: transtaleYValue }],
            position: 'absolute',
            backgroundColor: Colors.Very_Light_Gray,
            zIndex: 1,
            height: '100%',
            width: '100%',
          }}>
          <TextRecentTitleStyled>Recent</TextRecentTitleStyled>
          {RenderRecentWord}
        </Animated.View>
        {!state.loadingSkeleton ? (
          !state.dataSearch ? (
            <Category
              data={dataDefault}
              navigation={props.navigation}
              onRefresh={_onRefresh}
              loadingMore={state.loadingMore}
              refreshing={state.refreshing}
            />
          ) : (
            <TabViewSearch
              navigation={props.navigation}
              text={control?._formValues?.string_search.trim() ?? ''}
              indexActive={props.route.params?.indexActive ?? undefined}
            />
          )
        ) : (
          <ViewSkeleton>
            <SkeletonCardComponent size={Math.round(Dimensions.get('window').height / 120)} />
          </ViewSkeleton>
        )}
      </View>
    </ContainerStyled>
  );
};
export default React.memo(SearchCategory);
