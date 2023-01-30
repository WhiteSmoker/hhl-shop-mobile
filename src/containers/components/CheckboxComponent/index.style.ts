import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Colors.blackOriginal,
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hasValueStyle: {
    borderWidth: scale(1),
    borderColor: Colors.Background,
    backgroundColor: Colors.white,
  },
  noValueStyle: {
    borderWidth: scale(1),
    borderColor: Colors.Light_grey3,
    backgroundColor: Colors.Light_grey3,
  },
});

export default styles;
