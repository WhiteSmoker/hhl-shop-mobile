import { Colors } from '@/theme/colors';
import { StyleSheet, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.White },
  messagesContainerStyle: { paddingBottom: scale(20) },
  rowFlexEnd: { flexDirection: 'row', alignItems: 'flex-end', position: 'relative' },
  messageImageContainerStyle: {
    backgroundColor: Colors.white,
    borderColor: Colors.greyOpacity,
    borderRadius: scale(12),
  },
  inputToolbarContainerStyle: {
    backgroundColor: Colors.white,
    paddingHorizontal: scale(24),
    height: scale(80),
    borderTopWidth: 0,
  },
  inputToolbarPrimayStyle: {
    backgroundColor: Colors.white,
    borderRadius: scale(60),
    borderColor: Colors.Light_Gray,
    borderWidth: scale(1),
    minHeight: scale(80 - 12 - 20),
    maxHeight: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  containerRenderSend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // height: scale(80 - 12 - 20),
  },
  containerCameraAction: {
    height: scale(80 - 12 - 20 - 6),
    width: scale(80 - 12 - 20 - 6),
    backgroundColor: '#2ab9f4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(23),
    marginLeft: scale(3),
  },
  sendContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: scale(10),
  },
  composerTextInputStyle: {
    color: '#606060',
    height: scale(80 - 12 - 20),
    textAlignVertical: 'center',
    fontSize: scale(13),
    lineHeight: scale(80 - 12 - 20) / 2,
  },
  containerVideoMessage: {
    position: 'relative',
    width: scale(120),
    height: scale(160),
    borderRadius: scale(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  viewPlayVideoIcon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  containerAcceptMessage: {
    backgroundColor: '#fbfbfb',
    height: scale(60 + 60 + 18 * 4),
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
  },
  containerViewBlockMe: {
    backgroundColor: '#fbfbfb',
    height: scale(80),
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
  },
  viewNoticeAccept: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: scale(36),
    borderTopWidth: scale(0.5),
    borderTopColor: '#e5e5e5',
  },
  headerNotice: {
    color: Colors.dark,
    fontSize: scale(16),
    lineHeight: scale(60),
    height: scale(60),
    textAlign: 'center',
  },
  msgNotice: {
    color: '#8b8a8a',
    fontSize: scale(11),
    lineHeight: scale(18),
    height: scale(18 * 4),
    textAlign: 'center',
  },
  headerNoticeBlock: {
    color: Colors.dark,
    fontSize: scale(16),
    lineHeight: scale(60),
    height: scale(48),
    textAlign: 'center',
  },
  msgNoticeBlock: {
    color: '#8b8a8a',
    fontSize: scale(11),
    lineHeight: scale(18),
    height: scale(18),
    textAlign: 'center',
  },
  wrapperBtnAccept: { flexDirection: 'row', height: scale(60) },
  viewBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(0.25),
    borderColor: '#e5e5e5',
  },
  textRed: { color: Colors.red, fontSize: scale(13), fontFamily: 'Lexend-Bold' },
  textDark: { color: Colors.dark, fontSize: scale(13), fontFamily: 'Lexend-Bold' },
  tickPending: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(10),
    borderColor: Colors.greyOpacity,
    borderWidth: 1,
  },
  hiddenTick: {
    opacity: 0,
  },
  wrapperSeenUser: {
    height: scale(15),
    flexDirection: 'row',
  },
  avtSeenUser: { width: scale(15), height: scale(15), borderRadius: scale(15), margin: scale(3) },
});

export const timeTextStyle = {
  left: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: Colors.Gray,
  },
  right: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: Colors.Gray,
  },
};

export const messageTextStyle = {
  left: {
    color: '#606060',
    fontSize: scale(13),
  },
  right: {
    color: '#606060',
    fontSize: scale(13),
  },
};

export const messageTextContainerStyle = {
  left: {
    backgroundColor: Colors.white,
    borderWidth: scale(0.5),
    borderColor: Colors.greyOpacity,
    paddingVertical: scale(4),
    paddingHorizontal: scale(12),
  },
  right: {
    backgroundColor: '#efefef',
    paddingVertical: scale(4),
    paddingHorizontal: scale(12),
  },
};

export const messageAudioStyle = {
  left: {
    color: '#606060',
    fontSize: scale(13),
  },
  right: {
    color: '#606060',
    fontSize: scale(13),
  },
};

export const messageAudioContainerStyle: { left: ViewStyle; right: ViewStyle } = {
  left: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    width: scale(120),
    borderWidth: scale(0.5),
    borderColor: Colors.greyOpacity,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scale(120),
    borderRadius: scale(12),
    backgroundColor: '#efefef',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
};
