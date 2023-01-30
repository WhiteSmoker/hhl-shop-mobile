import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  viewButtons: {
    width: '75%',
    backgroundColor: 'white',
    marginBottom: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(12),
  },
  btnStyle: {
    height: scale(55),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ececec',
  },
  viewCancelStyle: {
    backgroundColor: 'white',
    height: scale(55),
    width: '75%',
    borderRadius: scale(12),
    marginBottom: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: { color: Colors.dark, fontSize: scale(15) },
});
