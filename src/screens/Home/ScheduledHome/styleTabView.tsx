import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const stylesTabView = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(3),
  },
  tabBar: {
    height: scale(50),
    backgroundColor: Colors.White,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: scale(13),
    color: Colors.Background2,
    textAlign: 'center',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
