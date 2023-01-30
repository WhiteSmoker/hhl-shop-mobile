import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export default StyleSheet.create({
  view_loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: Platform.OS === 'ios' ? 5 : 1,
    elevation: 5,
  },
  viewContent: {
    backgroundColor: 'transparent',
    paddingLeft: scale(15),
    paddingRight: scale(13),
    paddingVertical: scale(15),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: { width: scale(160), height: scale(160) },
});
