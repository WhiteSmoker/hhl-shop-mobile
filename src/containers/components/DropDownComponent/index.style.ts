import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Colors.blackOriginal,
    fontFamily: 'Lexend-Bold',
  },
  inputSearchStyle: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Colors.blackOriginal,
    fontFamily: 'Lexend-Bold',
    borderRadius: scale(4),
  },
  itemContainer: {
    borderRadius: scale(6),
  },
  dropDownContainer: {
    width: '93%',
    minHeight: scale(56),
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: scale(10),
    padding: scale(8),
    borderRadius: scale(8),
  },
  hasValueStyle: {
    borderWidth: scale(1.5),
    borderColor: Colors.Black,
    backgroundColor: Colors.white,
  },
  noValueStyle: {
    backgroundColor: Colors.Light_grey3,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(4),
    marginBottom: scale(4),
    padding: scale(8),
  },
  selectedItemStyle: {
    margin: scale(4),
    padding: scale(6),
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: Colors.Background,
  },
  textLeagueStyle: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Colors.blackOriginal,
    fontFamily: 'Lexend-Bold',
    marginLeft: scale(16),
    marginBottom: scale(8),
  },
});

export default styles;
