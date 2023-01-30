import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  containerDragModal: {
    backgroundColor: Colors.White,
    flex: 1,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  handleBar: {
    backgroundColor: Colors.LightGray,
    width: scale(40),
    height: scale(5),
    borderRadius: scale(5),
    marginVertical: scale(16),
    alignSelf: 'center',
  },
  w100: { width: '100%' },
});
