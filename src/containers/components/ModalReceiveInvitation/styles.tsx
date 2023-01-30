import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: scale(10),
    height: 'auto',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(10),
  },
  header: {
    flexDirection: 'row',
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.WhiteSmoke,
  },
  viewIcon: {
    borderWidth: scale(2),
    borderColor: Colors.Background,
    borderRadius: scale(50),
    padding: scale(15),
  },
  headerText: {
    textAlign: 'center',
    fontSize: scale(14),
    lineHeight: scale(30),
    fontFamily: 'Lexend-Bold',
    color: Colors.Dark_Gray1,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: scale(10),
  },
  buttonCancel: {
    width: scale(100),
    borderWidth: scale(1),
    borderColor: Colors.Background,
    borderRadius: scale(10),
  },
  buttonJoin: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: scale(100),
    borderRadius: scale(10),
    backgroundColor: Colors.Background,
  },
  //------------------------------------------------------------------------------
  containerOtpInput: {
    width: '80%',
    height: scale(100),
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: scale(30),
    height: scale(45),
    color: Colors.blackOriginal,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: Colors.blackOriginal,
  },
});
