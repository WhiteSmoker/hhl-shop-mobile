import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.WhiteSmoke,
  },
  headerText: {
    textAlign: 'center',
    fontSize: scale(22),
    lineHeight: scale(30),
    fontFamily: 'Lexend-Bold',
    color: Colors.blackOriginal,
    textTransform: 'capitalize',
  },
  body: {
    padding: scale(20),
    paddingBottom: scale(20),
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Dark_Gray2,
    height: scale(40),
    borderRadius: scale(20),
  },
  cancelButtonText: {
    color: Colors.white,
    fontFamily: 'Lexend-Bold',
    fontSize: scale(15),
  },
  iconView: {
    alignItems: 'center',
    flex: 1,
  },
  iconViewDisable: {
    backgroundColor: 'rgba(192, 192, 192, 1)',
  },
  stumpIconView: {
    padding: scale(2),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: Colors.Gray,
    width: scale(48),
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: scale(12),
    marginTop: scale(5),
  },
  sign: {
    backgroundColor: '#D7D9DB',
    height: scale(8),
    width: scale(70),
    borderRadius: scale(5),
    marginTop: scale(5),
  },
  viewMore: {
    backgroundColor: Colors.Bg_Object,
    borderRadius: scale(48),
    width: scale(48),
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRestump: {
    backgroundColor: Colors.Background,
    borderRadius: scale(48),
    width: scale(48),
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
