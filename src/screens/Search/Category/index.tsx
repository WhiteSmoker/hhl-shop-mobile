import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IProps, IState } from './propState';
import { styles, ViewHorizontal } from './styles';
import React, { useCallback, useEffect, useState } from 'react';
import { globalLoading } from '@/containers/actions/emitter.action';
import { searchController } from '@/controllers';
import { scale } from 'react-native-size-scaling';
import { SORT_BY } from '@/constants/common';
import { HOME_NAVIGATION } from '@/constants';
import { ISport } from '@/stores/types/survey.type';
import moment from 'moment';
import { APP_NAVIGATION } from '../../../constants/navigation';

const { width } = Dimensions.get('window');
const column = 2;
const margin = 16;
const SIZE = (width - (margin * column * 2 - 4)) / column;
const SIZEFULL = width - (32 + 0.05 * width - 6);
const SearchCategory = (props: IProps) => {
  const [selectedId, setSelectedId] = useState(null);
  const [state, setState] = useState<IState>({
    currentPage: 1,
    typeSort: SORT_BY.SPORT,
    idSort: undefined,
    listHighLevel: [],
    listDataTeam: [],
  });

  const _getNumberStumpById = (typeSort: string | undefined, idSort?: number) => async () => {
    const res = await searchController.getNumberStump(
      1,
      typeSort === SORT_BY.SPORT ? 'teamBySportId' : 'teamByLeagueId',
      idSort,
    );
    console.log('res_data_team', res);

    if (res.status === 1) {
      setState(preState => ({
        ...preState,
        listDataTeam: res.data || [],
      }));
    }
  };

  const _getNumberStump = async (typeSort: string | undefined) => {
    try {
      globalLoading(true);
      let res_hight_level: any = [];
      let res_data_team: any = [];
      if (typeSort === SORT_BY.SPORT || typeSort === SORT_BY.LEAGUE) {
        res_hight_level = await searchController.getNumberStump(1, typeSort);
        res_data_team = await searchController.getNumberStump(1, SORT_BY.TEAM);
      } else {
        res_data_team = await searchController.getNumberStump(1, typeSort);
      }
      if (res_data_team.status === 1) {
        setState(preState => ({
          ...preState,
          listHighLevel: res_hight_level.data || [],
          listDataTeam: res_data_team.data || [],
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  useEffect(() => {
    _getNumberStump(state.typeSort);
  }, [state.typeSort]);

  const _changeSort = (typeSort: string) => () => {
    setState(preState => ({
      ...preState,
      typeSort,
    }));
  };

  const _gotoDiscovery = (item: any, typeSort: string | undefined) => () => {
    const screen = APP_NAVIGATION.SEARCH;
    switch (typeSort) {
      case SORT_BY.SPORT:
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DISCOVERY,
          initial: false,
          params: {
            discoveryDetail: { type: 'sport', ...item },
            screen,
          },
        });
        break;
      case SORT_BY.LEAGUE:
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DISCOVERY,
          initial: false,
          params: {
            discoveryDetail: { type: 'league', ...item },
            screen,
          },
        });
        break;
      case SORT_BY.CITY:
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DISCOVERY,
          initial: false,
          params: {
            discoveryDetail: { type: 'market', ...item },
            screen,
          },
        });
        break;
      case SORT_BY.GAME:
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DISCOVERY,
          initial: false,
          params: { match: item, screen },
        });
        break;
      default:
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DISCOVERY,
          initial: false,
          params: {
            discoveryDetail: { type: 'team', ...item },
            screen,
          },
        });
        break;
    }
  };

  const Item = ({ item, onPress, backgroundColor, textColor }: any) => (
    <View style={[styles.item, backgroundColor]}>
      <TouchableOpacity onPress={_getNumberStumpById(state.typeSort, item.id)} style={styles.itemHighLevel}>
        <Image
          style={styles.sportIcon}
          source={{
            uri:
              (item as ISport)?.icon ||
              'https://res.cloudinary.com/dnsrncdku/image/upload/v1669000241/XMLID_26__wsnkvq.png',
          }}
        />
        <Text style={textColor}>{item.name}</Text>
      </TouchableOpacity>
      <Text
        onPress={_gotoDiscovery(item, state.typeSort)}
        style={{ color: item.id === selectedId ? '#F0F4F6' : '#1EB100' }}>
        {item.amount}
      </Text>
    </View>
  );
  const renderItem = ({ item }: any) => {
    const backgroundColor = item.id === selectedId ? '#1EB100' : '#fff';
    const color = item.id === selectedId ? '#F0F4F6' : '#0F293C';
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  const _renderItem = ({ item }: any) => {
    const createAt = moment(new Date(item.createdAt)).format('DD/MM/YY');
    const typeSort =
      state.typeSort === SORT_BY.SPORT || state.typeSort === SORT_BY.LEAGUE ? SORT_BY.TEAM : state.typeSort;
    return (
      <TouchableOpacity onPress={_gotoDiscovery(item, typeSort)} style={{ paddingLeft: scale(16) }}>
        <ViewHorizontal style={{ width: state.typeSort === SORT_BY.GAME ? SIZEFULL : SIZE }}>
          <Text numberOfLines={1} style={{ marginRight: 4 }}>
            {state.typeSort === SORT_BY.GAME ? `${createAt} - ${item.home} vs ${item.away}` : item.name}
          </Text>

          <Text style={styles.number}>{item.amount}</Text>
        </ViewHorizontal>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.viewSearchHeader}>
        <ViewHorizontal>
          <TouchableOpacity>
            <IconSearch />
          </TouchableOpacity>
          <TextInputStyled placeholder={'Search for Stumps'} />
        </ViewHorizontal>
      </View> */}
      <View style={styles.containerStyled}>
        <View style={styles.listBtnSort}>
          <TouchableOpacity
            style={[styles.btnSort, state.typeSort === SORT_BY.LEAGUE ? styles.btnSortActive : null]}
            onPress={_changeSort(SORT_BY.LEAGUE)}>
            <Text style={[state.typeSort === SORT_BY.LEAGUE ? styles.titleButtonActive : null]}>League</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSort, state.typeSort === SORT_BY.SPORT ? styles.btnSortActive : null]}
            onPress={_changeSort(SORT_BY.SPORT)}>
            <Text style={[state.typeSort === SORT_BY.SPORT ? styles.titleButtonActive : null]}>Sport</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSort, state.typeSort === SORT_BY.TEAM ? styles.btnSortActive : null]}
            onPress={_changeSort(SORT_BY.TEAM)}>
            <Text style={[state.typeSort === SORT_BY.TEAM ? styles.titleButtonActive : null]}>Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSort, state.typeSort === SORT_BY.CITY ? styles.btnSortActive : null]}
            onPress={_changeSort(SORT_BY.CITY)}>
            <Text style={[state.typeSort === SORT_BY.CITY ? styles.titleButtonActive : null]}>City</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSort, state.typeSort === SORT_BY.GAME ? styles.btnSortActive : null]}
            onPress={_changeSort(SORT_BY.GAME)}>
            <Text style={[state.typeSort === SORT_BY.GAME ? styles.titleButtonActive : null]}>Game</Text>
          </TouchableOpacity>
        </View>
        {state.typeSort === SORT_BY.SPORT || state.typeSort === SORT_BY.LEAGUE ? (
          <View style={styles.listItemStyled}>
            <FlatList
              data={state.listHighLevel}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id}
              extraData={selectedId}
              style={{ height: scale(155) }}
            />
          </View>
        ) : null}
        {/* <ScrollView style={{ marginBottom: scale(16) }}> */}
        {state.typeSort === SORT_BY.GAME ? (
          <FlatList
            key={'game'}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={state.listDataTeam ?? []}
            renderItem={_renderItem}
            style={styles.searchList}
            keyExtractor={(item: any) => item.id}
          />
        ) : (
          <FlatList
            key={'list'}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={state.listDataTeam ?? []}
            renderItem={_renderItem}
            style={styles.searchList}
            keyExtractor={(item: any) => item.id}
          />
        )}
        {/* </ScrollView> */}
      </View>
    </View>
  );
};
export default React.memo(SearchCategory);
