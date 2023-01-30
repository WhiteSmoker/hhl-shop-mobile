import styled from 'styled-components/native';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

interface IStyledProps {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingBottom?: number;
  textDecorationLine?: string;
  color?: string;
  textAlign?: string;
  fontSize: number;
  fontWeight?: string;
  lineHeight?: number;
  alignSelf?: string;
}

export const styles = StyleSheet.create({
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  infoContainer: {
    flex: 2.2,
  },
  listParticipant: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: scale(6),
  },
});

export const TextCompactCard = styled.Text`
  font-size: ${(props: IStyledProps) => scale(props.fontSize)}px;
  line-height: ${(props: IStyledProps) => scale(props.lineHeight || props.fontSize)}px;
  font-weight: ${(props: IStyledProps) => props.fontWeight || 500};
  padding-bottom: ${(props: IStyledProps) => scale(props.paddingBottom || 0)}px;
  padding-left: ${(props: IStyledProps) => scale(props.paddingLeft || 0)}px;
  margin-top: ${(props: IStyledProps) => scale(props.marginTop || 0)}px;
  margin-right: ${(props: IStyledProps) => scale(props.marginRight || 0)}px;
  color: ${(props: IStyledProps) => props.color || Colors.blackOriginal};
  align-self: ${(props: IStyledProps) => props.alignSelf || 'auto'};
`;
