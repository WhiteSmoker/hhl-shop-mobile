import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Slider } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';
import { styles } from './styles';
import Share from 'react-native-share';
import { ClockContainer } from './ClockContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import { scale } from 'react-native-size-scaling';
import {
  APP_NAVIGATION,
  COMMENT_NAVIGATION,
  HOME_NAVIGATION,
  PROFILE_NAVIGATION,
  RECORD_MODE,
  RECORD_NAVIGATION,
  ROOT_ROUTES,
} from '@/constants';
import { Colors } from '@/theme/colors';
import { commonStyles, indicateHostStyle, insets, ViewIndicateHost } from '@/styles/common';
import { ifNotchIphone } from '@/theme';
import { commonSlice, stumpSlice } from '@/stores/reducers';
import { useAppSelector } from '@/stores';
import usePreventPlayAudio from '@/hooks/usePreventPlayAudio';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { navigationRef } from '@/navigators/refs';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { sortParticipantByHostHelper } from '@/utils/array';
import { useGetMyId } from '@/hooks/useGetMyId';
import { providerController } from '@/controllers/provider.controller';
import { apiURL } from '@/networking';
import { stumpController } from '@/controllers/stump.controller';
import { ASYNC_STORE, storage } from '@/storage';
import { TAB_BAR_HEIGHT } from '@/navigators/AppNavigator';
import useEmitter, { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { selectTabActive } from '@/stores/selectors';
import {
  IconBackForward,
  IconChevronDown,
  IconExit,
  IconFastForward,
  IconHeart,
  IconPause,
  IconPlay,
} from '@/assets/icons/Icon';
import { shareModalRef } from '@/refs';
import { TextComponent } from '@/containers/components/TextComponent';

const { height } = Dimensions.get('window');

const AUDIO_STATUS = {
  LOADING: 'LOADING',
  NOT_PLAY: 'NOT_PLAY',
  PLAY: 'PLAY',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  END: 'END',
};

const defaultState = {
  countLike: 0,
  isMinimize: false,
  currentTime: 0,
  isSliding: false,
  audioStatus: AUDIO_STATUS.LOADING,
  openModal: false,
  countable: false,
  trackLength: 0,
  isPlaying: false,
  isLoadedVideo: false,
  isLike: false,
};

const ListeningComponent = () => {
  const dispatch = useDispatch();
  const bottomTabHeight = TAB_BAR_HEIGHT;
  const stumpActive = useAppSelector(rootState => rootState.commonState.stumpActive);
  console.log('🚀 ~ file: index.tsx:90 ~ ListeningComponent ~ stumpActive', stumpActive);
  const userId = useGetMyId();
  const tabActive = useAppSelector(selectTabActive);

  const heightConsume = useAppSelector(rootState => rootState.commonState.heightConsume);
  const likedStump = useAppSelector(rootState => rootState.stumpState.likedStump);
  const { isPrevent } = usePreventPlayAudio();
  const { isBlockMe } = useUserBlockMe();

  useEmitter(EDeviceEmitter.SHARE_SUCCESFULLY, () => {
    navigationRef?.current?.navigate(APP_NAVIGATION.PROFILE, {
      screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
      params: { indexActive: { index: 3 } },
      initial: false,
    });
  });

  const totalDuration = React.useMemo(() => stumpActive?.file[0]?.duration, [stumpActive?.file]);

  const [state, setState] = useState(defaultState);

  const [touchY, setTouchY] = useState(0);

  const videoRef = React.useRef<Video>();

  const slideYAnim = React.useRef(new Animated.Value(height)).current;
  const slideYMiniAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (stumpActive?.id && !stumpActive?.notStump) {
      const getDetailStump = async () => {
        const res = await stumpController.getDetailStump(stumpActive?.id);
        dispatch(commonSlice.actions.setPlayStump(res.data[0]));
      };
      getDetailStump();
    }
  }, [stumpActive?.id]);

  useEffect(() => {
    if (likedStump && stumpActive && likedStump.id === stumpActive.id) {
      setState(prev => ({
        ...prev,
        isLike: !prev.isLike,
        countLike: prev.isLike ? prev.countLike - 1 : prev.countLike + 1,
      }));
    }
  }, [likedStump]);

  const overlapBottom = useMemo(() => tabActive === 'COMMENT', [tabActive]);

  useEffect(() => {
    if (overlapBottom) {
      Animated.timing(slideYMiniAnim, {
        toValue: ifNotchIphone(scale(100 - 24), bottomTabHeight),
        useNativeDriver: true,
        duration: 400,
      }).start(cb => {
        if (cb.finished) {
          setState(preState => ({ ...preState, isMinimize: true }));
        }
      });
    } else {
      setState(preState => ({ ...preState, isMinimize: true }));
    }
  }, [tabActive, overlapBottom, bottomTabHeight]);

  useEffect(() => {
    if (!state.countable) {
      return;
    }
    countPlay();
  }, [state.countable]);

  //track # of plays
  const countPlay = async () => {
    if (stumpActive?.notStump) {
      return;
    }
    await stumpController.counterPlayAudio(stumpActive?.id || 0);
  };

  const _aniFunc = React.useCallback(
    (val1: number, val2: number) => {
      return new Promise<boolean>(resolve => {
        LayoutAnimation.spring();
        Animated.parallel([
          Animated.timing(slideYAnim, {
            toValue: val1,
            useNativeDriver: true,
            duration: 400,
          }),
          Animated.timing(slideYMiniAnim, {
            toValue: val2,
            useNativeDriver: true,
            duration: 400,
          }),
        ]).start(endCallback => {
          if (endCallback.finished) {
            resolve(true);
          }
        });
      });
    },
    [slideYAnim, slideYMiniAnim],
  );

  const _aniMinimize = React.useCallback(
    async (toValue = 0) => {
      let value = toValue;
      if (overlapBottom) {
        value = ifNotchIphone(scale(100 - 24), bottomTabHeight);
      }
      await _aniFunc(height, value);
    },
    [_aniFunc, overlapBottom, bottomTabHeight],
  );

  const _aniMaximize = React.useCallback(async () => {
    await _aniFunc(0, height);
  }, [_aniFunc]);

  useEffect(() => {
    if (state.isMinimize) {
      _aniMinimize();
    } else {
      _aniMaximize();
    }
  }, [state.isMinimize]);

  useEffect(() => {
    if (isPrevent && stumpActive) {
      _aniMinimize().then(() => {
        dispatch(commonSlice.actions.setPlayStump());
      });

      return;
    }
    if (!stumpActive) {
      setState(preState => ({
        ...preState,
        ...defaultState,
      }));
      return;
    }
    const isLike = stumpActive?.reactions?.rows.findIndex(e => e.userId === userId && e.type !== 0) !== -1;
    const countLike = stumpActive?.reactions?.rows.filter(e => e.type !== 0).length ?? 0;
    switch (stumpActive.screen) {
      case RECORD_NAVIGATION.PUBLISH_SUCCESS:
      case APP_NAVIGATION.NOTIFICATION: {
        _aniMaximize();
        setState(preState => ({
          ...preState,
          isMinimize: !stumpActive?.maximum,
          isLike,
          countLike,
          audioStatus: preState.audioStatus,
          isPlaying: preState.isPlaying,
          isLoadedVideo: preState.isLoadedVideo,
          currentTime: 0,
        }));
        break;
      }
      default: {
        setState(preState => ({
          ...preState,
          ...defaultState,
          isMinimize: !stumpActive?.maximum,
          isLike,
          countLike,
          audioStatus: preState.audioStatus,
          isPlaying: preState.isPlaying,
          isLoadedVideo: preState.isLoadedVideo,
          currentTime: 0,
        }));
        break;
      }
    }
  }, [stumpActive, isPrevent, _aniMinimize, dispatch, userId, _aniMaximize]);

  const playSound = React.useCallback(() => {
    if (state.audioStatus === AUDIO_STATUS.END) {
      videoRef.current?.seek(0);
    }
    setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PLAYING, countable: true, isPlaying: true }));
  }, [state.audioStatus]);

  const pauseSound = () => {
    setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PAUSE, isPlaying: false }));
  };

  const likeStump = React.useCallback(async () => {
    if (!stumpActive) {
      return;
    }
    const stumpId = stumpActive?.id;
    const type = state.isLike ? 0 : 1;
    try {
      const res = await stumpController.reactionStump(userId || 0, stumpId, type);
      if (res.status === 1) {
        emitter(EDeviceEmitter.UPDATE_COUNT_LIKE_PROFILE, type ? 1 : -1);
        dispatch(stumpSlice.actions.setLikedStump({ ...stumpActive }));
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
      });
    }
  }, [dispatch, state.isLike, stumpActive, userId]);

  const shareStump = React.useCallback(async () => {
    try {
      if (stumpActive?.hostId === userId) {
        const linkTrial = `${apiURL}/stump/socialSharing?url=${'stump://app/consume/' + stumpActive?.id}&audioUrl=${
          stumpActive?.file[0]?.filePath
        }&stumpId=${stumpActive?.id}&description=${stumpActive?.description}&author=${
          stumpActive?.participants[0]?.user?.displayName
        }`;
        const res_short = await providerController.getShortLinkHelper(linkTrial);
        const shareOptions = {
          title: res_short?.shortLink ?? '',
          url: res_short?.shortLink ?? '',
        };
        await Share.open(shareOptions);
      } else {
        shareModalRef.current?.open(stumpActive);
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [dispatch, stumpActive, userId]);

  const _gotoProfile = React.useCallback(
    (id: number) => async () => {
      try {
        if (!id) {
          return;
        }
        isBlockMe(id);
        await _aniMinimize();

        if (id === userId) {
          navigationRef?.current?.navigate(APP_NAVIGATION.PROFILE, {
            screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
            initial: false,
          });
          return;
        }
        navigationRef?.current?.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: false,
          params: { userId: id, screen: stumpActive?.screen },
        });
      } catch (error) {
        //
      }
    },
    [_aniMinimize, isBlockMe, stumpActive?.screen, userId],
  );

  const minimize = async () => {
    setState(preState => ({ ...preState, isMinimize: !preState.isMinimize }));
  };

  const _closePlayer = () => {
    dispatch(commonSlice.actions.setPlayStump());
  };

  const _formatDate = (date: Date) => {
    return `${format(date, 'p')} - ${format(date, 'LLL dd u')}`;
  };

  const sortParticipant = sortParticipantByHostHelper(stumpActive?.participants || []);
  const participants =
    stumpActive?.screen === HOME_NAVIGATION.DRAFTHOME || stumpActive?.screen === HOME_NAVIGATION.SCHEDULEDHOME
      ? sortParticipant
      : sortParticipant.filter(p => !!p.active && !!p.isAccepted);

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
    const autoplay = await storage.getItem(ASYNC_STORE.AUTOPLAY);
    if (autoplay && !!Number(autoplay)) {
      setState(preState => ({ ...preState, audioStatus: AUDIO_STATUS.PLAYING, countable: true, isPlaying: true }));
    }
    if (load) {
      setState(preState => ({ ...preState, isLoadedVideo: true }));
    }
  };

  const onError = React.useCallback((error: any) => {
    console.log(error);
  }, []);

  const _onEnd = async () => {
    setState(preState => ({
      ...preState,
      audioStatus: AUDIO_STATUS.PAUSE,
      currentTime: totalDuration || 0,
      trackLength: totalDuration || 0,
      countable: false,
      isPlaying: false,
    }));
  };

  const next30s = React.useCallback(() => {
    const dur = totalDuration || 0;
    if (state.currentTime >= dur) {
      return;
    } else {
      const time = state.currentTime + 30 >= dur ? dur : state.currentTime + 30;
      if (state.currentTime + 30 >= dur) {
        setState(preState => ({
          ...preState,
          audioStatus: AUDIO_STATUS.END,
          currentTime: totalDuration || 0,
          trackLength: totalDuration || 0,
          countable: false,
          isPlaying: false,
        }));
      } else {
        videoRef.current?.seek(time);
        setState(preState => ({ ...preState, currentTime: time }));
      }
    }
  }, [state.currentTime, totalDuration]);

  const back15s = React.useCallback(() => {
    if (state.currentTime < 15) {
      videoRef.current?.seek(0);
      setState(preState => ({
        ...preState,
        currentTime: 0,
        audioStatus: preState.audioStatus === AUDIO_STATUS.END ? AUDIO_STATUS.PAUSE : preState.audioStatus,
      }));
    } else {
      videoRef.current?.seek(state.currentTime - 15);
      setState(preState => ({
        ...preState,
        currentTime: preState.currentTime - 15,
        audioStatus: preState.audioStatus === AUDIO_STATUS.END ? AUDIO_STATUS.PAUSE : preState.audioStatus,
      }));
    }
  }, [state.currentTime]);

  const viewAllComment = React.useCallback(async () => {
    await _aniMinimize();

    navigationRef.current?.navigate(ROOT_ROUTES.COMMENT, {
      screen: COMMENT_NAVIGATION.ALL_COMMENT,
      initial: false,
      params: { stumpId: stumpActive?.id, screen: stumpActive?.screen },
    });
  }, [_aniMinimize, stumpActive?.id, stumpActive?.screen]);

  const RenderParticipant = useMemo(() => {
    return (
      <>
        {participants?.map(participant => (
          <TouchableOpacity
            key={participant.id}
            style={styles.imageContainer}
            onPress={_gotoProfile(participant.userId!)}>
            <View style={styles.image}>
              <ViewIndicateHost width={scale(80)}>
                <ImageComponent
                  uri={participant.user?.avatar || ''}
                  width={scale(80)}
                  height={scale(80)}
                  borderRadius={scale(80)}
                />
                {participant.isHost && <View style={indicateHostStyle} />}
              </ViewIndicateHost>
            </View>
            <TextComponent numberOfLines={1} style={styles.nameText}>
              {participant.userId ? participant?.user?.displayName : participant.inviteValue?.split('@')[0]}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </>
    );
  }, [_gotoProfile, participants]);

  const RenderParticipantSolo = useMemo(() => {
    return (
      <>
        {participants?.map(participant => (
          <TouchableOpacity
            key={participant.id}
            style={styles.imageContainer}
            onPress={_gotoProfile(participant.userId!)}>
            <View style={styles.image}>
              <ViewIndicateHost width={scale(160)}>
                <ImageComponent
                  uri={participant.user?.avatar || ''}
                  width={scale(160)}
                  height={scale(160)}
                  borderRadius={scale(160)}
                />
                {participant.isHost && <View style={indicateHostStyle} />}
              </ViewIndicateHost>
            </View>
            <TextComponent numberOfLines={1} style={styles.nameText}>
              {participant?.user?.displayName}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </>
    );
  }, [_gotoProfile, participants]);

  const RenderParticipantMini = useMemo(() => {
    return (
      <>
        {participants?.map(participant => (
          <View style={styles.miniImageContainer} key={participant.id}>
            <ViewIndicateHost width={scale(35)}>
              <ImageComponent
                uri={participant.user?.avatar || ''}
                width={scale(35)}
                height={scale(35)}
                borderRadius={scale(35)}
              />
              {participant.isHost && <View style={indicateHostStyle} />}
            </ViewIndicateHost>
          </View>
        ))}
      </>
    );
  }, [participants]);

  const RenderParticipantMiniSolo = useMemo(() => {
    return (
      <>
        {participants?.map(participant => (
          <View style={styles.miniImageContainer} key={participant.id}>
            <ViewIndicateHost width={scale(70)}>
              <ImageComponent
                uri={participant.user?.avatar || ''}
                width={scale(70)}
                height={scale(70)}
                borderRadius={scale(70)}
              />
              {participant.isHost && <View style={indicateHostStyle} />}
            </ViewIndicateHost>
          </View>
        ))}
      </>
    );
  }, [participants]);

  const opacity = React.useMemo(() => ({ opacity: state.isLoadedVideo ? 1 : 0.3 }), [state.isLoadedVideo]);

  const viewLikedUsers = React.useCallback(async () => {
    await _aniMinimize(bottomTabHeight);
    navigationRef.current?.navigate(ROOT_ROUTES.COMMENT, {
      screen: COMMENT_NAVIGATION.COMMENT_LIKES,
      initial: false,
      params: { stumpId: stumpActive?.id, screen: stumpActive?.screen, type: 'reactions' },
    });
  }, [_aniMinimize, bottomTabHeight, stumpActive?.id, stumpActive?.screen]);

  const viewSharedUsers = React.useCallback(async () => {
    await _aniMinimize(bottomTabHeight);
    navigationRef.current?.navigate(ROOT_ROUTES.COMMENT, {
      screen: COMMENT_NAVIGATION.COMMENT_LIKES,
      initial: false,
      params: { stumpId: stumpActive?.id, screen: stumpActive?.screen, title: 'Shares', type: 'sharings' },
    });
  }, [_aniMinimize, bottomTabHeight, stumpActive?.id, stumpActive?.screen]);

  const fillColorHeart = React.useMemo(() => (state.isLike ? Colors.HeartColor : Colors.White), [state.isLike]);
  const RenderPlayerAudio = React.useMemo(() => {
    return (
      <View style={styles.mainAudioPlayer}>
        {stumpActive?.notStump ? null : (
          <View>
            <TouchableOpacity style={[stylesItem.iconStyle]} onPress={likeStump} activeOpacity={0.5}>
              <IconHeart width={scale(32)} height={scale(32)} fill={fillColorHeart} />
            </TouchableOpacity>
            <TouchableOpacity onPress={viewLikedUsers} activeOpacity={0.8}>
              <TextComponent style={styles.countLikeText}>{state.countLike || ' '}</TextComponent>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={back15s}
          style={[stylesItem.iconStyle, opacity]}
          disabled={!state.isLoadedVideo}
          activeOpacity={0.8}>
          <IconBackForward width={scale(45)} height={scale(45)} />
          <Text style={styles.countLikeText} />
        </TouchableOpacity>
        {state.audioStatus !== AUDIO_STATUS.PLAYING ? (
          <TouchableOpacity
            onPress={playSound}
            disabled={!state.isLoadedVideo}
            style={[stylesItem.iconStyle]}
            activeOpacity={0.8}>
            <Icon name="play" size={scale(40)} color={Colors.Background} style={opacity} />
            <Text style={styles.countLikeText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pauseSound} style={[stylesItem.iconStyle]} disabled={!state.isLoadedVideo}>
            <Icon name="pause" size={scale(40)} color={Colors.Background} style={opacity} />
            <Text style={styles.countLikeText} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={next30s}
          style={[stylesItem.iconStyle, opacity]}
          disabled={!state.isLoadedVideo}
          activeOpacity={0.8}>
          <IconFastForward width={scale(45)} height={scale(45)} />
          <Text style={styles.countLikeText} />
        </TouchableOpacity>
        {stumpActive?.notStump ? null : (
          <View>
            <TouchableOpacity style={[stylesItem.iconStyle]} onPress={shareStump} activeOpacity={0.8}>
              <Icon name="share-social-outline" size={scale(30)} color={'#8b8b8b'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={viewSharedUsers} activeOpacity={0.8}>
              <TextComponent style={styles.countLikeText}>{stumpActive?.userShared?.length || ' '}</TextComponent>
            </TouchableOpacity>
          </View>
        )}
        {stumpActive?.notStump ? null : (
          <TouchableOpacity style={[stylesItem.iconStyle]} onPress={viewAllComment} activeOpacity={0.8}>
            <Icon name="chatbox-outline" size={scale(30)} color={'#8b8b8b'} />
            <TextComponent style={styles.countLikeText}>{stumpActive?.comments || ' '}</TextComponent>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    stumpActive?.notStump,
    stumpActive?.userShared,
    stumpActive?.comments,
    likeStump,
    fillColorHeart,
    viewLikedUsers,
    state.countLike,
    state.isLoadedVideo,
    state.audioStatus,
    back15s,
    opacity,
    playSound,
    next30s,
    shareStump,
    viewSharedUsers,
    viewAllComment,
  ]);

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

  //Gesture Responder Systems
  const onStartShouldSetResponder = () => true;
  const onResponderGrant = (evt: GestureResponderEvent) => {
    const { locationY } = evt.nativeEvent;
    setTouchY(locationY);
  };
  const onResponderMoveToMinimize = async (evt: GestureResponderEvent) => {
    const { locationY } = evt.nativeEvent;
    if (locationY - touchY > 200 && locationY - touchY < 250) {
      await _aniMinimize();
    }
  };
  const isNotANumber = (value: number) => isNaN(value);

  const getPositionValidated = (position: number) => (isNotANumber(position) ? 0 : position);

  const handleValueChange = (value: any) => {
    const validatedValue = Math.floor(getPositionValidated(value));
    setState(preState => ({ ...preState, currentTime: validatedValue, isPlaying: false }));
  };

  const styleContainer = React.useMemo(
    () => ({
      position: 'absolute',
      bottom: bottomTabHeight,
      top: scale(90),
      width: '100%',
      height: heightConsume, //scale(90) === height of header
      zIndex: 3,
      backgroundColor: Colors.Very_Light_Gray,
      transform: [{ translateY: slideYAnim }],
    }),
    [bottomTabHeight, heightConsume, slideYAnim],
  );

  const styleMiniContainer = React.useMemo(
    () => ({
      ...styles.miniView,
      position: 'absolute',
      bottom: bottomTabHeight,
      width: '100%',
      height: scale(120),
      zIndex: 4,
      transform: [{ translateY: slideYMiniAnim }],
    }),
    [bottomTabHeight, slideYMiniAnim],
  );

  const source = React.useMemo(
    () => ({ uri: (stumpActive?.file && stumpActive?.file[0]?.filePath) || '' }),
    [stumpActive?.file],
  );

  const TextDescription = React.useMemo(() => {
    if (stumpActive?.description) {
      return <TextComponent style={styles.publishText}>{stumpActive?.description}</TextComponent>;
    }
    return null;
  }, [stumpActive?.description]);

  const TextPublish = React.useMemo(() => {
    if (!stumpActive?.notStump && stumpActive?.createdAt) {
      return (
        <TextComponent style={styles.publishText}>
          Publish{' '}
          <TextComponent style={styles.publishTimeText}>{_formatDate(new Date(stumpActive?.createdAt))}</TextComponent>
        </TextComponent>
      );
    }
    return null;
  }, [stumpActive?.createdAt, stumpActive?.notStump]);

  const ConditionRenderParticipant = React.useMemo(() => {
    if (stumpActive?.mode === RECORD_MODE.FRIENDS && participants?.length > 1) {
      return <View style={styles.imageGroupContainer}>{RenderParticipant}</View>;
    }
    return <View style={[commonStyles.containerView, commonStyles.flex_1]}>{RenderParticipantSolo}</View>;
  }, [RenderParticipant, RenderParticipantSolo, participants?.length, stumpActive?.mode]);

  const ConditionRenderParticipantMini = React.useMemo(() => {
    if (stumpActive?.mode === RECORD_MODE.FRIENDS && participants?.length > 1) {
      return RenderParticipantMini;
    }
    return RenderParticipantMiniSolo;
  }, [RenderParticipantMini, RenderParticipantMiniSolo, participants?.length, stumpActive?.mode]);

  const ButtonPlayMiniMode = React.useMemo(() => {
    if (state.audioStatus === AUDIO_STATUS.PLAYING) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={pauseSound} disabled={!state.isLoadedVideo}>
          <IconPause width={scale(20)} height={scale(20)} fill={Colors.Background} style={opacity} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity activeOpacity={1} onPress={playSound} disabled={!state.isLoadedVideo}>
        <IconPlay width={scale(20)} height={scale(20)} fill={Colors.Background} style={opacity} />
      </TouchableOpacity>
    );
  }, [opacity, playSound, state.audioStatus, state.isLoadedVideo]);

  return stumpActive ? (
    <>
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
      <Animated.View
        style={styleContainer as any}
        onStartShouldSetResponder={onStartShouldSetResponder}
        onResponderGrant={onResponderGrant}
        onResponderMove={onResponderMoveToMinimize}>
        <View style={[styles.main]}>
          <TouchableOpacity style={styles.titleView} onPress={minimize}>
            <Text style={styles.titleText} numberOfLines={1}>
              {stumpActive?.title}
            </Text>
            <View style={{ height: '80%' }}>
              <IconChevronDown width={scale(16)} height={scale(16)} fill={Colors.Black} />
            </View>
          </TouchableOpacity>
          {TextDescription}
          {TextPublish}
          {ConditionRenderParticipant}
          <View>
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
      </Animated.View>
      <Animated.View style={styleMiniContainer as any}>
        <TouchableOpacity style={{ width: '100%', height: '100%', flexDirection: 'row' }} onPress={minimize}>
          <View style={styles.miniImageContainerGroup}>{ConditionRenderParticipantMini}</View>
          <View style={styles.miniSecondView}>
            <View style={styles.miniSecondTopView}>
              <Text style={styles.miniTitleText} numberOfLines={1}>
                {stumpActive?.title}
              </Text>
              <TouchableOpacity onPress={_closePlayer} activeOpacity={0.8} hitSlop={insets}>
                <IconExit width={scale(15)} height={scale(15)} fill={Colors.Black} />
              </TouchableOpacity>
            </View>
            <View style={styles.miniSecondBottomView}>
              <View style={styles.miniPlayer}>
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
              {ButtonPlayMiniMode}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  ) : null;
};
export const stylesItem = StyleSheet.create({
  iconStyle: {
    marginTop: scale(20),
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: scale(16),
    height: scale(16),
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: Colors.Background2,
    borderWidth: 2,
  },
  trackStyle: { height: scale(4) },
  containerSlider: { height: scale(20) },
});
export default ListeningComponent;
