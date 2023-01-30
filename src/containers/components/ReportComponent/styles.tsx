import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
export const TextInputStyled = styled.TextInput`
  margin-top: ${scale(8)}px;
  font-style: normal;
  font-family: Lexend-Regular;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.Emperor};
  border-radius: ${scale(5)}px;
  height: ${scale(100)}px;
  padding: ${scale(8)}px ${scale(16)}px;
  text-align-vertical: top;
`;
export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    height: '55%',
  },
  headerText: {
    textAlign: 'center',
    fontSize: scale(22),
    lineHeight: scale(30),
    fontFamily: 'Lexend-Bold',
    color: Colors.blackOriginal,
    textTransform: 'capitalize',
  },
  textBoldStepOne_1: {
    fontSize: scale(22),
    lineHeight: scale(30),
    fontFamily: 'Lexend-Bold',
    color: Colors.blackOriginal,
  },
  textGreyStepOne: {
    fontSize: scale(16),
    lineHeight: scale(26),
    fontFamily: 'Lexend-Regular',
    color: Colors.Dark_Gray_8B,
  },
  textSubmitStepTwo: {
    fontSize: scale(16),
    lineHeight: scale(26),
    fontFamily: 'Lexend-Regular',
    color: Colors.White,
  },
  body: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    width: '100%',
    height: '100%',
    flex: 1,
  },

  sign: {
    backgroundColor: Colors.White,
    height: scale(8),
    width: scale(70),
    borderRadius: scale(5),
    marginVertical: scale(10),
    alignSelf: 'center',
  },
  reportItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: scale(2),
    borderColor: Colors.WhiteSmoke,
  },
  textReportItem: {
    fontSize: scale(14),
    lineHeight: scale(22),
    fontFamily: 'Lexend-Regular',
    color: Colors.dark,
  },
  shadowInput: {
    backgroundColor: Colors.White,
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderRadius: scale(10),
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: Platform.OS === 'ios' ? 12 : 12,
    elevation: Platform.OS === 'ios' ? 2 : 5,
    width: '98%',
    alignSelf: 'center',
    marginBottom: scale(6),
    marginTop: scale(6),
    zIndex: 1,
  },
  buttonSubmit: {
    alignSelf: 'center',
    backgroundColor: Colors.Background,
    borderRadius: scale(8),
    paddingVertical: scale(8),
    paddingHorizontal: scale(24),
    marginTop: scale(45),
  },
  viewSuccess: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSuccessSvg: {
    marginVertical: scale(10),
  },
  textGreySuccess: {
    fontSize: scale(16),
    lineHeight: scale(21),
    fontFamily: 'Lexend-Regular',
    color: Colors.Dark_Gray_8B,
    textAlign: 'center',
  },
  textTitleSuccess: {
    fontSize: scale(18),
    lineHeight: scale(32),
    fontFamily: 'Lexend-Bold',
    color: Colors.Graylist_Cyan,
    marginRight: scale(8),
  },
});
