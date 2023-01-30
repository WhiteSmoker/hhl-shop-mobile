import { NUMBER_BREAK_PAGE } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { changeStatusLikeStump } from '@/containers/actions/like_stump.action';
import { DropdownCategory } from '@/containers/components/DropdownCategory';
import { TextComponent } from '@/containers/components/TextComponent';
import { searchController } from '@/controllers';
import { IUserInfo, useAppSelector } from '@/stores';
import { searchSlice } from '@/stores/reducers';
import { Colors } from '@/theme/colors';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { NavigationState, Route, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { useDispatch } from 'react-redux';
import { NavigationSearch } from '../Search.type';
import RenderSearch from './RenderSearch';
import RenderUsername from './RenderUsername';
import styles from './styles';

const TAB = {
  USERNAME: 'Username',
  CATEGORY: 'Category',
  TITLE: 'Title',
};

interface Props {
  navigation: NavigationSearch;
  text: string;
  indexActive?: { index: number };
}

const LazyPlaceholder = ({ route }: any) => (
  <View style={styles.scene}>
    <Text>Loading {route.title}…</Text>
  </View>
);
export type DataSearch = {
  currentPage: number;
  maxPage: number;
};
type IState = {
  username: { currentPage: number; maxPage: number };
  category: DataSearch;
  title: DataSearch;
};

const TabViewSearchComponent = (props: Props) => {
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState(props.indexActive?.index || 0);
  const usernameSearch = useAppSelector(rootState => rootState.searchState.search_stumps.username);
  const categorySearch = useAppSelector(rootState => rootState.searchState.search_stumps.category);
  const titleSearch = useAppSelector(rootState => rootState.searchState.search_stumps.title);
  const likedStump = useAppSelector(rootState => rootState.stumpState.likedStump);
  const editStump = useAppSelector(rootState => rootState.stumpState.editStump);
  const userInfo = useAppSelector(rootState => rootState.userState?.userInfo);
  const deleteStump = useAppSelector(rootState => rootState.stumpState.deleteStump);
  const followUser = useAppSelector(rootState => rootState.userState.followUser);

  const [state, setState] = useState<IState>({
    username: {
      currentPage: 1,
      maxPage: 1,
    },
    category: {
      currentPage: 1,
      maxPage: 1,
    },
    title: {
      currentPage: 1,
      maxPage: 1,
    },
  });

  useEffect(() => {
    try {
      if (!likedStump) {
        return;
      }
      const cloneCategory = changeStatusLikeStump(cloneDeep(categorySearch), likedStump, userInfo!);
      const cloneTitle = changeStatusLikeStump(cloneDeep(titleSearch), likedStump, userInfo!);
      searchSlice.actions.setListStumpSearch({ category: cloneCategory, title: cloneTitle });
    } catch (error: any) {
      console.log(error);
    }
  }, [likedStump]);

  useEffect(() => {
    if (!deleteStump) {
      return;
    }
    const cloneCategory = cloneDeep(categorySearch);
    const cloneTitle = cloneDeep(titleSearch);
    const indexCategory = cloneCategory.findIndex((stump: any) => stump.id === deleteStump);
    const indexTitle = cloneTitle.findIndex((stump: any) => stump.id === deleteStump);

    if (indexCategory !== -1) {
      cloneCategory.splice(indexCategory, 1);
      searchSlice.actions.setListStumpSearch({ category: cloneCategory });
    }
    if (indexTitle !== -1) {
      cloneTitle.splice(indexTitle, 1);
      searchSlice.actions.setListStumpSearch({ title: cloneTitle });
    }
  }, [deleteStump]);

  useEffect(() => {
    if (editStump) {
      const cloneCategory = cloneDeep(categorySearch);
      const cloneTitle = cloneDeep(titleSearch);
      for (const stump of cloneCategory) {
        if (stump.id === editStump.id) {
          stump.title = editStump.title;
          stump.description = editStump.description;
          stump.listStump = editStump.listStump;
          break;
        }
      }
      for (const stump of cloneTitle) {
        if (stump.id === editStump.id) {
          stump.title = editStump.title;
          stump.description = editStump.description;
          stump.listStump = editStump.listStump;
          break;
        }
      }
      searchSlice.actions.setListStumpSearch({ category: cloneCategory, title: cloneTitle });
    }
  }, [editStump]);

  useEffect(() => {
    if (!followUser?.id) {
      return;
    }
    try {
      const cloneUserSearch = cloneDeep(usernameSearch);
      const idx = cloneUserSearch.findIndex((data: any) => data.id === followUser.id);
      if (idx !== -1) {
        cloneUserSearch[idx].isFollow = !cloneUserSearch[idx].isFollow;
        searchSlice.actions.setListStumpSearch({ username: cloneUserSearch });
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [followUser]);

  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: TAB.USERNAME, title: TAB.USERNAME },
    { key: TAB.TITLE, title: TAB.TITLE },
    { key: TAB.CATEGORY, title: TAB.CATEGORY },
  ]);

  useEffect(() => {
    _search();
  }, [props.text]);
  const _search = async () => {
    try {
      globalLoading(true);
      searchSlice.actions.setListStumpSearch({ username: [], category: [], title: [] });
      await Promise.all([_searchByName('username'), _searchByType('title'), _searchByType('sport')]);
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  const _searchByName = async (field: 'username') => {
    const res_search = await searchController.searchByName(props.text, 1, true);

    let data;
    if (res_search.status === 1) {
      data = res_search.data?.users?.map((user: IUserInfo) => {
        const idx = userInfo?.listFollowing?.rows?.findIndex((row: any) => row.id === user?.id);
        if (idx !== -1) {
          return { ...user, isFollow: true };
        }
        return { ...user, isFollow: false };
      });
      dispatch(searchSlice.actions.setListStumpSearch({ [field]: data }));
      setState(preState => ({
        ...preState,
        [field]: {
          currentPage: 1,
          maxPage: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
        },
      }));
    }
    return res_search;
  };

  const _searchByType = async (field: 'username' | 'title' | 'sport' | 'league' | 'team' | 'market' | 'game') => {
    const res_search = await searchController.searchStump(1, props.text, field);
    if (res_search.status === 1) {
      let fieldName = field === 'username' || field === 'title' ? field : 'category';
      dispatch(searchSlice.actions.setListStumpSearch({ [fieldName]: res_search.data.listStump }));
      setState(preState => ({
        ...preState,
        [fieldName]: {
          currentPage: 1,
          maxPage: Math.ceil(res_search.data.count / NUMBER_BREAK_PAGE) || 1,
        },
      }));
    }
    return res_search;
  };

  const _renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case TAB.USERNAME:
        return (
          <RenderUsername
            navigation={props.navigation}
            text={props.text}
            field={'username'}
            myId={userInfo?.id || 0}
            data={usernameSearch}
            maxPage={state.username.maxPage}
            listFollowing={userInfo?.listFollowing?.rows || []}
          />
        );
      case TAB.CATEGORY:
        return (
          <RenderSearch
            navigation={props.navigation}
            text={props.text}
            type={'category'}
            field={'category'}
            data={{ data: categorySearch, currentPage: state.category.currentPage, maxPage: state.category.maxPage }}
            selectedItem={_searchByType}
          />
        );
      case TAB.TITLE:
        return (
          <RenderSearch
            navigation={props.navigation}
            text={props.text}
            type={'title'}
            field={'title'}
            data={{ data: titleSearch, currentPage: state.title.currentPage, maxPage: state.title.maxPage }}
          />
        );
      default:
        return null;
    }
  };

  const _renderLazyPlaceholder = ({ route }: any) => <LazyPlaceholder route={route} />;

  const _renderTabBar = (tabBarProps: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    return (
      <TabBar
        {...tabBarProps}
        style={styles.tabBar}
        pressColor={'transparent'}
        indicatorStyle={{ backgroundColor: Colors.Background2 }}
        renderLabel={({ route, focused, color }) => (
          <View style={{ flexDirection: 'row' }}>
            <TextComponent
              style={[
                styles.tabBarText,
                { color: !focused ? Colors.DarkGray : Colors.blackOriginal, marginBottom: scale(15) },
              ]}>
              {route.title}
            </TextComponent>
          </View>
        )}
        activeColor={Colors.Background2}
      />
    );
  };

  useEffect(() => {
    if (props.indexActive) {
      setIndex(props.indexActive.index);
      props.navigation.setParams({ indexActive: undefined, category: undefined });
    }
  }, [props.indexActive]);
  
  return (
    <TabView
      lazy={true}
      navigationState={{ index, routes }}
      renderScene={_renderScene}
      renderTabBar={_renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderLazyPlaceholder={_renderLazyPlaceholder}
    />
  );
};

export default React.memo(TabViewSearchComponent);
