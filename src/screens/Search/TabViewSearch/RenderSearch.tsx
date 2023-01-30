import { APP_NAVIGATION, NUMBER_BREAK_PAGE } from '@/constants';
import CardComponent from '@/containers/components/CardComponent';
import { DropdownCategory } from '@/containers/components/DropdownCategory';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { searchController } from '@/controllers';
import usePreventPlayAudio from '@/hooks/usePreventPlayAudio';
import { Stump, useAppSelector } from '@/stores';
import { searchSlice } from '@/stores/reducers';
import { commonStyles, getItemLayout } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { cloneDeep } from 'lodash';
import unionBy from 'lodash/unionBy';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationSearch } from '../Search.type';
import { TextMessageStyled, ViewWrapStyled } from './styles';
type Props = {
  navigation: NavigationSearch;
  text: string;
  type: string;
  data: {
    data: Stump[];
    currentPage: number;
    maxPage: number;
  };
  field: string;
  selectedItem?(field: string): void;
};
type IState = {
  data: Stump[];
  currentPage: number;
  maxPage: number;
  loadingMore: boolean;
};

const RenderSearch = (props: Props) => {
  const stumpActive = useAppSelector(rootState => rootState.commonState.stumpActive);

  const { isPrevent } = usePreventPlayAudio();
  const [state, setState] = useState<IState>({
    data: props.data.data,
    currentPage: props.data.currentPage,
    maxPage: props.data.maxPage,
    loadingMore: false,
  });

  const [selectedItem, setSelectedItem] = useState('');

  const RenderStump = ({ item, index }: { item: Stump; index: number }) => (
    <View style={commonStyles.flex_1} key={item.id}>
      <CardComponent data={item} navigation={props.navigation} screen={APP_NAVIGATION.SEARCH} indexCard={index} />
    </View>
  );

  const RenderFooter = () => <FooterLoadMore loadingMore={state.loadingMore} />;
  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    _getSearchStump(state.currentPage);
  }, [state.currentPage]);

  const _getSearchStump = async (pageNumber: number) => {
    try {
      const res_search = await searchController.searchStump(pageNumber, props.text, props.type);
      if (res_search.status === 1) {
        //random list by date
        let data: any;
        if (props.data.data.length) {
          data = [...cloneDeep(props.data.data), ...res_search.data.listStump];
        } else {
          data = [...res_search.data.listStump];
        }
        searchSlice.actions.setListStumpSearch({ [props.field]: unionBy(data, 'id') });
        setState((preState: IState) => ({
          ...preState,
          maxPage: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _loadMore = async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState((preState: IState) => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  };

  const _keyExtractor = (item: Stump) => item.id.toString();

  const onChangeItemDropdown = (item: string) => {
    let itemSelected = item === 'City' ? 'market' : item.toLocaleLowerCase();
    if (props.selectedItem) {
      props.selectedItem(itemSelected);
    }
    setSelectedItem(item);
  };

  return (
    <Fragment>
      {props.type === 'category' && (
        <View style={{ alignItems: 'flex-end', margin: scale(12), marginBottom: 0 }}>
          <DropdownCategory
            data={['Sport', 'League', 'Team', 'City', 'Game']}
            mode={'right'}
            selectedItem={selectedItem}
            onChangeItem={onChangeItemDropdown}
            offsetX={scale(0)}
            renderAnchor={() => <Icon name="filter-outline" size={scale(18)} color={Colors.blackOriginal} />}
          />
        </View>
      )}
      <FlatList
        style={commonStyles.containerFlatlist}
        contentContainerStyle={!stumpActive && !isPrevent ? commonStyles.p_b_0 : commonStyles.paddingLastItem}
        data={unionBy(props.data.data, 'id')}
        extraData={unionBy(props.data.data, 'id')}
        renderItem={RenderStump}
        keyExtractor={_keyExtractor}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        onEndReached={_loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={RenderFooter}
        ListEmptyComponent={
          <ViewWrapStyled>
            <TextMessageStyled>No results found.</TextMessageStyled>
          </ViewWrapStyled>
        }
      />
    </Fragment>
  );
};

export default React.memo(RenderSearch);
