import { Colors } from '@/theme/colors';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const _padding = (index: number) => {
  switch (index) {
    case 0:
      return { marginRight: scale(6), marginBottom: scale(6) };
    case 1:
      return { marginLeft: scale(6), marginBottom: scale(6) };
    case 2:
      return { marginRight: scale(6), marginTop: scale(6) };
    case 3:
      return { marginLeft: scale(6), marginTop: scale(6) };
    default:
      return {};
  }
};

export const ViewContainerCard = styled.View`
  flex-direction: row;
  background-color: ${Colors.white};
`;

export const AvatarContainerStyled = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${scale(44 + 44 + 24 + 24)}px;
  justify-content: flex-start;
`;

export const InformationCardStyled = styled.View`
  flex: 2;
`;

export const ListParticipantStyled = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${scale(6)}px;
  width: 90%;
  align-items: center;
`;

export const ImageStyled = styled(FastImage)<StyleProps>`
  width: ${scale(88)}px;
  height: ${scale(88)}px;
  border-radius: ${scale(88)}px;
`;

export const ImageSmallStyled = styled(FastImage)<StyleProps>`
  width: ${scale(44)}px;
  height: ${scale(44)}px;
  border-radius: ${scale(44)}px;
`;

export const TextTitleStyled = styled.Text<StyleProps>`
  width: ${(props: StyleProps) => (props.width ? `${props.width}%` : 'auto')};
  font-size: ${scale(17)}px;
  line-height: ${scale(18)}px;
  color: ${Colors.blackOriginal};
`;

export const TextParticipantStyled = styled.Text`
  font-size: ${scale(11)}px;
  font-weight: normal;
  line-height: ${scale(16)}px;
  text-transform: lowercase;
  color: ${Colors.Background2};
  margin-right: ${scale(6)}px;
  width: auto;
  font-style: italic;
`;

export const TextGuestStyled = styled.Text`
  font-size: ${scale(11)}px;
  font-weight: normal;
  line-height: ${scale(16)}px;
  color: ${Colors.Background2};
  margin-right: ${scale(6)}px;
  width: auto;
  font-style: italic;
`;

export const ViewStartStyled = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${scale(12)}px;
`;

export const TouchStartStyled = styled.TouchableOpacity<StyleProps>`
  padding-vertical: ${scale(6)}px;
  padding-horizontal: ${scale(12)}px;
  margin-right: ${scale(8)}px;
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Light_Blue};
  border-radius: ${scale(12)}px;
  height: ${scale(30)}px;
  justify-content: center;
`;

export const TextStartStyled = styled.Text`
  font-size: ${scale(11)}px;
  font-weight: normal;
  line-height: ${scale(18)}px;
  color: ${Colors.White};
`;

export const TextDurationStyled = styled.Text<StyleProps>`
  font-size: ${scale(11)}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'normal'};
  line-height: ${scale(18)}px;
  color: ${(props: StyleProps) => props.color || Colors.Soft_Blue};
  margin-right: ${scale(3)}px;
  margin-left: ${(props: StyleProps) => scale(props.marginLeft || 0)}px;
  width: auto;
`;
