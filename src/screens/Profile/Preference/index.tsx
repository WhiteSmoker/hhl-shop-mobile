import { IconChevronDown2, IconChevronUp, IconTickRadio, IconUntickRadio } from '@/assets/icons/Icon';
import { DragModal } from '@/containers/components/DragModalComponent';
import { TAppDispatch, TRootState } from '@/stores';
import {
  fetchListLeague,
  fetchListMarket,
  fetchListSport,
  fetchListTeam,
  fetchUserSurveyInfo,
  updateUserSurvey,
} from '@/stores/thunks/survey.thunk';
import { ILeague, IMarket, ISport, ITeam, ITeamResponse } from '@/stores/types/survey.type';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';
import { IProps } from '../Profile.prop';
import styles, { TextPreference } from './index.style';

interface IDropdown {
  sports: boolean;
  leagues: boolean;
  markets: boolean;
  teams: boolean;
}

interface ISelectedPreference {
  sports: number[];
  leagues: number[];
  markets: number[];
  teams: number[];
}

type IListType = 'sports' | 'leagues' | 'markets' | 'teams';

const Preference: React.FC<IProps> = props => {
  const dispatch = useDispatch<TAppDispatch>();

  const dragModalRef = React.useRef<any>([]);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [showDropdown, setShowDropdown] = React.useState<IDropdown>({
    sports: false,
    leagues: false,
    markets: false,
    teams: false,
  });
  const [selected, setSelected] = React.useState<ISelectedPreference>({
    sports: [],
    leagues: [],
    markets: [],
    teams: [],
  });

  const [heightModal, setHeightModal] = React.useState('MAX_HEIGHT');

  const { listSport, listLeague, listMarket, listTeam, userSurveyInfo } = useSelector(
    (state: TRootState) => state.surveyState,
  );

  const { userInfo } = useSelector((state: TRootState) => state.userState);

  React.useEffect(() => {
    dispatch(fetchListSport());
    dispatch(fetchListLeague());
    dispatch(fetchListMarket());
    dispatch(fetchUserSurveyInfo());
  }, [dispatch]);

  React.useEffect(() => {
    if (userSurveyInfo?.data) {
      setSelected({
        sports: userSurveyInfo?.data.sports.map(sport => sport.id),
        leagues: userSurveyInfo?.data.leagues.map(league => league.id),
        markets: userSurveyInfo?.data.markets.map(market => market.id),
        teams: userSurveyInfo?.data.teams.map(team => team.id),
      });
    }
  }, [userSurveyInfo?.data]);

  React.useEffect(() => {
    dispatch(fetchListTeam(selected?.leagues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.leagues.length]);

  const showModal = async (index: number) => {
    dragModalRef.current[index]?.show();
  };

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY },
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const handleStatusDropdown = (list: IListType) => () => {
    setShowDropdown({ ...showDropdown, [list]: !showDropdown[list] });
  };

  const handleSelectPreference = React.useCallback(
    (item: any, index: number, list: IListType) => {
      if (list === 'teams') {
        showModal(index);
      } else {
        if (selected[list].includes(item.id)) {
          const filterSelected = selected[list].filter(e => e !== item.id);
          setSelected(prev => ({ ...prev, [list]: filterSelected }));
        } else {
          selected?.[list].push(item.id);
          setSelected(prev => ({ ...prev }));
        }
      }
    },
    [selected],
  );

  const handleSeletedTeam = React.useCallback(
    (item: any) => {
      if (selected.teams.includes(item.id)) {
        const filterSelected = selected.teams.filter(e => e !== item.id);
        setSelected(prev => ({ ...prev, teams: filterSelected }));
      } else {
        selected.teams.push(item.id);
        setSelected(prev => ({ ...prev }));
      }
    },
    [selected.teams],
  );

  const handeSaveChange = () => {
    const payload = {
      sportId: selected.sports,
      leagueId: selected.leagues,
      marketId: selected.markets,
      teamId: selected.teams,
      email: userInfo?.email,
    };
    dispatch(
      updateUserSurvey({
        payload,
        onSuccess: () => {
          props.navigation.goBack();
        },
      }),
    );
  };

  const handleCurrentHeight = (currentHeight: string) => {
    setHeightModal(currentHeight);
  };

  const renderListTeam = React.useCallback(
    ({ item, index }: { item: ITeam; index: number }) => (
      <TouchableOpacity key={index} onPress={() => handleSeletedTeam(item)} style={[styles.optionsContainer]}>
        <TextPreference fontSize={14} lineHeight={19}>
          {item.name}
        </TextPreference>
        {selected.teams.includes(item.id) ? <IconTickRadio /> : <IconUntickRadio />}
      </TouchableOpacity>
    ),
    [handleSeletedTeam, selected.teams],
  );

  const renderListItem = React.useCallback(
    ({ item, index }: { item: ISport | ILeague | IMarket | ITeamResponse; index: number }, list: IListType) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelectPreference(item, index, list)}
          style={list === 'teams' ? styles.optionsTeamsContainer : styles.optionsContainer}>
          <View style={commonStyles.flexRow}>
            {(list === 'sports' || list === 'leagues') && (
              <Image
                style={styles.sportIcon}
                source={{
                  uri: (item as ISport).icon,
                }}
              />
            )}
            {list === 'teams' ? (
              <TextPreference fontSize={14} lineHeight={19} paddingLeft={16}>
                {(item as ITeamResponse)?.data.leagueName}
              </TextPreference>
            ) : (
              <TextPreference
                fontSize={14}
                lineHeight={24}
                color={
                  selected[list]?.includes((item as ISport | ILeague | IMarket).id)
                    ? Colors.blackOriginal
                    : Colors.Light_grey5
                }>
                {(item as ISport | ILeague | IMarket)?.name}
              </TextPreference>
            )}
          </View>
          {list === 'teams' ? (
            <View style={commonStyles.pd_right_16}>
              <IconChevronDown2 />
            </View>
          ) : selected[list]?.includes((item as ISport | ILeague | IMarket)?.id) ? (
            <IconTickRadio />
          ) : (
            <IconUntickRadio />
          )}
          {list === 'teams' && (
            <DragModal
              ref={el => (dragModalRef.current[index] = el)}
              scrollY={scrollY}
              callback={currentHeight => handleCurrentHeight(currentHeight)}>
              <View style={[commonStyles.pd_horizontal_24, commonStyles.flex_1]}>
                <TextPreference fontSize={14} lineHeight={19} alignSelf="center">
                  {(item as ITeamResponse)?.data.leagueName} Teams
                </TextPreference>
                <Animated.FlatList
                  data={(item as ITeamResponse)?.data.teams}
                  renderItem={renderListTeam}
                  onScroll={handleScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: heightModal === 'MAX_HEIGHT' ? scale(30) : scale(200) }}
                />
              </View>
            </DragModal>
          )}
        </TouchableOpacity>
      );
    },
    [handleScroll, handleSelectPreference, heightModal, renderListTeam, scrollY, selected],
  );

  const listEmptyComponent = React.useCallback(
    () => (
      <View style={[commonStyles.containerView]}>
        <TextPreference fontSize={14} lineHeight={19} color={Colors.Light_grey5}>
          Please choose your favorite team(s) first !
        </TextPreference>
      </View>
    ),
    [],
  );

  const flatList = React.useCallback(
    (data: any, list: IListType) => (
      <Animated.FlatList
        data={data}
        extraData={data}
        renderItem={({ item, index }) => renderListItem({ item, index }, list)}
        ListEmptyComponent={listEmptyComponent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    ),
    [listEmptyComponent, renderListItem],
  );

  return (
    <ContainerStyled>
      <View style={styles.container}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <TextPreference fontSize={18} lineHeight={21}>
            My favorite
          </TextPreference>
          <View style={styles.preferenceContainer}>
            <TouchableOpacity onPress={handleStatusDropdown('sports')} style={styles.preferenceBtn}>
              <TextPreference fontSize={16} lineHeight={21}>
                Sport(s)
              </TextPreference>
              {showDropdown.sports ? <IconChevronUp /> : <IconChevronDown2 />}
            </TouchableOpacity>
            {showDropdown.sports && flatList(listSport.data, 'sports')}
          </View>

          <View style={styles.preferenceContainer}>
            <TouchableOpacity onPress={handleStatusDropdown('leagues')} style={styles.preferenceBtn}>
              <TextPreference fontSize={16} lineHeight={21}>
                League(s)
              </TextPreference>
              {showDropdown.leagues ? <IconChevronUp /> : <IconChevronDown2 />}
            </TouchableOpacity>
            {showDropdown.leagues && flatList(listLeague.data, 'leagues')}
          </View>

          <View style={styles.preferenceContainer}>
            <TouchableOpacity onPress={handleStatusDropdown('markets')} style={styles.preferenceBtn}>
              <TextPreference fontSize={16} lineHeight={21}>
                Market(s)
              </TextPreference>
              {showDropdown.markets ? <IconChevronUp /> : <IconChevronDown2 />}
            </TouchableOpacity>
            {showDropdown.markets && flatList(listMarket.data, 'markets')}
          </View>

          <View style={styles.preferenceContainer}>
            <TouchableOpacity onPress={handleStatusDropdown('teams')} style={styles.preferenceBtn}>
              <TextPreference fontSize={16} lineHeight={21}>
                Team(s)
              </TextPreference>
              {showDropdown.teams ? <IconChevronUp /> : <IconChevronDown2 />}
            </TouchableOpacity>
            {showDropdown.teams && flatList(listTeam, 'teams')}
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity onPress={handeSaveChange} style={styles.btnSurvey}>
          <TextPreference fontSize={16} lineHeight={21} color={Colors.white}>
            Save changes
          </TextPreference>
        </TouchableOpacity>
      </View>
    </ContainerStyled>
  );
};

export default Preference;
