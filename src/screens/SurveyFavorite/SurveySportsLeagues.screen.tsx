import { APP_NAVIGATION, SURVEY_FAV_NAVIGATION } from '@/constants';
import CheckBoxC from '@/containers/components/CheckboxComponent';
import { TextComponent } from '@/containers/components/TextComponent';
import { TAppDispatch, TRootState } from '@/stores';
import { setEmptyListTeam, setSelectedLeague, setSelectedSport } from '@/stores/reducers';
import { fetchListLeague, fetchListSport } from '@/stores/thunks/survey.thunk';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { TextLoginStyled } from '../Login/Login.style';
import styles, { TextSubTitleStyled, ViewBtnSurveyStyled, ViewHorizontal } from './SurveyFavorite.style';
import { ISurveyProps } from './types/SurveyFavorite.types';

export const SurveyFavoriteComponent = (props: ISurveyProps) => {
  const dispatch = useDispatch<TAppDispatch>();
  const [sportFav, setSportFav] = React.useState<number[]>([]);
  const [leagueFav, setLeagueFav] = React.useState<number[]>([]);

  const { listSport, listLeague } = useSelector((state: TRootState) => state.surveyState);

  React.useEffect(() => {
    dispatch(fetchListSport());
    dispatch(fetchListLeague());
  }, [dispatch]);

  const handleFavSport = (id: number) => () => {
    if (sportFav.includes(id)) {
      setSportFav(sportFav.filter(e => e !== id));
    } else {
      setSportFav([...sportFav!, id]);
    }
  };

  const handleFavLeague = (id: number) => () => {
    if (leagueFav.includes(id)) {
      setLeagueFav(leagueFav.filter(e => e !== id));
    } else {
      setLeagueFav([...leagueFav!, id]);
    }
  };

  const handleBtnNext = () => {
    dispatch(setSelectedSport(sportFav));
    dispatch(setSelectedLeague(leagueFav));
    dispatch(setEmptyListTeam([]));
    props.navigation.push(SURVEY_FAV_NAVIGATION.MARKETS_TEAMS);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View>
          <TextSubTitleStyled>Choose your favorite sport(s)</TextSubTitleStyled>
          <ViewHorizontal>
            {listSport?.data?.map((e: any) => (
              <CheckBoxC
                key={e.id}
                title={
                  <View style={styles.sportContainer}>
                    <Image style={styles.sportIcon} source={{ uri: e.icon }} />
                    <TextComponent style={styles.textStyle}>{e.name}</TextComponent>
                  </View>
                }
                iconRight={true}
                checked={sportFav.includes(e.id)}
                onPress={handleFavSport(e.id)}
              />
            ))}
          </ViewHorizontal>
        </View>
        <View>
          <TextSubTitleStyled>Choose your favorite league(s)</TextSubTitleStyled>
          <ViewHorizontal>
            {listLeague?.data?.map((e: any) => (
              <CheckBoxC
                key={e.id}
                title={e.name}
                iconRight={true}
                checked={leagueFav.includes(e.id)}
                onPress={handleFavLeague(e.id)}
              />
            ))}
          </ViewHorizontal>
        </View>
      </KeyboardAwareScrollView>
      <ViewBtnSurveyStyled onPress={handleBtnNext} backgroundColor={Colors.Background}>
        <TextLoginStyled>Next</TextLoginStyled>
      </ViewBtnSurveyStyled>
    </View>
  );
};
