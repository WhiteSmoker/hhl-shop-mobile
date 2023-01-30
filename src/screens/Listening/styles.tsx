import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const styles = StyleSheet.create({
  container: {},
  main: {
    borderColor: Colors.Background2,
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    // height: '100%',
    padding: scale(16),
    margin: scale(16),
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  titleText: {
    textAlign: 'center',
    fontSize: scale(20),
    fontFamily: 'Lexend-Bold',
    width: '100%',
  },
  publishText: {
    marginTop: scale(8),
    textAlign: 'center',
    fontSize: scale(13),
  },
  publishTimeText: {
    fontFamily: 'Lexend-Bold',
  },
  imageGroupContainer: {
    paddingHorizontal: scale(24),
    marginTop: scale(40),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
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
  soundPlayerContainer: {
    alignItems: 'center',
  },
  mainAudioPlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerView: {
    height: scale(8),
    borderColor: Colors.DarkGray,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ellipseIcon: {
    position: 'relative',
    right: scale(10),
  },
  clockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clockText: {
    color: Colors.Graylist_Cyan,
    fontSize: scale(11),
    textAlign: 'center',
  },
  mainPlaying: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(20),
  },
  seekBarView: {
    width: scale(200),
    height: scale(7),
    backgroundColor: Colors.DarkGray,
    borderRadius: scale(20),
    marginLeft: scale(10),
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(54),
    marginTop: scale(0),
    marginBottom: scale(0),
  },
  countLikeText: {
    textAlign: 'center',
    color: Colors.DarkGray,
    marginTop: scale(9),
    fontSize: scale(14),
  },
  miniView: {
    backgroundColor: Colors.Light_Gray,
    paddingRight: scale(20),
    paddingLeft: scale(10),
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
    borderTopWidth: scale(1.5),
    borderTopColor: Colors.greyOpacity,
  },
  miniImageContainerGroup: { flexDirection: 'row', flexWrap: 'wrap', width: scale(90) },
  miniImageContainer: { marginLeft: scale(5), marginBottom: scale(5) },
  miniImage: { width: scale(35), height: scale(35), borderRadius: scale(35) },
  miniSoloImage: { width: scale(60), height: scale(60), borderRadius: scale(60) },
  soloImage: { width: scale(160), height: scale(160), borderRadius: scale(160) },
  miniSecondView: { marginLeft: scale(20), flex: 1, justifyContent: 'space-between' },
  miniSecondTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(-5),
  },
  miniTitleText: { fontSize: scale(20), width: '85%' },
  miniSecondBottomView: { paddingLeft: scale(5), flexDirection: 'row' },
  miniPlayer: { flex: 1, marginRight: scale(10) },
});

export const ImageStyled = styled(FastImage)`
  width: ${scale(80)}px;
  height: ${scale(80)}px;
  border-radius: ${scale(80)}px;
`;

export const SeekBarStyled = styled.View<StyleProps>`
  height: 100%;
  background-color: ${Colors.Background};
  border-radius: ${scale(20)}px;
  width: ${(props: StyleProps) => props.width || 0}%;
`;
