import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
type StyleProps = {
  color?: string;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
export const ViewWrapStyled = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: ${scale(40)}px;
`;
export const TextMessageStyled = styled.Text`
  text-align: center;
  color: ${Colors.DarkGray};
`;

export const ImageStyled = styled(FastImage)`
  width: ${scale(64)}px;
  height: ${scale(64)}px;
  border-radius: ${scale(64)}px;
`;
export const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.dark};
  font-size: ${scale(14)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  padding-vertical: ${scale(5)}px;
  text-align: center;
`;
export default styles;
