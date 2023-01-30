import { CHAT_NAVIGATION } from '@/constants';
import { _padding } from '@/containers/components/CardComponent/styles';
import { ImageComponent } from '@/containers/components/ImageComponent';
import SwipeableComponent from '@/containers/components/SwipeableComponent';
import { TextComponent } from '@/containers/components/TextComponent';
import { chatController } from '@/controllers/chat.controller';
import { useGetMyId } from '@/hooks/useGetMyId';
import { ICardConversationProps } from '@/stores/types/chat.type';
import { Colors } from '@/theme/colors';
import { diffFormatDistanceMonthMinute } from '@/utils/date-fns.config';
import React, { useRef } from 'react';
import { Alert, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';

export const CardConversation = React.memo(({ item, navigation, mode }: ICardConversationProps) => {
  const myId = useGetMyId();
  const childRef = useRef<any>();

  const otherMembers = React.useMemo(() => item.members.filter(mem => mem.id !== myId), [item.members, myId]);

  const isUnread = React.useMemo(() => {
    if (mode) {
      return false;
    }
    const seenLastMsgId = item.members.find(mem => mem.id === myId)?.lastMsgId || 0;
    return seenLastMsgId < item.messages[0]?.id;
  }, [item, myId, mode]);

  const navigate = React.useCallback(async () => {
    try {
      if (mode && !item.id) {
        const res = await chatController.createRoom([...otherMembers.map(mem => mem.id)], 'CHAT');
        if (res.status === 1) {
          navigation.push(CHAT_NAVIGATION.IN_ROOM_CHAT, {
            screen: CHAT_NAVIGATION.ALL_CONVERSATION,
            roomId: res.data.roomId,
            type: res.data.type,
          });
        } else {
          Alert.alert(res.data as any);
        }
        //
      } else {
        navigation.push(CHAT_NAVIGATION.IN_ROOM_CHAT, {
          screen: CHAT_NAVIGATION.ALL_CONVERSATION,
          roomId: item.id,
          type: item.type,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [item.id, item.type, mode, navigation, otherMembers]);

  const onLongPress = React.useCallback(() => {
    childRef.current?.open();
  }, []);

  const styleTextLastMsg: TextStyle = React.useMemo(
    () => ({
      ...styles.textStatus,
      color: isUnread ? Colors.dark : Colors.Dark_Gray2,
      fontFamily: isUnread ? 'Lexend-Bold' : 'Lexend-Medium',
      textAlignVertical: 'bottom',
    }),
    [isUnread],
  );

  const styleTextTime: TextStyle = React.useMemo(
    () => ({
      fontSize: scale(13),
      color: isUnread ? Colors.dark : Colors.Dark_Gray2,
      fontFamily: isUnread ? 'Lexend-Bold' : 'Lexend-Medium',
      textAlignVertical: 'bottom',
      marginLeft: scale(6),
      alignItems: 'flex-end',
    }),
    [isUnread],
  );

  const styleTextNameRoom: TextStyle = React.useMemo(
    () => ({
      ...styles.textUserChat,
      fontFamily: isUnread ? 'Lexend-Bold' : 'Lexend-Medium',
    }),
    [isUnread],
  );

  const styleDotUnread: ViewStyle = React.useMemo(
    () => ({
      position: 'absolute',
      width: scale(10),
      height: scale(10),
      borderRadius: scale(10),
      backgroundColor: Colors.Soft_Blue,
      zIndex: 1,
      right: scale(15),
      opacity: isUnread ? 1 : 0,
    }),
    [isUnread],
  );

  const RenderAvatar = React.useMemo(() => {
    if (!otherMembers.length) {
      return;
    }
    if (item.type === 'GROUP_CHAT') {
      return (
        <View style={styles.avtWrapper}>
          {item.members.map((mem, index) => {
            return (
              <View key={mem.id} style={_padding(index)}>
                <ImageComponent uri={mem?.avatar || ''} width={scale(40)} height={scale(40)} borderRadius={scale(40)} />
              </View>
            );
          })}
        </View>
      );
    }
    return (
      <View style={styles.avtWrapper}>
        <ImageComponent
          uri={otherMembers[0]?.avatar || ''}
          width={scale(80)}
          height={scale(80)}
          borderRadius={scale(80)}
          style={styles.avt}
        />
      </View>
    );
  }, [item.members, item.type, otherMembers]);

  const timeComment = React.useMemo(() => {
    const lastMsg = item.messages[0];
    return lastMsg && lastMsg?.createdAt ? diffFormatDistanceMonthMinute(lastMsg?.createdAt) : '';
  }, [item.messages]);

  const NameRoom = React.useMemo(() => {
    const nameGroup = item.members
      .map(mem => mem.firstName + ' ' + mem.lastName)
      .toString()
      .replace(/[,]/gi, ', ');
    if (!otherMembers.length) {
      return;
    }
    if (item.type === 'GROUP_CHAT') {
      return (
        <TextComponent numberOfLines={1} style={styleTextNameRoom}>
          {item.name || nameGroup}
        </TextComponent>
      );
    }
    return (
      <TextComponent numberOfLines={1} style={styleTextNameRoom}>
        {otherMembers[0]?.firstName + ' ' + otherMembers[0]?.lastName}
      </TextComponent>
    );
  }, [item.members, item.name, item.type, otherMembers, styleTextNameRoom]);

  const RenderTypeLastMessage = React.useMemo(() => {
    const typeLastMsg = item?.messages[0]?.type;
    switch (typeLastMsg) {
      case 'VIDEO':
        return (
          <TextComponent numberOfLines={1} style={styleTextLastMsg}>
            <Icon name="videocam-outline" size={scale(18)} color={isUnread ? Colors.dark : Colors.Dark_Gray2} /> Video
          </TextComponent>
        );
      case 'IMAGE':
        return (
          <>
            <TextComponent numberOfLines={1} style={styleTextLastMsg}>
              <Icon name="image-outline" size={scale(18)} color={isUnread ? Colors.dark : Colors.Dark_Gray2} /> Image
            </TextComponent>
          </>
        );
      case 'AUDIO':
        return (
          <TextComponent numberOfLines={1} style={styleTextLastMsg}>
            <Icon name="mic-outline" size={scale(18)} color={isUnread ? Colors.dark : Colors.Dark_Gray2} /> Audio
          </TextComponent>
        );
      default:
        return (
          <TextComponent numberOfLines={1} style={styleTextLastMsg}>
            {item?.messages[0]?.message}
          </TextComponent>
        );
    }
  }, [isUnread, item?.messages, styleTextLastMsg]);

  const LastMessage = React.useMemo(() => {
    if (mode) {
      return null;
    }
    const lastMsg = item?.messages[0];
    const isMine = lastMsg?.senderId === myId;
    const sender = item?.members?.filter(mem => mem.id === lastMsg?.senderId);
    return (
      <View style={{ flexDirection: 'row', height: scale(24), alignItems: 'flex-end' }}>
        <View style={styles.wrapText}>
          <TextComponent numberOfLines={1} style={styleTextLastMsg}>
            {isMine ? 'You' : sender[0]?.firstName} sent: {RenderTypeLastMessage}
          </TextComponent>
        </View>
        <TextComponent numberOfLines={1} style={styleTextTime}>
          {timeComment}
        </TextComponent>
      </View>
    );
  }, [mode, item?.messages, item?.members, myId, styleTextLastMsg, RenderTypeLastMessage, styleTextTime, timeComment]);

  return (
    <SwipeableComponent ref={childRef} data={item} functionType={'message'}>
      <TouchableOpacity style={styles.container} onPress={navigate} onLongPress={onLongPress}>
        {RenderAvatar}
        <View style={styles.middleView}>
          {NameRoom}
          {LastMessage}
        </View>
        <View style={styleDotUnread} />
      </TouchableOpacity>
    </SwipeableComponent>
  );
});
CardConversation.displayName = 'ChatScreen/CardConversation';

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, padding: scale(12), alignItems: 'center' },
  middleView: { flex: 1, flexShrink: 1, marginRight: scale(25) },
  textUserChat: { color: Colors.dark, fontSize: scale(16) },
  textStatus: { color: Colors.Dark_Gray2, fontSize: scale(13) },
  avt: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    borderColor: Colors.primaryColor05,
    borderWidth: scale(1),
  },
  avtWrapper: {
    width: scale(100),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  wrapText: { flexDirection: 'row', alignItems: 'center', maxWidth: '80%', flexWrap: 'wrap' },
});
