import { Colors } from '@/theme/colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const insets = { top: 20, bottom: 20, left: 20, right: 20 };

export const commonStyles = StyleSheet.create({
  containerFlatlist: {
    flex: 1,
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  containerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pd_bottom_12: {
    paddingBottom: scale(12),
  },
  pd_horizontal_10: {
    paddingHorizontal: scale(10),
  },
  pd_horizontal_24: {
    paddingHorizontal: scale(24),
  },
  mg_horizontal_24: {
    marginHorizontal: scale(24),
  },
  pd_right_6: {
    paddingRight: scale(6),
  },
  mg_horizontal_12: {
    marginHorizontal: scale(12),
  },
  pd_horizontal_16: {
    paddingHorizontal: scale(16),
  },
  pd_right_16: {
    paddingRight: scale(16),
  },
  mg_right_16: {
    marginRight: 16,
  },
  flex_1: {
    flex: 1,
  },
  flex_15: {
    flex: 1.5,
    justifyContent: 'space-between',
  },
  absoluteRight: {
    position: 'absolute',
    right: 0,
  },
  viewIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(3),
  },
  textIndicator: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: Colors.Dark_Gray1,
  },
  shadow: {
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: Platform.OS === 'ios' ? 12 : 12,
    elevation: Platform.OS === 'ios' ? 2 : 3,
    zIndex: 1,
    borderRadius: scale(10),
  },
  flatlist_item: {
    backgroundColor: Colors.White,
    borderRadius: scale(10),
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: Platform.OS === 'ios' ? 12 : 12,
    elevation: Platform.OS === 'ios' ? 2 : 8,
    zIndex: 1,
    width: '95%',
    alignSelf: 'center',
    marginBottom: scale(18),
    padding: scale(8),
    marginTop: scale(12),
  },
  flatlist_compact_item: {
    backgroundColor: Colors.White,
    borderRadius: scale(10),
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: Platform.OS === 'ios' ? 12 : 12,
    elevation: Platform.OS === 'ios' ? 2 : 8,
    zIndex: 1,
    width: '100%',
    alignSelf: 'center',
    marginBottom: scale(12),
    padding: scale(8),
    marginTop: scale(12),
  },
  paddingLastItem: {
    paddingBottom: scale(118),
  },
  p_b_0: {
    paddingBottom: 0,
  },
  m_l_10: {
    marginLeft: scale(10),
  },
  textWhite: {
    color: Colors.White,
  },
});

export const getItemLayout = <T extends {}>(data: T[] | null | undefined, index: number) => ({
  length: scale(118),
  offset: scale(118) * index,
  index,
});

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
};

export const ifIphoneX = (iphoneXStyle: any, regularStyle: any) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};
