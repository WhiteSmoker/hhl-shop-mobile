import { SURVEY_FAV_NAVIGATION } from '@/constants/navigation';
import { SurveyFavoriteComponent } from '@/screens';
import { SurveyMarketsTeamsComponent } from '@/screens/SurveyFavorite/SurveyMarketsTeams.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StumpHeader from './headers/StumpHeader';

export type SurveyStackParam = {
  [SURVEY_FAV_NAVIGATION.SPORTS_LEAGUES]: undefined;
  [SURVEY_FAV_NAVIGATION.MARKETS_TEAMS]: undefined;
};
const Stack = createNativeStackNavigator<SurveyStackParam>();

const SurveyNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SURVEY_FAV_NAVIGATION.SPORTS_LEAGUES}
      screenOptions={{ headerShown: true, animation: 'slide_from_right' }}>
      <Stack.Screen
        name={SURVEY_FAV_NAVIGATION.SPORTS_LEAGUES}
        component={SurveyFavoriteComponent}
        options={({ route, navigation }) => ({
          header: () => <StumpHeader navigation={navigation} showArrow={false} route={route} isGoBack={true} />,
        })}
      />
      <Stack.Screen
        name={SURVEY_FAV_NAVIGATION.MARKETS_TEAMS}
        component={SurveyMarketsTeamsComponent}
        options={({ route, navigation }) => ({
          header: () => <StumpHeader navigation={navigation} showArrow={true} route={route} isGoBack={true} />,
        })}
      />
    </Stack.Navigator>
  );
};
export default React.memo(SurveyNavigator);
