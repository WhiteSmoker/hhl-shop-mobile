import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
    marginTop: scale(10),
    paddingHorizontal: scale(10),
    backgroundColor: Colors.White,
  },
});
