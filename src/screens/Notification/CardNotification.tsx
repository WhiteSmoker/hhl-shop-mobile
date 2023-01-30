import React from 'react';
import {
  HighlightTextStyled,
  SmallTextStyled,
  styles,
  ViewContentStyled,
  ViewImageStyled,
  ViewNotificationStyled,
} from './Notification.style';
import { TouchableOpacity, View } from 'react-native';

import { formatDistance } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import { Notification } from '@/stores/types/notification.type';
import { IUserInfo } from '@/stores';
import { TRoomType } from '@/stores/types/chat.type';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { commonStyles, insets } from '@/styles/common';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { STATUS_NOTIFICATION } from '@/constants';
import { IconSystemNotification } from '@/assets/icons/Icon';

interface ICardNotificationProps {
  item: Notification;
  createdAt: string | Date;
  disablePressNotification: boolean;
  user?: IUserInfo;
  myInfo?: IUserInfo;
  avatarChilds?: IUserInfo[];
  disablePressAvatar?: boolean;
  message?: string;
  showLogo?: boolean;
  messageHasBold?: string;
  otherAction?: 'create' | 'follow';
  onPressAvatar?: (id: number) => void;
  onPressCheckmark?: (notiId: number, conversationId: number, isHost: boolean) => void;
  onPressClose?: (id: number, hostId: number, conversationId: number, isHide: boolean) => void;
  pressNotificationGetUserId?: (userId: number) => void;
  pressNotificationGetStumpId?: (stumpId: number) => void;
  onPressNotificationCreate?: (conversationId: number, notiId: number, isHost: boolean) => void;
  onPressNotificationRemind?: (notiId: number, conversationId: number, isHost: boolean) => void;
  onPressNotificationFollow?: (followId: number, follow: boolean) => void;
  onPressNotificationMention?: (commentId: number, stumpId: number) => void;
  onPressNotificationChat?: (roomId: number, type: TRoomType) => void;
}
export const CardNotification = React.memo(
  ({
    onPressAvatar,
    onPressCheckmark,
    onPressClose,
    pressNotificationGetUserId,
    pressNotificationGetStumpId,
    onPressNotificationCreate,
    onPressNotificationRemind,
    onPressNotificationFollow,
    onPressNotificationMention,
    onPressNotificationChat,
    // tslint:disable-next-line: trailing-comma
    ...rest
  }: ICardNotificationProps) => {
    const clickAvatar = React.useCallback(
      (userId: number) => () => {
        if (onPressAvatar) {
          onPressAvatar(userId);
        }
      },
      [onPressAvatar],
    );

    const clickNotification = () => {
      if (pressNotificationGetStumpId) {
        pressNotificationGetStumpId(rest.item.stumpId || rest.item?.data?.stumpId || 0);
      }
      if (pressNotificationGetUserId) {
        pressNotificationGetUserId(rest.item.data?.userInfo?.id);
      }
      if (onPressNotificationCreate) {
        onPressNotificationCreate(
          rest.item.data?.conversationId,
          rest.item.id,
          rest.item?.data?.userInfo?.id === rest.item.userId,
        );
      }
      if (onPressNotificationRemind) {
        onPressNotificationRemind(
          rest.item.id,
          rest.item.data?.conversationId,
          rest.item?.data?.userInfo?.id === rest.item.userId,
        );
      }
      if (onPressNotificationMention) {
        onPressNotificationMention(rest.item.data.commentId, rest.item.stumpId || 0);
      }
      if (onPressNotificationChat) {
        onPressNotificationChat(rest.item.data.roomId, rest.item.data.roomType);
      }
    };

    const ShowLogo = React.useMemo(
      () => (rest.showLogo ? <IconSystemNotification width={scale(35)} height={scale(35)} fill={'black'} /> : null),
      [rest.showLogo],
    );
    const ShowAvatar = React.useMemo(
      () =>
        !rest.showLogo ? (
          <TouchableOpacity onPress={clickAvatar(rest.user?.id || 0)} hitSlop={insets} disabled={!onPressAvatar}>
            <ImageComponent
              uri={rest.user?.avatar || ''}
              width={scale(36)}
              height={scale(36)}
              borderRadius={scale(36)}
            />
          </TouchableOpacity>
        ) : null,
      [rest.showLogo, rest.user, clickAvatar, onPressAvatar],
    );

    const MessageNotification = React.useMemo(() => {
      if (rest.messageHasBold) {
        const textBold = rest.messageHasBold.split('<b>').join('').split('</b>');
        return (
          <HighlightTextStyled numberOfLines={3}>
            <HighlightTextStyled>
              <HighlightTextStyled fontWeight={'bold'}>{textBold[0]}</HighlightTextStyled>
              {textBold[1]}
            </HighlightTextStyled>
          </HighlightTextStyled>
        );
      }
      return <HighlightTextStyled numberOfLines={3}>{rest.message}</HighlightTextStyled>;
    }, [rest.message, rest.messageHasBold]);

    const TextDateDiffNotification = React.useMemo(
      () => (
        <HighlightTextStyled color={Colors.Dark_grayish_blue}>
          {formatDistance(new Date(rest.createdAt), new Date(), { addSuffix: true })}
        </HighlightTextStyled>
      ),
      [rest.createdAt],
    );

    const ArrayAvatarChild = React.useMemo(() => {
      return rest.avatarChilds ? (
        <ViewImageStyled>
          {rest.avatarChilds.map(user => (
            <TouchableOpacity key={user.id} onPress={clickAvatar(user.id)} style={{ paddingRight: scale(3) }}>
              <ImageComponent uri={user?.avatar || ''} width={scale(28)} height={scale(28)} borderRadius={scale(28)} />
            </TouchableOpacity>
          ))}
        </ViewImageStyled>
      ) : null;
    }, [rest.avatarChilds, clickAvatar]);

    const tickCheckmark = React.useCallback(() => {
      if (onPressCheckmark) {
        onPressCheckmark(
          rest.item.id,
          rest.item.data.conversationId,
          rest.item?.data?.userInfo?.id === rest.item.userId,
        );
      }
    }, [onPressCheckmark, rest.item]);

    const hideNoti = React.useCallback(() => {
      if (onPressClose) {
        onPressClose(rest.item.id, rest.item.data?.userInfo?.id, rest.item.data?.conversationId, !!rest.item.isHide);
      }
    }, [onPressClose, rest.item]);

    const followBack = React.useCallback(
      (followId: number, follow: boolean) => () => {
        if (onPressNotificationFollow) {
          onPressNotificationFollow(followId, follow);
        }
      },
      [onPressNotificationFollow],
    );

    const OtherAction = React.useMemo(() => {
      switch (rest.otherAction) {
        case 'create': {
          return (
            <View style={[commonStyles.flex_1, commonStyles.flexRow]}>
              <View style={styles.viewContent_4}>
                {MessageNotification}
                {TextDateDiffNotification}
              </View>
              {rest.item?.data?.userInfo?.id !== rest.item.userId ? (
                <>
                  {rest.item.status !== STATUS_NOTIFICATION.JOIN_NOW && (
                    <View style={styles.viewAction_1}>
                      <TouchableOpacity onPress={tickCheckmark} activeOpacity={0.5}>
                        <Icon name="checkmark-sharp" size={scale(24)} color={Colors.Background} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={hideNoti} activeOpacity={0.5}>
                        <Icon name="close-sharp" size={scale(24)} color={Colors.Red} />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : null}
            </View>
          );
        }
        case 'follow': {
          const index = rest.myInfo?.listFollowing?.rows?.findIndex(row => row.id === rest.item.data?.userInfo?.id);
          const isFollow = index !== -1 ? true : false;
          return (
            <View style={[commonStyles.flex_1, commonStyles.flexRow]}>
              <View style={styles.viewContent_3}>
                {MessageNotification}
                {TextDateDiffNotification}
              </View>
              <View style={styles.viewAction_2}>
                {isFollow ? (
                  <TouchableOpacity
                    style={[commonStyles.flex_1, styles.btnFollower]}
                    onPress={followBack(rest.item.data?.userInfo?.id, isFollow)}>
                    <SmallTextStyled numberOfLines={1}>Unfollow</SmallTextStyled>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[commonStyles.flex_1, styles.btnFollowing]}
                    onPress={followBack(rest.item.data?.userInfo?.id, isFollow)}>
                    <SmallTextStyled numberOfLines={1} color={Colors.White}>
                      Follow back
                    </SmallTextStyled>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }
        default: {
          break;
        }
      }
    }, [
      rest.otherAction,
      rest.item.data?.userInfo?.id,
      rest.item.userId,
      rest.item.status,
      rest.myInfo,
      MessageNotification,
      TextDateDiffNotification,
      tickCheckmark,
      hideNoti,
      followBack,
    ]);

    return (
      <ViewNotificationStyled
        backgroundColor={rest.item.status === STATUS_NOTIFICATION.NOT_SEEN ? '' : Colors.White}
        onPress={clickNotification}
        disabled={rest.disablePressNotification}>
        <ViewImageStyled>
          {ShowLogo}
          {ShowAvatar}
        </ViewImageStyled>
        {!rest.otherAction ? (
          <ViewContentStyled>
            {MessageNotification}
            {ArrayAvatarChild}
            {TextDateDiffNotification}
          </ViewContentStyled>
        ) : (
          OtherAction
        )}
      </ViewNotificationStyled>
    );
  },
);
CardNotification.displayName = 'CardNotification';
