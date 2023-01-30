import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  main: {
    borderColor: Colors.Background2,
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    padding: scale(16),
    margin: scale(16),
    // height: '80%',
    width: '100%',
    backgroundColor: Colors.White,
  },
  mainContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    alignContent: 'center', 
    paddingHorizontal: scale(16),
  },
  titleText: {
    textAlign: 'center',
    fontSize: scale(20),
    fontFamily: 'Lexend-Bold',
    width: '100%',
  },
  imageGroupContainer: {
    paddingHorizontal: scale(24),
    marginTop: scale(40),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
  },
  publishText: {
    marginTop: scale(8),
    textAlign: 'center',
    fontSize: scale(13),
  },
  mainAudioPlayer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countLikeText: {
    textAlign: 'center',
    color: Colors.DarkGray,
    marginTop: scale(9),
    fontSize: scale(14),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: scale(25),
    width: scale(110),
  },
  image: {
    marginBottom: scale(6),
  },
  nameText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Lexend-Bold',
    fontSize: scale(11),
    lineHeight: scale(16),
  },
  btnSkip: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    paddingVertical: scale(4), 
    paddingHorizontal: scale(8), 
    borderRadius: scale(6), 
    marginLeft: 'auto',
    marginBottom: scale(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
