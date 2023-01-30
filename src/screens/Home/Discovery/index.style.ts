import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

interface IStyledProps {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  paddingRight?: number;
  paddingLeft?: number;
  paddingBottom?: number;
  textDecorationLine?: string;
  textDecorationColor?: string;
  color?: string;
  textAlign?: string;
  fontSize: number;
  fontWeight?: string;
  lineHeight?: number;
  alignSelf?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  discoveryInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(3),
    marginHorizontal: scale(16),
  },
  stumpNumber: {
    width: scale(24),
    height: scale(24),
    backgroundColor: Colors.Background,
    borderRadius: scale(24),
    marginLeft: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stumpButton: {
    width: '100%',
    height: scale(54),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background,
    borderRadius: scale(6),
  },
  stumpButtonIsRecording: {
    marginBottom: scale(120),
  },
});

export const TextDiscovery = styled.Text`
  font-size: ${(props: IStyledProps) => scale(props.fontSize)}px;
  line-height: ${(props: IStyledProps) => scale(props.lineHeight || props.fontSize)}px;
  font-weight: ${(props: IStyledProps) => props.fontWeight || 500};
  padding-bottom: ${(props: IStyledProps) => scale(props.paddingBottom || 0)}px;
  padding-left: ${(props: IStyledProps) => scale(props.paddingLeft || 0)}px;
  padding-right: ${(props: IStyledProps) => scale(props.paddingRight || 0)}px;
  margin-right: ${(props: IStyledProps) => scale(props.marginRight || 0)}px;
  color: ${(props: IStyledProps) => props.color || Colors.blackOriginal};
  align-self: ${(props: IStyledProps) => props.alignSelf || 'auto'};
  text-decoration-line: ${(props: IStyledProps) => props.textDecorationLine || 'none'};
  text-decoration-color: ${(props: IStyledProps) => props.color || Colors.white};
`;

export default styles;
