import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProp } from './Profile.prop';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    paddingRight: scale(10),
  },
  tabBarText: {
    fontSize: scale(14),
    lineHeight: scale(16),
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownStyle: {
    width: scale(190),
    height: scale(40),
    backgroundColor: Colors.White,
    borderColor: Colors.Background,
  },
  placeholderStyle: {
    color: Colors.Black,
    textAlign: 'center',
  },
  listItemContainerStyle: {
    width: scale(190),
    borderTopWidth: scale(1),
    borderColor: Colors.Background,
  },
  listItemLabelStyle: {
    color: Colors.Black,
    marginLeft: scale(15),
  },
  dropDownContainerStyle: {
    width: scale(190),
    borderWidth: scale(1),
    borderTopWidth: scale(0),
    borderRadius: scale(20),
    backgroundColor: Colors.white,
    borderColor: Colors.Background,
  },
  viewIconFollow: {
    borderColor: Colors.Background3,
    borderWidth: scale(1),
    borderRadius: scale(6),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(6),
  },
  viewIconUnFollow: {
    borderColor: Colors.dark,
    borderWidth: scale(1),
    borderRadius: scale(6),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(6),
  },
});

export const ViewMainProfileStyled = styled.View`
  padding: 0 ${scale(24)}px;
  margin-top: ${scale(10)}px;
  flex: 1;
`;
export const ViewMainInformationStyled = styled.View`
  flex-direction: row;
`;
export const ViewAvatarStyled = styled.View`
  margin-right: ${scale(16)}px;
`;
export const AvatarStyled = styled(FastImage)`
  width: ${scale(100)}px;
  height: ${scale(100)}px;
  border-radius: ${scale(50)}px;
`;
export const ViewButtonStyled = styled.View`
  justify-content: space-between;
  margin-top: ${scale(9)}px;
`;
export const ButtonStyled = styled.TouchableOpacity<StyleProp>`
  background-color: ${props => props.backgroundColor || Colors.Background3};
  border-radius: ${scale(50)}px;
  height: ${scale(35)}px;
  width: ${scale(120)}px;
  justify-content: center;
`;

export const ButtonTextStyled = styled.Text`
  color: ${Colors.White};
  font-size: ${scale(13)}px;
  text-align: center;
`;

export const MessageButtonStyled = styled.TouchableOpacity`
  background-color: transparent;
  border-radius: ${scale(6)}px;
  height: ${scale(30)}px;
  width: ${scale(120)}px;
  justify-content: center;
  border-width: ${scale(1)}px;
  border-color: ${Colors.dark};
`;

export const MessageButtonTextStyled = styled.Text`
  color: ${Colors.dark};
  font-size: ${scale(13)}px;
  text-align: center;
`;

export const ViewNameStyled = styled.View`
  flex: 1;
`;
export const ViewPrimaryNameStyled = styled.View``;
export const ViewTagNameStyled = styled.View`
  margin-top: ${scale(-5)}px;
`;

export const TextFollowGroupStyled = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
export const ViewDescriptionStyled = styled.View`
  margin-vertical: ${scale(10)}px;
`;
export const ViewFollowStyled = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const HorizontalRuleStyled = styled.View`
  border-bottom-color: ${Colors.Dark_Gray1};
  border-bottom-width: ${scale(1)}px;
  margin-top: ${scale(15)}px;
  margin-bottom: ${scale(15)}px;
`;
export const ViewMyStumpStyled = styled.View`
  flex: 2;
  margin-top: ${scale(18)}px;
  border-top-width: 1px;
  border-color: ${Colors.DarkGray};
`;
export const ViewStumpTabStyled = styled.View`
  flex-direction: row;
`;
export const ViewListStumpStyled = styled.ScrollView`
  margin-top: ${scale(5)}px;
  width: 100%;
`;

export const TextPrimaryNameStyled = styled.Text`
  font-size: ${scale(24)}px;
  text-transform: capitalize;
  font-family: Lexend-Bold;
`;
export const TextTagNameStyled = styled.Text`
  font-size: ${scale(15)}px;
  line-height: ${scale(22)}px;
  color: ${Colors.Black};
  margin-top: ${scale(4)}px;
`;
export const TextDescriptionStyled = styled.Text`
  color: ${Colors.Dark_Gray1};
  font-size: ${scale(14)}px;
`;
export const TextFollowStyled = styled.Text`
  color: ${Colors.Black};
  margin-right: ${scale(16)}px;
  margin-left: ${scale(8)}px;
  font-size: ${scale(13)}px;
  font-weight: 700;
  line-height: ${scale(16)}px;
`;
export const TextNumberFollowStyled = styled.Text`
  font-size: ${scale(17)}px;
  font-family: Lexend-Bold;
  line-height: ${scale(22)}px;
`;
export const TextStumpTabStyled = styled.Text`
  color: ${Colors.Dark_Gray1};
  margin-right: ${scale(15)}px;
`;
