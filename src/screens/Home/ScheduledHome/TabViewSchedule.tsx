import { HOME_NAVIGATION } from '@/constants';
import { TextComponent } from '@/containers/components/TextComponent';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { HomeStackParam } from '@/navigators/HomeNavigator';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { Colors } from '@/theme/colors';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import CommonTabSchedule from './CommonTab';
import { stylesTabView } from './styleTabView';

const TAB = {
  HOST: 'My stumps',
  PARTICIPATED_IN: 'Accepted stumps',
};

export interface Props {
  navigation: any;
  route: RouteProp<HomeStackParam, HOME_NAVIGATION.SCHEDULEDHOME>;
}

const LazyPlaceholder = ({ route }: { route: Route }) => (
  <View style={stylesTabView.scene}>
    <Text>Loading {route.title}…</Text>
  </View>
);

const TabViewSchedule = (props: Props) => {
  const [index, setIndex] = React.useState(0);
  const { count, countAccepted } = useAppSelector(rootState => rootState.counterState);
  const contentContainerStyle = usePaddingBottomFlatlist();
  const dispatch = useAppDispatch();

  const layout = useWindowDimensions();

  const [routes] = React.useState([
    { key: TAB.HOST, title: TAB.HOST },
    { key: TAB.PARTICIPATED_IN, title: TAB.PARTICIPATED_IN },
  ]);

  useEffect(() => {
    dispatch(getNumberConversation());
  }, [dispatch]);

  useEffect(() => {
    if (!props.route.params?.tab) {
      return;
    }
    if (props.route.params?.tab === 'scheduleParticipatedIn') {
      setIndex(1);
    } else {
      setIndex(0);
    }
  }, [props.route.params?.tab]);

  const onChangeIndex = (idx: number) => {
    props.navigation.setParams({ tab: idx ? 'scheduleParticipatedIn' : 'schedule' });
  };

  const _renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case TAB.HOST:
        return (
          <CommonTabSchedule
            navigation={props.navigation}
            contentContainerStyle={contentContainerStyle}
            field={'schedule'}
            url={'stump/getConversationScheduled'}
          />
        );
      case TAB.PARTICIPATED_IN:
        return (
          <CommonTabSchedule
            navigation={props.navigation}
            contentContainerStyle={contentContainerStyle}
            field={'scheduleParticipatedIn'}
            url={'stump/getListAcceptedConv'}
          />
        );
      default:
        return null;
    }
  };

  const _renderLazyPlaceholder = ({ route }: { route: Route }) => <LazyPlaceholder route={route} />;

  const _renderTabBar = (tabBarProps: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    return (
      <TabBar
        {...tabBarProps}
        style={stylesTabView.tabBar}
        tabStyle={stylesTabView.tabStyle}
        pressColor={'transparent'}
        indicatorStyle={{ backgroundColor: Colors.Background2 }}
        renderLabel={({ route, focused }) => {
          let countTabView = 0;
          if (route.key === TAB.HOST) {
            countTabView = count;
          }
          if (route.key === TAB.PARTICIPATED_IN) {
            countTabView = countAccepted;
          }
          return (
            <View>
              <TextComponent
                style={{ ...stylesTabView.tabBarText, color: !focused ? Colors.DarkGray : Colors.Background2 }}>
                {`${route.title}`}
              </TextComponent>
              <TextComponent
                style={{ ...stylesTabView.tabBarText, color: !focused ? Colors.DarkGray : Colors.Background2 }}>
                {`(${countTabView})`}
              </TextComponent>
            </View>
          );
        }}
        activeColor={Colors.Background2}
      />
    );
  };
  return (
    <TabView
      lazy={true}
      navigationState={{ index, routes }}
      renderScene={_renderScene}
      renderTabBar={_renderTabBar}
      onIndexChange={onChangeIndex}
      initialLayout={{ width: layout.width }}
      renderLazyPlaceholder={_renderLazyPlaceholder}
    />
  );
};

export default React.memo(TabViewSchedule);
