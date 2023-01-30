import { IconHeart } from '@/assets/icons/Icon';
import { APP_NAVIGATION, PROFILE_NAVIGATION, RECORD_MODE } from '@/constants';
import { stumpController } from '@/controllers';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { useIsRecording } from '@/hooks/useIsRecording';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { TAppDispatch, useAppSelector } from '@/stores';
import { commonSlice, stumpSlice } from '@/stores/reducers';
import { commonStyles, indicateHostStyle } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { sortParticipantByHostHelper } from '@/utils/array';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import { _padding } from '../CardComponent/styles';
import { ImageComponent } from '../ImageComponent';
import SwipeableComponent from '../SwipeableComponent';
import { styles, TextCompactCard } from './index.style';

const CompactCardComponent: React.FC<any> = props => {
  const { data } = props;

  const { isBlockMe } = useUserBlockMe();
  const isRecording = useIsRecording();
  const dispatch = useDispatch<TAppDispatch>();

  const childRef = React.useRef<any>();

  const userInfo = useAppSelector(rootState => rootState.userState.userInfo);

  const handleLikeStump = async () => {
    try {
      const stumpId = data.id;
      const userId = userInfo?.id || 0;
      let type = 1;
      const indexStump = data.reactions!.rows.findIndex((e: any) => e.userId === userId);
      if (indexStump !== -1) {
        type = Number(!data.reactions!.rows[indexStump].type);
      }
      const res = await stumpController.reactionStump(userId, stumpId, type);

      if (res.status === 1) {
        emitter(EDeviceEmitter.UPDATE_COUNT_LIKE_PROFILE, type ? 1 : -1);
        dispatch(stumpSlice.actions.setLikedStump(data));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleGoToProfile = (userId?: number) => () => {
    try {
      if (!userId) {
        return;
      }
      isBlockMe(userId);
      if (userId === userInfo?.id) {
        props.navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
          initial: false,
        });
        return;
      }

      props.navigation.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.VIEW_PROFILE,
        initial: false,
        params: { userId, screen: props.screen },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayStump = () => {
    if (isRecording) {
      return;
    }
    dispatch(commonSlice.actions.setPlayStump({ ...data, screen: props.screen, maximum: true }));
  };

  const handleLongPress = () => {
    childRef?.current?.open();
  };

  const renderParticipant = () => {
    const participants =
      sortParticipantByHostHelper(data?.participants || [])?.filter(p => !!p.active && !!p.isAccepted) || [];

    return (
      <>
        {participants?.map((member, index: number) =>
          data.mode === RECORD_MODE.FRIENDS && participants.length > 1 ? (
            <TouchableOpacity
              key={member.id}
              onPress={handleGoToProfile(member.userId)}
              onLongPress={handleLongPress}
              style={_padding(index)}>
              <ImageComponent
                uri={member.user?.avatar || ''}
                width={scale(44)}
                height={scale(44)}
                borderRadius={scale(44)}
              />
              {member.isHost && <View style={indicateHostStyle} />}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={member.id} onPress={handleGoToProfile(member.userId)} onLongPress={handleLongPress}>
              <ImageComponent
                uri={member.user?.avatar || ''}
                width={scale(90)}
                height={scale(90)}
                borderRadius={scale(90)}
              />
              {member.isHost && <View style={indicateHostStyle} />}
            </TouchableOpacity>
          ),
        )}
        {participants?.length === 2 && data.mode === RECORD_MODE.FRIENDS && (
          <View style={{ height: scale(44), width: scale(44) }} />
        )}
      </>
    );
  };

  const renderDisplayName = () => {
    const participants =
      sortParticipantByHostHelper(data?.participants || [])?.filter(p => !!p.active && !!p.isAccepted) || [];

    return (
      <>
        {participants?.map(member => (
          <TouchableOpacity key={member.id}>
            <TextCompactCard
              fontSize={12}
              lineHeight={15}
              marginRight={6}
              marginTop={10}
              color={Colors.Background2}
              numberOfLines={2}>
              @{member.userId ? member.user?.displayName : member.inviteValue?.split('@')[0]}
            </TextCompactCard>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <SwipeableComponent
      ref={childRef}
      myId={userInfo?.id ?? 0}
      type={'stump'}
      typeScreen={'stump'}
      data={{ ...data, screen: props.screen }}
      screen={props.screen || ''}
      editable={true}>
      <View style={[commonStyles.flatlist_compact_item]}>
        <TouchableOpacity onPress={handlePlayStump} onLongPress={handleLongPress} activeOpacity={0.8}>
          <View style={commonStyles.flexRow}>
            <View style={styles.avatarContainer}>{renderParticipant()}</View>
            <View style={styles.infoContainer}>
              <TextCompactCard fontSize={16} lineHeight={20} numberOfLines={2}>
                {data?.title}
              </TextCompactCard>
              <TextCompactCard
                fontSize={12}
                lineHeight={15}
                marginRight={6}
                marginTop={6}
                color={Colors.Dark_Gray1}
                numberOfLines={2}>
                {data?.description}
              </TextCompactCard>
              <View style={styles.listParticipant}>{renderDisplayName()}</View>
            </View>
            <View style={[commonStyles.containerView]}>
              <TouchableOpacity onPress={handleLikeStump} onLongPress={handleLongPress}>
                <IconHeart
                  width={scale(25)}
                  height={scale(25)}
                  fill={
                    data?.reactions?.rows?.filter((e: any) => e.userId === userInfo?.id && e.type).length
                      ? Colors.Vivid_red
                      : Colors.white
                  }
                />
              </TouchableOpacity>
              <TextCompactCard fontSize={12} lineHeight={15} marginTop={6}>
                {(data?.reactions?.rows || []).filter((e: any) => e.type).length || ''}
              </TextCompactCard>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SwipeableComponent>
  );
};

export default React.memo(CompactCardComponent);
