import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

interface IStyledProps {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: scale(24),
    paddingHorizontal: scale(16),
  },
  preferenceContainer: {
    marginTop: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_grey5,
  },
  preferenceBtn: {
    height: scale(54),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsContainer: {
    height: scale(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: Colors.Light_grey6,
  },
  optionsTeamsContainer: {
    height: scale(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(6),
    marginBottom: scale(4),
    backgroundColor: Colors.Light_grey3,
  },
  sportIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
  },
  btnSurvey: {
    width: '100%',
    height: scale(54),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background,
    borderRadius: scale(6),
  },
});

export const TextPreference = styled.Text`
  font-size: ${(props: IStyledProps) => scale(props.fontSize)}px;
  line-height: ${(props: IStyledProps) => scale(props.lineHeight || props.fontSize)}px;
  font-weight: ${(props: IStyledProps) => props.fontWeight || 500};
  padding-bottom: ${(props: IStyledProps) => scale(props.paddingBottom || 0)}px;
  padding-left: ${(props: IStyledProps) => scale(props.paddingLeft || 0)}px;
  color: ${(props: IStyledProps) => props.color || Colors.blackOriginal};
  align-self: ${(props: IStyledProps) => props.alignSelf || 'auto'};
`;

export default styles;
