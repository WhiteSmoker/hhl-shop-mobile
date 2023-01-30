import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyledProps } from './types/SurveyFavorite.types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    backgroundColor: Colors.Light_grey,
    borderRadius: 6,
    borderWidth: 0,
    padding: 12,
    paddingLeft: 6,
    marginLeft: 0,
    marginRight: 0,
    marginStart: 0,
    marginEnd: 0,
    marginBottom: '1%',
    marginTop: '1%',
    width: '49%',
  },
  sportContainer: {
    flex: 3,
    flexDirection: 'row',
  },
  sportIcon: {
    width: 20,
    height: 20,
    marginRight: scale(10),
    marginLeft: scale(7),
  },
  textStyle: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Colors.blackOriginal,
    flex: 1,
    fontFamily: 'Lexend-Bold',
  },
});

export const TextSubTitleStyled = styled.Text`
  font-size: ${scale(18)}px;
  line-height: ${scale(22)}px;
  font-family: Lexend-Bold;
  color: ${Colors.blackOriginal};
  margin-left: ${scale(16)}px;
  padding-bottom: ${scale(16)}px;
`;

export const ViewHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  flex-flow: row-wrap;
  justify-content: space-between;
  margin-bottom: ${scale(48)}px;
  padding-right: ${scale(16)}px;
  padding-left: ${scale(16)}px;
`;

export const ViewBtnSurveyStyled = styled.TouchableOpacity<StyledProps>`
  width: 95%;
  height: ${scale(54)}px;
  align-items: center;
  align-self: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  background-color: ${(props: StyledProps) => props.backgroundColor || '#1da1f2'};
  justify-content: center;
  flex-direction: row;
  border-radius: ${scale(6)}px;
`;

export default styles;
