import { IconHeadset, IconMicrophone, IconMicrophoneOff, IconSpeaker } from '@/assets/icons/Icon';
import { RECORD_MODE } from '@/constants';
import { Colors } from '@/theme/colors';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import RtcEngine, { AudioOutputRouting } from 'react-native-agora';
import { scale } from 'react-native-size-scaling';
import { ViewAudioStyled } from './styles';
type Props = {
  engine?: RtcEngine;
  routing: AudioOutputRouting;
  conversationId: number;
  role: 'participant' | 'host';
  mode: number;
};
const ViewAudioComponent = (props: Props) => {
  const [state, setState] = useState({
    muteMic: false,
    enableSpeaker: true,
  });

  // Switch the audio playback device.
  const _switchSpeakerphone = async () => {
    const enabled = await props.engine?.isSpeakerphoneEnabled();
    await props.engine?.setEnableSpeakerphone(!enabled);
    setState(preState => ({ ...preState, enableSpeaker: !enabled }));
  };

  // Turn the microphone on or off.
  const _switchMicrophone = () => {
    props.engine
      ?.muteLocalAudioStream(!state.muteMic)
      .then(() => {
        setState(preState => ({ ...preState, muteMic: !preState.muteMic }));
      })
      .catch(err => {
        console.warn('enableLocalAudio', err);
      });
  };

  const renderOutput = React.useCallback(() => {
    switch (props.routing) {
      case AudioOutputRouting.Speakerphone: {
        return <IconSpeaker width={scale(32)} height={scale(32)} fill={'#606060'} />;
      }
      case AudioOutputRouting.Earpiece: {
        return <IconSpeaker width={scale(32)} height={scale(32)} fill={Colors.White} stroke={'#606060'} />;
      }
      case AudioOutputRouting.Headset: {
        return <IconHeadset width={scale(32)} height={scale(32)} />;
      }
      default:
        break;
    }
  }, [props.routing]);

  return (
    <ViewAudioStyled style={{ justifyContent: props.mode === RECORD_MODE.FRIENDS ? 'space-between' : 'center' }}>
      <TouchableOpacity activeOpacity={0.8} onPress={_switchMicrophone}>
        {!state.muteMic ? (
          <IconMicrophone width={scale(32)} height={scale(32)} />
        ) : (
          <IconMicrophoneOff width={scale(32)} height={scale(32)} />
        )}
      </TouchableOpacity>
      {props.mode === RECORD_MODE.FRIENDS && (
        <TouchableOpacity onPress={_switchSpeakerphone}>{renderOutput()}</TouchableOpacity>
      )}
    </ViewAudioStyled>
  );
};

export default React.memo(ViewAudioComponent);
