import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
type StyleProps = {
  color?: string;
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    height: scale(44),
    backgroundColor: Colors.White,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: scale(14),
    color: Colors.Background2,
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFriendVertical: {
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_Gray,
  },
  btnFollowing: {
    borderWidth: scale(1),
    borderColor: Colors.Background3,
    borderRadius: scale(6),
    marginLeft: scale(6),
    backgroundColor: Colors.Background3,
  },
  btnFollower: {
    borderWidth: scale(1),
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
    borderRadius: scale(6),
    marginLeft: scale(6),
  },
  viewFlex3: {
    alignItems: 'center',
    flex: 3,
    flexDirection: 'row',
  },
  viewInput: {
    flexDirection: 'row',
    paddingVertical: scale(8),
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White,
  },
  viewJoin: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Very_Light_Gray,
  },
  viewSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: scale(12),
    paddingVertical: scale(3),
    backgroundColor: Colors.Very_Light_Gray,
    marginLeft: '5%',
    borderRadius: scale(10),
  },
});

export const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.dark};
  font-size: ${scale(14)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  padding-vertical: ${scale(5)}px;
  text-align: center;
`;

export const ImageStyled = styled(FastImage)`
  width: ${scale(64)}px;
  height: ${scale(64)}px;
  border-radius: ${scale(64)}px;
`;

export const SearchTextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
  flex: 1;
`;
export const TextJoinStyled = styled.Text`
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  color: ${Colors.Black};
`;
