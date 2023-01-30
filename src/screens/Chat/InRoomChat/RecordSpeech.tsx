import React, { useImperativeHandle } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { format } from 'date-fns';

import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import { useDispatch } from 'react-redux';
import { IRecordSpeechProps, IRecordSpeechRef } from '@/stores/types/chat.type';
import { requestMicroPermission, requestStoragePermission } from '@/utils/permission';
import { formatMMSS } from '@/utils/format';
import { chatSlice } from '@/stores/reducers';
import { _uploadPresignedUrl } from '@/utils/helper';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { TextComponent } from '@/containers/components/TextComponent';

export const RecordSpeech = React.memo(
  React.forwardRef<IRecordSpeechRef, IRecordSpeechProps>(({ userGiftedChat, onChange }, ref) => {
    const dispatch = useDispatch();
    const ani = React.useRef(new Animated.Value(1)).current;
    const audioRecorderPlayer = React.useRef(new AudioRecorderPlayer()).current;
    const [state, setState] = React.useState({
      open: false,
      currentPosition: '00:00',
    });

    const close = React.useCallback(async () => {
      return new Promise(resolve => {
        Animated.timing(ani, {
          useNativeDriver: false,
          toValue: 1,
          duration: 150,
        }).start(cb => {
          setState(prev => ({ ...prev, open: false, currentPosition: '00:00' }));
          resolve(true);
        });
      });
    }, [ani]);

    const startRecord = React.useCallback(async () => {
      try {
        const permission = await requestMicroPermission();
        if (!permission) {
          await close();
          return;
        }
        const filename = Platform.OS === 'ios' ? Date.now() + '.m4a' : Date.now() + '.mp4';
        const dirCache = RNFetchBlob.fs.dirs.CacheDir + '/' + filename;
        const dirCacheIOS = `file://` + dirCache;
        const audioSet: AudioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        await audioRecorderPlayer.startRecorder(Platform.OS === 'ios' ? dirCacheIOS : dirCache, audioSet);
        await audioRecorderPlayer.setSubscriptionDuration(1);
        audioRecorderPlayer.addRecordBackListener(recordingMeta => {
          setState(prev => ({ ...prev, currentPosition: formatMMSS(recordingMeta.currentPosition / 1000) }));
        });
      } catch (error) {
        //
        console.log(error);
      }
    }, [audioRecorderPlayer, close]);

    const clearRecord = React.useCallback(async () => {
      try {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        await RNFetchBlob.fs.unlink(result);
        await close();
      } catch (error) {
        //
      }
    }, [audioRecorderPlayer, close]);

    const endRecord = React.useCallback(async () => {
      try {
        const result = await audioRecorderPlayer.stopRecorder();

        audioRecorderPlayer.removeRecordBackListener();
        await close();
        const tempId = Date.now();
        dispatch(
          chatSlice.actions.appendMessagePending([
            {
              _id: tempId,
              text: '',
              tempId,
              createdAt: new Date().getTime() + 10000,
              audio: result,
              user: userGiftedChat,
              pending: true,
            },
          ]),
        );
        const blob = await fetch(result).then(res => res.blob());
        let audio = result;
        const ext = '.m4a';
        const data = {
          uri: result,
          data: RNFetchBlob.wrap(Platform.OS === 'android' ? result : result.replace('file://', '')),
          type: blob.type || 'image/jpeg',
          name: format(new Date(), 't') + ext,
          filename: format(new Date(), 't') + ext,
        };
        const file_s3 = await _uploadPresignedUrl(data);
        audio = file_s3?.url || '';
        // await RNFetchBlob.fs.unlink(result);
        if (onChange) {
          onChange([
            {
              _id: tempId,
              tempId,
              text: '',
              createdAt: new Date().getTime() + 10000,
              audio,
              user: userGiftedChat,
            },
          ]);
        }
      } catch (error) {
        //
      }
    }, [audioRecorderPlayer, close, dispatch, onChange, userGiftedChat]);

    const aniBin = React.useMemo(
      () => ({
        opacity: ani.interpolate({
          inputRange: [1, 2],
          outputRange: [0, 1],
        }),
        transform: [
          {
            scaleY: ani.interpolate({
              inputRange: [1, 2],
              outputRange: [0, 1],
            }),
          },
        ],
      }),
      [ani],
    );

    const aniSend = React.useMemo(
      () => ({
        opacity: ani.interpolate({
          inputRange: [1, 2],
          outputRange: [0, 1],
        }),
        transform: [
          {
            translateX: ani.interpolate({
              inputRange: [1, 2],
              outputRange: [scale(-200), 0],
            }),
          },
        ],
      }),
      [ani],
    );

    const widthAni = React.useMemo(
      () => ({
        width: ani.interpolate({
          inputRange: [1, 2],
          outputRange: ['0%', '100%'],
          extrapolate: 'clamp',
        }),
      }),
      [ani],
    );

    const Timer = React.useMemo(
      () => (
        <Animated.View style={aniSend}>
          <TextComponent style={styles.textTimer}>{state.currentPosition}</TextComponent>
        </Animated.View>
      ),
      [aniSend, state.currentPosition],
    );

    useImperativeHandle(
      ref,
      () => ({
        open: async () => {
          const permission = await requestStoragePermission();
          if (!permission) {
            return;
          }
          setState(prev => ({ ...prev, open: true }));
          Animated.timing(ani, {
            useNativeDriver: false,
            toValue: 2,
            duration: 350,
          }).start(async cb => {
            await startRecord();
          });
        },
      }),
      [ani, startRecord],
    );

    return state.open ? (
      <View style={styles.container}>
        <Animated.View style={[styles.viewInputRecord]}>
          <Animated.View style={[styles.viewBackgroundRecord, widthAni]} />
          <Animated.View style={aniBin}>
            <TouchableOpacity style={styles.iconBin} onPress={clearRecord}>
              <Icon name="trash-bin-outline" size={scale(20)} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
          {Timer}
          <Animated.View style={aniSend}>
            <TouchableOpacity style={styles.iconSend} onPress={endRecord}>
              <Icon name="arrow-up-outline" size={scale(28)} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    ) : null;
  }),
);
RecordSpeech.displayName = 'ChatScreen/RecordSpeech';
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? scale(80 - 12 - 20 + 14) : scale(80 - 12 - 20 + 6),
  },
  viewBackgroundRecord: {
    position: 'absolute',
    backgroundColor: Colors.Soft_Blue,
    height: '100%',
    borderRadius: scale(40),
  },
  viewInputRecord: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: scale(24),
    borderRadius: scale(40),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBin: {
    backgroundColor: 'transparent',
    width: scale(40),
    height: scale(40),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(2),
  },
  iconSend: { marginHorizontal: scale(6) },
  textTimer: { color: Colors.white, fontSize: scale(13) },
});
