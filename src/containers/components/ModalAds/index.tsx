import { IconChevronDown, IconExit, IconPlay } from '@/assets/icons/Icon';
import { stylesItem } from '@/screens/Listening';
import { ClockContainer } from '@/screens/Listening/ClockContainer';
import React, { useEffect, useMemo } from 'react';
import { Animated, GestureResponderEvent, Modal, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Video from 'react-native-video';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { styles } from './styles';
import { Slider } from 'react-native-elements';
import { useState } from 'react';
import { useAppSelector } from '@/stores';
import { ASYNC_STORE, storage } from '@/storage';
import { TextComponent } from '../TextComponent';
import { commonStyles, indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { ImageComponent } from '../ImageComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import { TAB_BAR_HEIGHT } from '@/navigators/AppNavigator';
import { StatusBar } from 'react-native';
import { commonSlice } from '@/stores/reducers';
import { useDispatch } from 'react-redux';

const AUDIO_STATUS = {
  LOADING: 'LOADING',
  NOT_PLAY: 'NOT_PLAY',
  PLAY: 'PLAY',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  END: 'END',
};

const defaultState = {
  currentTime: 0,
  isSliding: false,
  audioStatus: AUDIO_STATUS.LOADING,
  openModal: false,
  countable: false,
  trackLength: 0,
  isPlaying: false,
  isLoadedVideo: false,
};

const ModalAds = () => {
  StatusBar.setHidden(true);
  const dispatch = useDispatch();
  const countPlay = useAppSelector(rootState => rootState.commonState.countPlay);
  const [bgModal, setBgModal] = useState('transparent');
  const [state, setState] = useState(defaultState);

  const stumpAds = useAppSelector(rootState => rootState.stumpState.stumpAds);

  const videoRef = React.useRef<Video>();
  const slideYAnim = React.useRef(new Animated.Value(300)).current;
  const totalDuration = React.useMemo(() => Number(stumpAds?.file[0]?.duration), [stumpAds?.file]);
  const opacity = React.useMemo(() => ({ opacity: state.isLoadedVideo ? 1 : 0.3 }), [state.isLoadedVideo]);

  const source = React.useMemo(
    () => ({ uri: (stumpAds?.file && stumpAds?.file[0]?.filePath) || '' }),
    [stumpAds?.file],
  );

  const onShow = async () => {
    setBgModal('rgba(0,0,0,0.2)');
    await _aniSlideY();
  };

  const _aniSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const onProgress = (event: any) => {
    if (state.isSliding || state.audioStatus === AUDIO_STATUS.END) {
      return;
    }

    let durationAudio = 0;
    if (event.seekableDuration > 0) {
      durationAudio = event.seekableDuration;
    }
    const currentTime = event.currentTime;

    if (event.currentTime >= (totalDuration || 0)) {
      videoRef.current?.seek(0);
      _onEnd();
    }

    setState(preState => ({
      ...preState,
      trackLength: durationAudio,
      currentTime,
    }));
  };

  const onLoad = async (load: any) => {
    const autoplay = true;
    if (autoplay && !!Number(autoplay)) {
      setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PLAYING, countable: true, isPlaying: true }));
    }
    if (load) {
      setState(preState => ({ ...preState, isLoadedVideo: true }));
    }
  };

  const _onEnd = async () => {
    _skipAds();
  };

  const onError = React.useCallback((error: any) => {
    console.log(error);
  }, []);

  const RenderParticipantSolo = useMemo(() => {
    return (
      <>
        <TouchableOpacity key={stumpAds?.id} style={styles.imageContainer}>
          <View style={styles.image}>
            <ViewIndicateHost width={scale(160)}>
              <ImageComponent
                uri={stumpAds?.logo || ''}
                width={scale(160)}
                height={scale(160)}
                borderRadius={scale(160)}
              />
              <View style={indicateHostStyle} />
            </ViewIndicateHost>
          </View>
          <TextComponent numberOfLines={1} style={styles.nameText}>
            {stumpAds?.displayName}
          </TextComponent>
        </TouchableOpacity>
      </>
    );
  }, [stumpAds?.logo]);

  const ConditionRenderParticipant = React.useMemo(() => {
    return <View style={[commonStyles.containerView, commonStyles.flex_1]}>{RenderParticipantSolo}</View>;
  }, [RenderParticipantSolo, stumpAds?.participants?.length]);

  const TextDescription = React.useMemo(() => {
    if (stumpAds?.description) {
      return <TextComponent style={styles.publishText}>{stumpAds?.description}</TextComponent>;
    }
    return null;
  }, [stumpAds?.description]);

  const playSound = React.useCallback(() => {
    if (state.audioStatus === AUDIO_STATUS.END) {
      videoRef.current?.seek(0);
    }
    setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PLAYING, countable: true, isPlaying: true }));
  }, [state.audioStatus]);

  const pauseSound = () => {
    setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PAUSE, isPlaying: false }));
  };

  const RenderPlayerAudio = React.useMemo(() => {
    return (
      <View style={styles.mainAudioPlayer}>
        {state.audioStatus !== AUDIO_STATUS.PLAYING ? (
          <TouchableOpacity
            onPress={playSound}
            disabled={!state.isLoadedVideo}
            style={[stylesItem.iconStyle]}
            activeOpacity={0.8}>
            <Icon name="play" size={scale(30)} color={'#1EB100'} style={opacity} />
            <Text style={styles.countLikeText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pauseSound} style={[stylesItem.iconStyle]} disabled={!state.isLoadedVideo}>
            <Icon name="pause" size={scale(30)} color={'#1EB100'} style={opacity} />
            <Text style={styles.countLikeText} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [state.isLoadedVideo, state.audioStatus, opacity, playSound]);

  const _onSlidingStart = () => {
    setState(preState => ({ ...preState, isSliding: true }));
  };

  const _onSlidingComplete = (value: number) => {
    videoRef.current?.seek(value);
    setState(preState => ({ ...preState, currentTime: value, isSliding: false, isPlaying: false }));
    setTimeout(
      () =>
        setState(preState => ({ ...preState, isPlaying: true, audioStatus: AUDIO_STATUS.PLAYING, countable: true })),
      100,
    );
  };

  const isNotANumber = (value: number) => isNaN(value);

  const getPositionValidated = (position: number) => (isNotANumber(position) ? 0 : position);

  const handleValueChange = (value: any) => {
    const validatedValue = Math.floor(getPositionValidated(value));
    setState(preState => ({ ...preState, currentTime: validatedValue, isPlaying: false }));
  };

  const _skipAds = () => {
    dispatch(commonSlice.actions.setCountPlayStump(0));
    setState(preState => ({ ...preState, currentTime: 0 }));
  };

  return (
    <Modal visible={countPlay === 2} animationType="slide" transparent={false} onShow={onShow}>
      <View style={styles.mainContainer}>
        <Video
          ref={videoRef as any}
          source={source}
          rate={1}
          volume={1}
          repeat={true}
          playWhenInactive={true}
          playInBackground={true}
          ignoreSilentSwitch={'ignore'}
          resizeMode={'contain'}
          onProgress={onProgress}
          onLoad={onLoad}
          onEnd={_onEnd}
          onError={onError}
          maxBitRate={500000}
          paused={!state.isPlaying}
          audioOnly={true}
        />

        <View style={[styles.main]}>
          <Text style={styles.titleText} numberOfLines={1}>
            {stumpAds?.title}
          </Text>

          {TextDescription}
          {ConditionRenderParticipant}
          <View>
            {state.currentTime > 5 ? (
              <TouchableOpacity onPress={_skipAds} style={styles.btnSkip}>
                <TextComponent style={{ fontSize: scale(12), color: '#fff', textAlign: 'center' }}>
                  Skip Ads
                </TextComponent>
                <Icon name="play-skip-forward" size={scale(15)} color={'#fff'} style={{ paddingLeft: scale(4) }} />
              </TouchableOpacity>
            ) : null}
            <Slider
              maximumValue={state.trackLength}
              minimumTrackTintColor={Colors.Background}
              onSlidingComplete={_onSlidingComplete}
              onSlidingStart={_onSlidingStart}
              onValueChange={handleValueChange}
              style={stylesItem.containerSlider}
              thumbStyle={stylesItem.iconCircle}
              trackStyle={stylesItem.trackStyle}
              value={state.currentTime}
              animationType="timing"
              animateTransitions={true}
            />
            <ClockContainer currentTime={state.currentTime} duration={totalDuration || 0} />
          </View>
          {RenderPlayerAudio}
        </View>
      </View>
    </Modal>
  );
};

export default ModalAds;
