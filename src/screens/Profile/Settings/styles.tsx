import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

interface StyledProps {
  paddingHorizontal?: number;
  paddingTop?: number;
  color?: string;
}
export const GroupContainerStyled = styled.View<StyledProps>`
  padding-left: ${scale(16)}px;
  padding-right: ${scale(16)}px;
`;
export const GroupViewStyled = styled.View<StyledProps>`
  width: 100%;
  padding-top: ${props => scale(props.paddingTop || 14)}px;
  border-bottom-width: ${scale(1)}px;
  border-style: solid;
  border-bottom-color: ${Colors.Alto};
`;
export const TitleStyled = styled.Text`
  margin-bottom: ${scale(22)}px;
  font-style: normal;
  font-family: Lexend-Bold;
  font-size: ${scale(16)}px;
  line-height: ${scale(19)}px;
  color: ${Colors.Black};
`;

export const GroupTouchStyled = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: ${scale(12)}px;
`;

export const SubTitleStyled = styled.Text<StyledProps>`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(19.69)}px;
  color: ${props => props.color || Colors.Black};
`;

export const LogOutStyled = styled.TouchableOpacity`
  margin-top: ${scale(32)}px;
  margin-bottom: ${scale(48)}px;
  background-color: ${Colors.LightGray};
  border-radius: ${scale(5)}px;
  padding-vertical: ${scale(14)}px;
  padding-horizontal: ${scale(11)}px;
  width: ${scale(155)}px;
  align-self: center;
`;
export const TextLogOutStyled = styled.Text`
  width: ${scale(136)}px;
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  color: ${Colors.Red};
  text-align: center;
`;
