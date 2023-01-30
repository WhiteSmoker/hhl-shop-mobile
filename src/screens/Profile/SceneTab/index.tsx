import { APP_NAVIGATION, NUMBER_BREAK_PAGE } from '@/constants';
import CardComponent from '@/containers/components/CardComponent';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { stumpController } from '@/controllers/stump.controller';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { Stump, useAppDispatch } from '@/stores';
import { stumpSlice } from '@/stores/reducers';
import { commonStyles, ContainerStyled, getItemLayout } from '@/styles/common';
import unionBy from 'lodash/unionBy';
import React, { useEffect, useState } from 'react';
import { Animated, FlatList, Platform, View } from 'react-native';
import { IProps, IState } from './propState';
import { TextMessageStyled, ViewWrapStyled } from './styles';

const SceneTab = (props: IProps) => {
  const dispatch = useAppDispatch();
  const refFlatlist = React.useRef<FlatList>();
  const cacheScrollY = React.useRef(0);
  const currentIndex = React.useRef(0);
  const dfIndex = React.useRef(0);
  const contentContainerStyle = usePaddingBottomFlatlist();

  const [state, setState] = useState<IState>({
    currentPage: props.data.currentPage,
    maxPage: props.data.maxPage,
    loadingMore: false,
  });
  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    _getData(state.currentPage);
  }, [state.currentPage]);

  useEffect(() => {
    setState(preState => ({
      ...preState,
      maxPage: props.data.maxPage,
    }));
  }, [props.data.maxPage]);

  const _getData = async (pageNumber: number) => {
    try {
      const res = await stumpController.getListStumpProfile({
        url: props.url,
        pageNumber,
        userId: props.userId || null,
      });

      if (res.status === 1) {
        //random list by date
        let data: any;
        data = [...props.data.data, ...res.data.stumps];
        props.onChangeMoreData(props.field, data);

        setState(preState => ({
          ...preState,
          data,
          maxPage: Math.ceil(res.data.count / NUMBER_BREAK_PAGE) || 1,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _loadMore = React.useCallback(async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  }, [state.currentPage, state.loadingMore, state.maxPage]);

  const RenderStump = React.useCallback(
    ({ item, index }: { item: Stump; index: number }) => (
      <View style={[commonStyles.flex_1]}>
        <CardComponent data={item} navigation={props.navigation} screen={APP_NAVIGATION.PROFILE} indexCard={index} />
      </View>
    ),
    [props.navigation],
  );
  const RenderFooter = React.useMemo(() => <FooterLoadMore loadingMore={state.loadingMore} />, [state.loadingMore]);

  const _keyExtractor = React.useCallback((item: Stump) => item.id.toString(), []);

  useEffect(() => {
    currentIndex.current = props.currentIndex || 0;
    dfIndex.current = props.index || 0;
  }, [props.currentIndex, props.index]);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    if (dfIndex.current === props.currentIndex) {
      Animated.timing(props.scrollY, {
        toValue: cacheScrollY.current,
        useNativeDriver: true,
        duration: 800,
      }).start();
    }
  }, [props.currentIndex]);

  const handleScroll =
    Platform.OS === 'ios'
      ? Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: props.scrollY },
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: e => {
              const y = (e.nativeEvent as any)?.contentOffset?.y;
              if (dfIndex.current === currentIndex.current) {
                cacheScrollY.current = y;
              }
            },
          },
        )
      : undefined;

  const ListEmptyComponent = React.useMemo(
    () => (
      <ViewWrapStyled>
        <TextMessageStyled>{props.textEmptyList}</TextMessageStyled>
      </ViewWrapStyled>
    ),
    [props.textEmptyList],
  );

  return (
    <ContainerStyled>
      <Animated.FlatList
        ref={refFlatlist as any}
        onScroll={handleScroll}
        data={unionBy(props.data.data, 'id')}
        extraData={unionBy(props.data.data, 'id')}
        renderItem={RenderStump}
        nestedScrollEnabled={true}
        keyExtractor={_keyExtractor}
        onEndReached={_loadMore}
        onEndReachedThreshold={0.3}
        getItemLayout={getItemLayout}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={16}
        bounces={false}
      />
    </ContainerStyled>
  );
};

export default React.memo(SceneTab);
