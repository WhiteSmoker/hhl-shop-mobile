import { RouteProp } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { styles } from './styles';
import RenderListFollow from './RenderListFollow';
import { ProfileStackParam } from '@/navigators/ProfileNavigator';
import { PROFILE_NAVIGATION } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/theme/colors';
import { ApiRoutes } from '@/controllers/api-routes';
import { TextComponent } from '@/containers/components/TextComponent';

const TAB = {
  FOLLOWING: 'Following',
  FOLLOWER: 'Followers',
};
interface Props {
  navigation: any;
  route: RouteProp<ProfileStackParam, PROFILE_NAVIGATION.FOLLOW_SCREEN>;
}

const LazyPlaceholder = ({ route }: any) => (
  <View style={styles.scene}>
    <Text>Loading {route.title}…</Text>
  </View>
);

const FollowScreen = (props: Props) => {
  const [index, setIndex] = React.useState(props.route.params?.indexActive ?? 0);
  const userInfo = useAuth();
  const layout = useWindowDimensions();

  const userIdRoute = useMemo(() => props.route?.params?.userIdRoute, [props.route?.params?.userIdRoute]);
  const userInfoRoute = useMemo(() => props.route?.params?.userInfo, [props.route?.params?.userInfo]);

  const [routes] = React.useState([
    { key: TAB.FOLLOWING, title: TAB.FOLLOWING },
    { key: TAB.FOLLOWER, title: TAB.FOLLOWER },
  ]);

  const _renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case TAB.FOLLOWER:
        return (
          <RenderListFollow
            navigation={props.navigation}
            url={ApiRoutes.user.getListFollower}
            field={'followers'}
            myId={userInfo?.id}
            viewingUserId={userIdRoute || userInfo?.id}
            listFollowing={userInfo?.listFollowing?.rows || []}
            textNoFollow="You have no follower."
          />
        );
      case TAB.FOLLOWING:
        return (
          <RenderListFollow
            navigation={props.navigation}
            url={ApiRoutes.user.getListFollowing}
            field={'following'}
            myId={userInfo?.id}
            viewingUserId={userIdRoute || userInfo?.id}
            listFollowing={userInfo?.listFollowing?.rows || []}
            textNoFollow="You have no following."
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
        renderLabel={({ route, focused, color }) => {
          let count = 0;
          if (route.title === TAB.FOLLOWER) {
            count = userInfoRoute?.listFollowers?.count || 0;
          }
          if (route.title === TAB.FOLLOWING) {
            count = userInfoRoute?.listFollowing?.count || 0;
          }
          return (
            <TextComponent style={{ ...styles.tabBarText, color: !focused ? Colors.DarkGray : Colors.Background2 }}>
              {`${count} ${route.title}`}
            </TextComponent>
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
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderLazyPlaceholder={_renderLazyPlaceholder}
    />
  );
};

export default React.memo(FollowScreen);
