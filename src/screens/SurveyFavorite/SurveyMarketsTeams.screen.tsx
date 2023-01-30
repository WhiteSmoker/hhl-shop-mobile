import { APP_NAVIGATION, HOME_NAVIGATION, ROOT_ROUTES } from '@/constants';
import DropDownC from '@/containers/components/DropDownComponent';
import { selectAuth, TAppDispatch, TRootState } from '@/stores';
import { setEmptyList } from '@/stores/reducers';
import { fetchDataFirstTime } from '@/stores/thunks/auth.thunk';
import { fetchListMarket, fetchListTeam, updateUserSurvey } from '@/stores/thunks/survey.thunk';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import CheckBoxC from '@/containers/components/CheckboxComponent/index';
import { TextLoginStyled } from '../Login/Login.style';
import styles, { TextSubTitleStyled, ViewBtnSurveyStyled, ViewHorizontal } from './SurveyFavorite.style';
import { ISurveyProps } from './types/SurveyFavorite.types';
import { TextComponent } from '@/containers/components/TextComponent';

export const SurveyMarketsTeamsComponent = (props: ISurveyProps) => {
  const dispatch = useDispatch<TAppDispatch>();
  const [marketFav, setMarketFav] = React.useState<number[]>([]);
  const [teamFav, setTeamFav] = React.useState<object[]>([]);

  const { listMarket, listTeam, selectedSport, selectedLeague } = useSelector((state: TRootState) => state.surveyState);

  const registerState = useSelector(selectAuth);

  React.useEffect(() => {
    dispatch(fetchListMarket());
  }, [dispatch]);

  React.useEffect(() => {
    if (selectedLeague) {
      dispatch(fetchListTeam(selectedLeague));
    }
  }, [dispatch, selectedLeague]);

  const handleFavMarket = (id: number) => () => {
    if (marketFav.includes(id)) {
      setMarketFav(marketFav.filter(e => e !== id));
    } else {
      setMarketFav([...marketFav!, id]);
    }
  };

  const handleFavTeam = (team: any, league: string) => {
    const teamFilter = [...teamFav].filter((x: any) => x.league !== league);
    setTeamFav([...teamFilter, { league: league, id: team }]);
  };

  const handleBtnDone = () => {
    const payload = {
      sportId: selectedSport,
      leagueId: selectedLeague,
      marketId: marketFav,
      teamId: teamFav.map((team: any) => team.id).flat(),
      email: registerState.email,
    };
    dispatch(
      updateUserSurvey({
        payload,
        onSuccess: async () => {
          dispatch(setEmptyList([]));
          // await dispatch(fetchDataFirstTime(true));
          props.navigation.navigate(APP_NAVIGATION.HOME, {
            screen: HOME_NAVIGATION.NEW_FEED,
            initial: false,
          });
        },
      }),
    );
  };

  const item = listTeam?.map(team => {
    if (team?.data?.teams.length > 0) {
      return team?.data?.teams?.map((d: any) => ({ league: team.data.leagueName, label: d?.name, value: d?.id }));
    } else {
      return [{ league: team.data.leagueName }];
    }
  });

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <TextSubTitleStyled>Choose your favorite market(s)</TextSubTitleStyled>
        <ViewHorizontal>
          {listMarket?.data?.map((e: any) => (
            <CheckBoxC
              key={e.id}
              title={
                <View style={styles.sportContainer}>
                  <TextComponent style={styles.textStyle}>{e.name}</TextComponent>
                </View>
              }
              iconRight={true}
              checked={marketFav.includes(e.id)}
              onPress={handleFavMarket(e.id)}
            />
          ))}
        </ViewHorizontal>
        <TextSubTitleStyled>Choose your favorite team(s)</TextSubTitleStyled>
        {selectedLeague?.map((_, index) => (
          <DropDownC
            key={index}
            items={item?.[index] || []}
            placeholder={item?.[index]?.[0]?.league}
            onChange={(team, placeholder) => handleFavTeam(team, placeholder)}
          />
        ))}
      </KeyboardAwareScrollView>
      <ViewBtnSurveyStyled onPress={handleBtnDone} backgroundColor={Colors.Background}>
        <TextLoginStyled>Done</TextLoginStyled>
      </ViewBtnSurveyStyled>
    </View>
  );
};
