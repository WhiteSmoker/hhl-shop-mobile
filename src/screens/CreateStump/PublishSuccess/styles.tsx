import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const styles = StyleSheet.create({
  animateSuccessView: {
    backgroundColor: Colors.successColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(200),
    width: scale(125),
    height: scale(125),
    position: 'absolute',
  },
});
export const TextTitleStyled = styled.Text`
  color: ${Colors.dark};
  font-size: ${scale(17)}px;
  line-height: ${scale(16)}px;
  padding-vertical: ${scale(10)}px;
  margin-top: ${scale(30)}px;
`;
export const BannerTextStyled = styled.Text`
  color: ${Colors.JungleGreen2};
  font-family: Lexend-Bold;
  font-size: ${scale(20)}px;
  line-height: ${scale(52)}px;
  padding-vertical: ${scale(10)}px;
  text-transform: capitalize;
`;

export const SmallTextStyled = styled.Text`
  color: ${Colors.Dark_Gray1};
  font-size: ${scale(12)}px;
  line-height: ${scale(48)}px;
  font-weight: normal;
  margin-horizontal: ${scale(10)}px;
`;
export const NomarlTextStyled = styled.Text<StyleProps>`
  color: ${Colors.Black};
  font-size: ${scale(14)}px;
  line-height: ${scale(48)}px;
  font-weight: normal;
  text-transform: uppercase;
  margin-left: ${(props: StyleProps) => scale(props.marginLeft || 0)}px;
`;

export const ViewStyled = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: ${scale(24)}px;
  padding-bottom: ${scale(10)}px;
  justify-content: center;
`;

export const ViewShareLinkStyled = styled.TouchableOpacity`
  background-color: ${Colors.White};
  border-radius: ${scale(8)}px;
  width: 90%;
  align-items: center;
  height: ${scale(48)}px;
`;

export const CreateTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: #c8e2d4;
  border-radius: ${scale(8)}px;
  width: 50%;
  height: ${scale(48)}px;
  align-self: center;
  align-items: center;
  margin-top: ${scale(35)}px;
  flex-direction: row;
  align-self: center;
  justify-content: center;
`;

export const ViewSuccessContainerStyled = styled.SafeAreaView`
  background-color: ${Colors.successColorOpacity};
  width: ${scale(248)}px;
  height: ${scale(248)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${scale(200)}px;
`;

export const ViewIconSuccessStyled = styled.View`
  background-color: ${Colors.white};
  border-radius: ${scale(125)}px;
`;

export const CenterViewStyled = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
