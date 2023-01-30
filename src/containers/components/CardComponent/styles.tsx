import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const _padding = (index: number) => {
  switch (index) {
    case 0:
      return { marginRight: scale(3), marginBottom: scale(3) };
    case 1:
      return { marginLeft: scale(3), marginBottom: scale(3) };
    case 2:
      return { marginRight: scale(3), marginTop: scale(3) };
    case 3:
      return { marginLeft: scale(3), marginTop: scale(3) };
    default:
      return {};
  }
};

export const styles = StyleSheet.create({
  reactionView: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.AshGrey,
    borderRadius: scale(20),
  },
  avatarBigSize: {
    width: scale(90),
    height: scale(90),
  },
  viewLikeShare: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  textAllComment: { color: '#989898', fontSize: scale(11) },
});

export const ViewContainerCard = styled.View`
  flex-direction: row;
  background-color: ${Colors.white};
  flex: 1;
`;

export const AvatarContainerStyled = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const InformationCardStyled = styled.View`
  flex: 2;
  margin-left: ${scale(18)}px;
`;

export const ViewTitleStyled = styled.View`
  flex-direction: row;
`;

export const ListParticipantStyled = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-vertical: ${scale(6)}px;
`;

export const ImageStyled = styled(FastImage)<StyleProps>`
  width: ${scale(90)}px;
  height: ${scale(90)}px;
  border-radius: ${scale(90)}px;
`;

export const ImageSmallStyled = styled(FastImage)<StyleProps>`
  width: ${scale(44)}px;
  height: ${scale(44)}px;
  border-radius: ${scale(44)}px;
`;

export const IconTitleStyled = styled.View`
  justify-content: center;
  height: ${scale(26)}px;
  margin-right: ${scale(4)}px;
`;

export const TextTitleStyled = styled.Text<StyleProps>`
  color: ${Colors.Secondary_Color};
  margin-bottom: ${scale(6)}px;
  font-family: Lexend-Bold;
  font-size: ${scale(16)}px;
  line-height: ${scale(24)}px;
  width: ${(props: StyleProps) => (props.width ? `${props.width}%` : 'auto')};
  justify-content: center;
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

export const HashtagStyled = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-vertical: ${scale(6)}px;
`;

export const TextHashtagStyled = styled.Text<StyleProps>`
  font-size: ${scale(11)}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'normal'};
  line-height: ${scale(18)}px;
  color: ${(props: StyleProps) => props.color || Colors.Background};
  margin-right: ${scale(3)}px;
  margin-left: ${(props: StyleProps) => (props.marginLeft ? scale(props.marginLeft) : 0)}px;
  width: auto;
`;

export const TextActionStyled = styled.Text<StyleProps>`
  font-size: ${scale(11)}px;
  margin-left: ${scale(3)}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'normal'};
  line-height: ${scale(18)}px;
  color: ${(props: StyleProps) => props.color || Colors.Soft_Blue};
  width: auto;
`;

export const ViewSharePlayStyled = styled.View`
  flex-direction: row;
  flex: 1;
  width: 100%;
  margin-top: ${scale(5)}px;
`;

export const ViewActionStyled = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${scale(10)}px;
`;
export const ViewStartStyled = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
`;

export const TouchStartStyled = styled.TouchableOpacity`
  padding-vertical: ${scale(6)}px;
  padding-horizontal: ${scale(12)}px;
  background-color: ${Colors.Background};
  border-radius: ${scale(12)}px;
`;

export const TextStartStyled = styled.Text`
  font-size: ${scale(14)}px;
  font-weight: normal;
  line-height: ${scale(16)}px;
  color: ${Colors.White};
  text-transform: uppercase;
`;

export const ViewEmojiStyled = styled.TouchableOpacity`
  padding: ${scale(5)}px;
`;
