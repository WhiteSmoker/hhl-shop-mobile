import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { StyleProps } from './Notification.type';
import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';

export const ViewNotificationStyled = styled.TouchableOpacity<StyleProps>`
  flex-direction: row;
  padding: ${scale(18)}px;
  padding-right: ${scale(12)}px;
  border-bottom-width: ${scale(1)}px;
  border-bottom-color: ${Colors.DarkGray};
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Light_grayish_green};
`;
export const ViewIconStyled = styled.View`
  justify-content: flex-start;
  align-items: center;
`;

export const ViewContentStyled = styled.View`
  justify-content: center;
  margin-left: ${scale(10)}px;
  flex: 1;
`;

export const BackgroundIconStyled = styled.View<StyleProps>`
  background-color: ${props => props.backgroundColor || '#808080'};
  width: ${scale(36)}px;
  height: ${scale(36)}px;
  border-radius: ${scale(44)}px;
  justify-content: center;
  align-items: center;
`;

export const HighlightTextStyled = styled.Text<StyleProps>`
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${(props: StyleProps) => props.color || Colors.blackOriginal};
  font-weight: ${(props: StyleProps) => props.fontWeight || 'normal'};
  font-family: ${(props: StyleProps) => (props.fontWeight ? 'Lexend-Medium' : 'Lexend-Regular')};
`;

export const ViewImageStyled = styled.View`
  flex-direction: row;
  margin-right: ${scale(6)}px;
  margin-top: ${scale(4)}px;
`;

export const ImagedStyled = styled(FastImage)<StyleProps>`
  width: ${(props: StyleProps) => scale(props.width || 36)}px;
  height: ${(props: StyleProps) => scale(props.width || 36)}px;
  border-radius: ${(props: StyleProps) => scale(props.width || 36)}px;
`;

export const ViewWrapStyled = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
`;

export const TextEmptyStyled = styled.Text`
  color: ${Colors.DarkGray};
  text-align: center;
`;

//----------------------------------------------------------------
export const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.dark};
  font-size: ${scale(14)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  font-family: Lexend-Regular;
  padding-vertical: ${scale(5)}px;
  text-align: center;
`;

export const styles = StyleSheet.create({
  viewAction_1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  sub_viewAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1.8,
    marginLeft: scale(6),
  },
  viewAction_2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 2,
  },
  viewContent_4: { flex: 4, paddingLeft: scale(10) },
  viewContent_3: { flex: 3, paddingLeft: scale(10) },
  viewSwitch: {
    marginLeft: scale(5),
  },
  viewToggle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: scale(15),
    paddingTop: scale(5),
    flexDirection: 'row',
  },
  btnFollower: {
    borderWidth: scale(1),
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
    borderRadius: scale(6),
    marginLeft: scale(6),
  },
  btnFollowing: {
    borderWidth: scale(1),
    borderColor: Colors.Background3,
    borderRadius: scale(6),
    marginLeft: scale(6),
    backgroundColor: Colors.Background3,
  },
  border: {
    borderWidth: scale(1),
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
    borderRadius: scale(6),
    paddingHorizontal: scale(6),
  },
});
