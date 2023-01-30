import React, { useRef } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { IProps } from './propState';
import { ImageComponent } from '@/containers/components/ImageComponent';
import {
  _padding,
  AvatarContainerStyled,
  HashtagStyled,
  IconTitleStyled,
  InformationCardStyled,
  ListParticipantStyled,
  styles,
  TextActionStyled,
  TextHashtagStyled,
  TextParticipantStyled,
  TextTitleStyled,
  ViewActionStyled,
  ViewContainerCard,
  ViewSharePlayStyled,
  ViewTitleStyled,
} from './styles';
import { APP_NAVIGATION, COMMENT_NAVIGATION, PROFILE_NAVIGATION, ROOT_ROUTES, SEARCH_NAVIGATION } from '@/constants';
import { indicateHostStyle } from '@/styles/styled-component';
import { RECORD_MODE } from '@/constants/service';
import { scale } from 'react-native-size-scaling';
import { formatLargeNumber, formatTime } from '@/utils/format';
import { Colors } from '@/theme/colors';
import { commonStyles } from '@/styles/common';
import { sortParticipantByHostHelper } from '@/utils/array';
import { useAppSelector } from '@/stores';
import { IconHeart, IconPlay, IconShare, IconTop } from '@/assets/icons/Icon';
import { commonSlice, stumpSlice } from '@/stores/reducers';
import SwipeableComponent from '../SwipeableComponent';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { shareModalRef } from '@/refs';
import { stumpController } from '@/controllers';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextComponent } from '../TextComponent';
import { useGetAds } from '@/hooks/useGetAds';
import { useIsRecording } from '@/hooks/useIsRecording';

const CardComponent = (props: IProps) => {
  const userInfo = useAppSelector((rootState: any) => rootState.userState.userInfo);
  const countPlay = useAppSelector((rootState: any) => rootState.commonState.countPlay);
  const { data } = props;
  const dispatch = useDispatch();
  const { getRandomAds } = useGetAds();
  const { isBlockMe } = useUserBlockMe();
  const isRecording = useIsRecording();

  const childRef = useRef<any>();
  const _shareStump = async () => {
    try {
      shareModalRef.current?.open(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const _playStumpMaximum =
    (maximum = true) =>
    async () => {
      try {
        if (data.isAds) {
          await Linking.openURL(data?.link as string);
          return;
        }
        if (isRecording) {
          return;
        }
        if (countPlay + 1 === 2) {
          getRandomAds();
        } else {
          dispatch(commonSlice.actions.setCountPlayStump(countPlay + 1));
        }
        dispatch(commonSlice.actions.setPlayStump({ ...data, screen: props.screen, maximum }));
      } catch (error: any) {
        console.log(error);
      }
    };

  const _gotoProfile = (userId: number | undefined) => () => {
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

  const _likeStump = async () => {
    try {
      const stumpId = data.id;
      const userId = userInfo?.id || 0;
      let type = 1;
      const indexStump = data.reactions!.rows.findIndex(e => e.userId === userId);
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

  const RenderParticipant = () => {
    const participants =
      sortParticipantByHostHelper(data?.participants || [])?.filter(p => !!p.active && !!p.isAccepted) || [];
    return (
      <>
        {participants?.map((member, index: number) => {
          return data.mode === RECORD_MODE.FRIENDS && participants.length > 1 ? (
            <TouchableOpacity
              key={member.id}
              style={_padding(index)}
              onPress={_gotoProfile(member.userId)}
              onLongPress={onLongPress}>
              <ImageComponent
                uri={member.user?.avatar || ''}
                width={scale(44)}
                height={scale(44)}
                borderRadius={scale(44)}
              />
              {member.isHost && <View style={indicateHostStyle} />}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={member.id}
              onPress={_gotoProfile(member.userId)}
              onLongPress={onLongPress}
              style={styles.avatarBigSize}>
              <ImageComponent
                uri={member.user?.avatar || ''}
                width={scale(90)}
                height={scale(90)}
                borderRadius={scale(90)}
              />
              {member.isHost && <View style={indicateHostStyle} />}
            </TouchableOpacity>
          );
        })}
        {participants?.length === 2 && data.mode === RECORD_MODE.FRIENDS && (
          <View style={{ height: scale(44), width: scale(44) }} />
        )}
        {participants?.length === 0 && (
          <ImageComponent uri={data?.logo || ''} width={scale(90)} height={scale(90)} borderRadius={scale(90)} />
        )}
      </>
    );
  };

  const RenderDisplayName = () => {
    const participants =
      sortParticipantByHostHelper(data?.participants || [])?.filter(p => !!p.active && !!p.isAccepted) || [];
    return (
      <>
        {participants?.map(member => {
          return (
            <TouchableOpacity key={member.id} onPress={_gotoProfile(member.userId)} onLongPress={onLongPress}>
              <TextParticipantStyled numberOfLines={1}>
                @
                <TextComponent style={{ textDecorationLine: 'underline' }}>
                  {member.userId ? member.user?.displayName : member.inviteValue?.split('@')[0]}
                </TextComponent>
              </TextParticipantStyled>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const _clickHashTag = (hashTag: string) => () => {
    props.navigation.navigate(APP_NAVIGATION.SEARCH, {
      screen: SEARCH_NAVIGATION.SEARCH,
      params: { hashTag, indexActive: { index: 2 } },
      initial: false,
    });
  };

  const RenderHashTag = () => {
    return (
      <>
        {data.listStump?.map((hashTag, index: number) =>
          hashTag?.length ? (
            <TouchableOpacity key={index} onPress={_clickHashTag(hashTag)} onLongPress={onLongPress}>
              <TextHashtagStyled numberOfLines={1}>#{hashTag}</TextHashtagStyled>
            </TouchableOpacity>
          ) : null,
        )}
      </>
    );
  };

  const RenderListTag = () => {
    let listTag: any = [];
    if (data?.listLeagueTag) {
      listTag = [...listTag, ...data?.listLeagueTag];
    }
    if (data?.listMarketTag) {
      listTag = [...listTag, ...data?.listMarketTag];
    }
    if (data?.listSportTag) {
      listTag = [...listTag, ...data?.listSportTag];
    }
    if (data?.listTeamTag) {
      listTag = [...listTag, ...data?.listTeamTag];
    }
    return (
      <>
        {listTag?.map((hashTag: any, index: number) =>
          hashTag?.length ? (
            <TouchableOpacity key={index} onPress={_clickHashTag(hashTag)} onLongPress={onLongPress}>
              <TextHashtagStyled numberOfLines={1}>#{hashTag}</TextHashtagStyled>
            </TouchableOpacity>
          ) : (
            <Text />
          ),
        )}
      </>
    );
  };

  const onLongPress = () => {
    childRef?.current?.open();
  };

  const viewAllComment = () => {
    props.navigation.navigate(ROOT_ROUTES.COMMENT, {
      screen: COMMENT_NAVIGATION.ALL_COMMENT,
      initial: false,
      params: { stumpId: data.id, screen: props.screen },
    });
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
      <View style={[commonStyles.flatlist_item]}>
        <TouchableOpacity onPress={_playStumpMaximum(true)} onLongPress={onLongPress} activeOpacity={0.8}>
          <ViewContainerCard>
            <View style={[commonStyles.flex_1]}>
              <AvatarContainerStyled>{RenderParticipant()}</AvatarContainerStyled>
            </View>

            <InformationCardStyled>
              <ViewTitleStyled>
                {data.isFeaturedPost ? (
                  <IconTitleStyled>
                    <IconTop />
                  </IconTitleStyled>
                ) : null}
                <TextTitleStyled>{data?.title}</TextTitleStyled>
              </ViewTitleStyled>
              <TextHashtagStyled color={Colors.Black} numberOfLines={2}>
                {data?.description}
              </TextHashtagStyled>
              <ListParticipantStyled>{RenderDisplayName()}</ListParticipantStyled>
              <HashtagStyled>{data?.listStump?.length ? RenderHashTag() : <Text />}</HashtagStyled>
              <HashtagStyled>{RenderListTag()}</HashtagStyled>
              <TextHashtagStyled color={Colors.Black}>
                Duration:{' '}
                <TextHashtagStyled color={Colors.Black} fontWeight={'bold'}>
                  {formatTime((data?.file && data?.file[0]?.duration) || 0)}
                </TextHashtagStyled>
              </TextHashtagStyled>
            </InformationCardStyled>
            {data?.isAds ? null : (
              <View style={[commonStyles.containerView]}>
                <TouchableOpacity onPress={_likeStump} onLongPress={onLongPress}>
                  <IconHeart
                    width={scale(25)}
                    height={scale(25)}
                    fill={
                      data?.reactions?.rows?.filter(e => e.userId === userInfo?.id && e.type).length
                        ? Colors.Vivid_red
                        : Colors.White
                    }
                  />
                </TouchableOpacity>

                <TextHashtagStyled color={Colors.Black}>
                  {(data?.reactions?.rows || []).filter(e => e.type).length || ''}
                </TextHashtagStyled>
              </View>
            )}
          </ViewContainerCard>
        </TouchableOpacity>
        {data.isAds ? null : (
          <ViewSharePlayStyled>
            <View style={commonStyles.flex_1} />
            <TouchableOpacity style={[commonStyles.flex_1, commonStyles.flexRow]} onPress={viewAllComment}>
              {/* <IconMessage width={scale(13)} height={scale(13)} /> */}
              <Icon name="chatbox-outline" size={scale(13)} color={Colors.Background2} />
              <TextComponent style={styles.textAllComment}> {data?.comments ? data?.comments : ''}</TextComponent>
            </TouchableOpacity>
            <View style={styles.viewLikeShare}>
              <ViewActionStyled onPress={_playStumpMaximum()} onLongPress={onLongPress}>
                <IconPlay width={scale(13)} height={scale(13)} />
                <TextActionStyled color={Colors.Dark_Gray_8B}>
                  {data.playCounter ? formatLargeNumber(data.playCounter) : ' Play'}
                </TextActionStyled>
              </ViewActionStyled>
              <ViewActionStyled onPress={_shareStump} onLongPress={onLongPress}>
                <IconShare width={scale(13)} height={scale(13)} />
                <TextActionStyled color={Colors.Dark_Gray_8B}>
                  {data.userShared && data.userShared.length ? formatLargeNumber(data.userShared?.length) : ' Share'}
                </TextActionStyled>
              </ViewActionStyled>
            </View>
          </ViewSharePlayStyled>
        )}
      </View>
    </SwipeableComponent>
  );
};

export default React.memo(CardComponent);
