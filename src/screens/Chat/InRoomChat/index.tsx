import { differenceInMinutes } from 'date-fns';
import React from 'react';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import {
  ActionsProps,
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  GiftedChat,
  InputToolbar,
  InputToolbarProps,
  LoadEarlier,
  LoadEarlierProps,
  SendProps,
  Time,
} from 'react-native-gifted-chat';

import { messageTextContainerStyle, messageTextStyle, styles, timeTextStyle } from './styles';
import { LaunchGallery } from './LaunchGallery';
import { MessageMedia } from './MessageMedia';
import { RecordSpeech } from './RecordSpeech';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from '@/styles/common';
import { SendText } from './SendText';
import { MessageAudio } from './MessageAudio';
import { SeenUser } from './SeenUser';
import { AmountLikeMsg } from './AmountLikeMsg';
import { LaunchGif } from './LaunchGif';
import { EditNamePopup } from './EditNamePopup';
import { scale } from 'react-native-size-scaling';
import { useGetMyId } from '@/hooks/useGetMyId';
import { useAuth } from '@/hooks/useAuth';
import { IEditNamePopupRef, IInRoomChatProps, IRecordSpeechRef, ITempMessage } from '@/stores/types/chat.type';
import { IButtonSheetRef } from '@/containers/components/ButtonSheet/propState';
import { Colors } from '@/theme/colors';
import { chatController } from '@/controllers/chat.controller';
import { DoubleTap } from '@/containers/components/DoubleTap';
import { APP_NAVIGATION, PROFILE_NAVIGATION } from '@/constants';
import { ifNotchIphone } from '@/theme/scale';
import { ButtonSheet } from '@/containers/components/ButtonSheet';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { InRoomChatHeader } from '@/navigators/headers/InRoomChatHeader';
import { useChatRoomController } from '@/hooks/useChatRoomController';
import { fetchListRoom } from '@/stores/thunks/chat.thunk';
import { useAppDispatch, useAppSelector } from '@/stores';
import useKeyboard from '@/hooks/useKeyboard';
import { TextComponent } from '@/containers/components/TextComponent';

export const HEIGHT_INPUT = scale(80 - 12 - 20);

export const InRoomChat = React.memo(({ navigation, route }: IInRoomChatProps) => {
  const myId = useGetMyId();
  const userInfo = useAuth();
  const { isBlockMe } = useUserBlockMe();
  const dispatch = useAppDispatch();
  const buttonSheetRef = React.useRef<IButtonSheetRef>();
  const editNamePopup = React.useRef<IEditNamePopupRef>();
  const detailRoom = useAppSelector(rootState => rootState.chatState.detailRoom);
  const messages = useAppSelector(rootState => rootState.chatState.messages);
  const { status: keyboardStatus } = useKeyboard();
  const rooms = useAppSelector(rootState => rootState.chatState.rooms);
  const roomId = React.useMemo(() => route.params?.roomId, [route.params?.roomId]);
  const screen = React.useMemo(() => route.params?.screen, [route.params?.screen]);
  const type = React.useMemo(() => route.params?.type, [route.params?.type]);
  const partnerId = React.useMemo(
    () => (detailRoom?.members || [])?.filter(mem => mem.id !== myId)[0]?.id || 0,
    [detailRoom?.members, myId],
  );
  const otherMembers = React.useMemo(
    () => detailRoom?.members?.filter(mem => mem.id !== userInfo?.id) || [],
    [detailRoom, userInfo?.id],
  );
  const {
    isLoadMore,
    inputHeightChange,
    loadMoreMessage,
    acceptMessage,
    deleteMessage,
    blockUser,
    unblockUser,
    onInputSizeChanged,
  } = useChatRoomController(roomId, navigation, type, partnerId);
  const recordSpeechRef = React.useRef<IRecordSpeechRef>();
  const giftedChatRef = React.useRef<GiftedChat>();

  const openRecord = React.useCallback(() => {
    recordSpeechRef.current?.open();
  }, []);

  const onLongPress = React.useCallback(
    (messageId: number | string, isLike: boolean) => () => {
      try {
        const btns = [
          {
            label: isLike ? 'Unlike' : 'Like',
            color: Colors.red,
            onPress: async () => {
              buttonSheetRef.current?.close();
              if (typeof messageId !== 'number') {
                return;
              }
              await chatController.likeMessage(messageId);
            },
          },
        ];
        buttonSheetRef.current?.setButtons(btns);
        buttonSheetRef.current?.open();
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const likeMsg = React.useCallback(
    (messageId: number) => async () => {
      await chatController.likeMessage(messageId);
    },
    [],
  );

  const onSend = React.useCallback(
    async (msgs: ITempMessage[]) => {
      try {
        const arrMessage = [] as any;
        giftedChatRef.current?.scrollToBottom();
        msgs.forEach(e => {
          const newMessage = { roomId, message: { ...e, _id: e.tempId, user: { ...e.user, id: Number(e.user._id) } } };
          arrMessage.push(chatController.sendMessage(newMessage));
        });
        await Promise.all(arrMessage);
        if (!rooms.map(room => room.id).includes(roomId)) {
          dispatch(fetchListRoom({}));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, roomId, rooms],
  );

  const userGiftedChat = React.useMemo(
    () => ({
      _id: userInfo?.id,
      avatar: userInfo?.avatar,
      name: `${userInfo?.firstName} ${userInfo?.lastName}`,
    }),
    [userInfo],
  );

  const NoRender = React.useMemo(() => () => <></>, []);

  const renderBubble = React.useMemo(
    () => (props: BubbleProps<ITempMessage>) => {
      let renderTime = true;
      let messCurrentUser = true;
      let diff = 1;
      if (props.previousMessage) {
        let sameUserInPrevMessage = false;
        if (props.previousMessage?.user !== undefined && props.previousMessage?.user) {
          sameUserInPrevMessage = !!(props.previousMessage?.user?._id === props.currentMessage?.user?._id);
        }
        messCurrentUser = props.user?._id === props.currentMessage?.user?._id;
        const currentTime = props.currentMessage?.createdAt ? new Date(props.currentMessage?.createdAt) : new Date();
        const previousTime = props.previousMessage?.createdAt ? new Date(props.previousMessage?.createdAt) : new Date();
        diff = differenceInMinutes(previousTime, currentTime);
        renderTime = messCurrentUser && props.user?._id !== props.previousMessage?.user?._id;
      }

      const seenUserWithoutSender = (props.currentMessage?.seenUsers || []).filter(
        user => user.id !== props.currentMessage?.user?._id,
      );

      const isLike = !!props.currentMessage?.likedBy?.find(user => user.id === props.user?._id);

      return (
        <DoubleTap
          onDoubleTap={likeMsg(props.currentMessage?._id || 0)}
          onLongPress={onLongPress(props.currentMessage?._id || 0, isLike)}
          style={{
            flexDirection: 'column',
            alignItems: !messCurrentUser ? 'flex-start' : 'flex-end',
            width: '80%',
            marginBottom: props.currentMessage?.likedBy?.length ? scale(8) : 0,
            marginTop: scale(6),
          }}>
          {!props.previousMessage?.hasOwnProperty('_id') ||
          (diff !== 0 && props.previousMessage?.user._id === props.currentMessage?.user?._id) ||
          props.previousMessage?.user?._id !== props.currentMessage?.user?._id ? (
            <Time {...props} timeTextStyle={timeTextStyle} />
          ) : null}
          <View style={styles.rowFlexEnd}>
            {props.currentMessage?.text ? (
              <Bubble
                {...props}
                touchableProps={{
                  disabled: true,
                }}
                renderTicks={NoRender}
                textStyle={messageTextStyle}
                wrapperStyle={messageTextContainerStyle}
              />
            ) : null}
            {props.currentMessage?.image ? (
              <MessageMedia
                messageId={props.currentMessage._id}
                isLike={isLike}
                uri={props.currentMessage?.image}
                type={'image'}
                navigation={navigation}
                onLongPressMedia={onLongPress}
                onDoubleTap={likeMsg(props.currentMessage._id || 0)}
              />
            ) : null}
            {props.currentMessage?.video ? (
              <MessageMedia
                isLike={isLike}
                messageId={props.currentMessage._id}
                uri={props.currentMessage?.video}
                thumbnail={props.currentMessage?.thumbnail}
                type={'video'}
                navigation={navigation}
                onLongPressMedia={onLongPress}
                onDoubleTap={likeMsg(props.currentMessage._id || 0)}
              />
            ) : null}
            {props.currentMessage?.audio ? (
              <MessageAudio
                isLike={isLike}
                messageId={props.currentMessage._id}
                position={props.position}
                uri={props.currentMessage?.audio}
                onLongPressAudio={onLongPress}
                onDoubleTap={likeMsg(props.currentMessage._id || 0)}
              />
            ) : null}
            {messCurrentUser && props.currentMessage?.pending ? (
              <View style={styles.tickPending} />
            ) : (
              <View style={[styles.tickPending, styles.hiddenTick]} />
            )}
            <AmountLikeMsg
              position={props.position}
              likedBy={props.currentMessage?.likedBy || []}
              messageId={props.currentMessage?._id || 0}
            />
          </View>
          {props.position === 'right' && seenUserWithoutSender.length ? (
            <View style={{ ...styles.wrapperSeenUser, marginTop: props.currentMessage?.likedBy ? scale(8) : 0 }}>
              {seenUserWithoutSender?.map(user => (
                <SeenUser key={user.id} avatar={user?.avatar} />
              ))}
            </View>
          ) : null}
        </DoubleTap>
      );
    },
    [NoRender, navigation, onLongPress, likeMsg],
  );

  const renderInputToolbar = React.useMemo(
    () => (props: InputToolbarProps<any>) => {
      if (type === 'MESSAGE_REQUESTS') {
        return;
      }
      return (
        <View style={commonStyles.flex_1}>
          <RecordSpeech ref={recordSpeechRef as any} userGiftedChat={userGiftedChat} onChange={onSend} />

          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbarContainerStyle}
            primaryStyle={styles.inputToolbarPrimayStyle}
          />
        </View>
      );
    },
    [type, userGiftedChat, onSend],
  );

  const renderActions = React.useMemo(
    () => (props: ActionsProps) =>
      (
        <LaunchGallery
          onChange={onSend}
          userGiftedChat={userGiftedChat}
          containerStyle={styles.containerCameraAction}
          mode={'take'}
          iconName="camera"
          tintColorIcon={Colors.white}
        />
      ),
    [onSend, userGiftedChat],
  );

  const renderSend = React.useMemo(
    () => (props: SendProps<ITempMessage>) =>
      !props.text ? (
        <View style={styles.containerRenderSend}>
          <TouchableOpacity style={styles.sendContainerStyle} onPress={openRecord}>
            <Icon name="mic-outline" size={scale(22)} color={Colors.dark} />
          </TouchableOpacity>
          <LaunchGallery
            onChange={onSend}
            userGiftedChat={userGiftedChat}
            containerStyle={styles.sendContainerStyle}
            mode={'pick'}
          />
          <LaunchGif containerStyle={styles.sendContainerStyle} onChange={onSend} userGiftedChat={userGiftedChat} />
        </View>
      ) : (
        <SendText {...props} userGiftedChat={userGiftedChat} />
      ),
    [openRecord, onSend, userGiftedChat],
  );

  const renderComposer = React.useMemo(
    () => (props: ComposerProps) =>
      (
        <Composer
          {...props}
          placeholder="Messages..."
          onInputSizeChanged={onInputSizeChanged}
          composerHeight={inputHeightChange}
          textInputStyle={styles.composerTextInputStyle}
        />
      ),
    [inputHeightChange, onInputSizeChanged],
  );

  const renderLoadEarlier = React.useMemo(
    () => (props: LoadEarlierProps) =>
      (
        <LoadEarlier
          {...props}
          activityIndicatorColor={Colors.Light_Gray}
          textStyle={{ fontSize: scale(13), color: Colors.Light_Gray }}
          wrapperStyle={{
            backgroundColor: Colors.white,
          }}
        />
      ),
    [],
  );

  const onPressAvatar = React.useCallback(
    (user: any) => {
      try {
        if (!user._id) {
          return;
        }
        isBlockMe(user._id);
        navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: false,
          params: { userId: user._id, screen },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [isBlockMe, navigation, screen],
  );

  const isCloseToTop = React.useCallback(({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToTop = scale(50);
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }, []);

  const listViewProps = React.useMemo(
    () => ({
      scrollEventThrottle: 400,
      onScroll: ({ nativeEvent }: any) => {
        if (isCloseToTop(nativeEvent)) {
          loadMoreMessage();
        }
      },
    }),
    [isCloseToTop, loadMoreMessage],
  );

  const ViewAcceptRequest = React.useMemo(
    () =>
      type === 'MESSAGE_REQUESTS' && otherMembers[0] ? (
        <View style={styles.containerAcceptMessage}>
          <View style={styles.viewNoticeAccept}>
            <TextComponent style={styles.headerNotice}>
              Accept message request from{' '}
              <TextComponent style={{ fontFamily: 'Lexend-Bold' }}>{otherMembers[0]?.displayName}?</TextComponent>
            </TextComponent>
            <TextComponent numberOfLines={4} style={styles.msgNotice}>
              {`If you accept, members will also be able to message you and see info such as your Activity Status and when you've read messages.`}
            </TextComponent>
          </View>
          <View style={styles.wrapperBtnAccept}>
            <TouchableOpacity style={styles.viewBtn} onPress={blockUser}>
              <TextComponent style={styles.textRed}>Block</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewBtn} onPress={deleteMessage}>
              <TextComponent style={styles.textRed}>Delete</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewBtn} onPress={acceptMessage}>
              <TextComponent style={styles.textDark}>Accept</TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      ) : null,
    [acceptMessage, blockUser, deleteMessage, otherMembers, type],
  );

  const ViewBlock = React.useMemo(() => {
    const userBlockByMe = (userInfo?.blocks || []).map(user => user.id);
    const userBlockMe = (userInfo?.blockedBy || []).map(user => user.id);
    const isBlockByMe = userBlockByMe.includes(otherMembers[0]?.id) && type !== 'GROUP_CHAT';
    const isBlockMe1 = userBlockMe.includes(otherMembers[0]?.id) && type !== 'GROUP_CHAT';

    if (isBlockByMe) {
      return (
        <View style={{ ...styles.containerAcceptMessage, height: scale(80 + 60), zIndex: 2 }}>
          <View style={styles.viewNoticeAccept}>
            <TextComponent style={styles.headerNoticeBlock}>You block this account</TextComponent>
            <TextComponent numberOfLines={4} style={styles.msgNoticeBlock}>
              {`You can't message with ${otherMembers[0]?.firstName} ${otherMembers[0]?.lastName} (${otherMembers[0]?.displayName})`}
            </TextComponent>
          </View>
          <View style={styles.wrapperBtnAccept}>
            <TouchableOpacity style={styles.viewBtn} onPress={unblockUser}>
              <TextComponent style={styles.textRed}>Unblock</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewBtn} onPress={deleteMessage}>
              <TextComponent style={styles.textDark}>Delete</TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (isBlockMe1) {
      return (
        <View style={{ ...styles.containerViewBlockMe, height: scale(80 + 60), zIndex: 2 }}>
          <View style={styles.viewNoticeAccept}>
            <TextComponent style={styles.headerNoticeBlock}>You are blocked by this user</TextComponent>
            <TextComponent numberOfLines={4} style={styles.msgNotice}>
              {`You can't message with ${otherMembers[0]?.firstName} ${otherMembers[0]?.lastName} (${otherMembers[0]?.displayName})`}
            </TextComponent>
          </View>
        </View>
      );
    }
    return null;
  }, [userInfo, otherMembers, type, unblockUser, deleteMessage]);

  const minInputToolbarHeight = React.useMemo(
    () => (type === 'MESSAGE_REQUESTS' ? scale(60 + 60 + 18 * 4) : scale(80)),
    [type],
  );

  const finalContainer = React.useMemo(() => {
    const isBiggerInput = inputHeightChange > 1.5 * HEIGHT_INPUT;
    const marginBottom = isBiggerInput ? scale((inputHeightChange * 12) / HEIGHT_INPUT) : 0;
    return {
      ...styles.container,
      paddingBottom: keyboardStatus ? ifNotchIphone(scale(44), Platform.OS === 'ios' ? scale(44) : 0) : marginBottom,
      marginBottom: keyboardStatus ? marginBottom : 0,
    };
  }, [keyboardStatus, inputHeightChange]);

  const openEditName = React.useCallback(() => {
    editNamePopup?.current?.open();
  }, []);

  return (
    <View style={finalContainer as any}>
      <InRoomChatHeader
        members={otherMembers}
        navigation={navigation}
        isGroup={!!detailRoom?.conversationId}
        loading={!detailRoom}
        screen={screen}
        name={detailRoom?.name}
        openEditName={openEditName}
      />
      {detailRoom ? (
        <GiftedChat
          ref={giftedChatRef as any}
          listViewProps={listViewProps}
          messages={messages}
          onSend={onSend}
          scrollToBottom={true}
          scrollToBottomComponent={NoRender}
          alignTop={true}
          user={userGiftedChat}
          isLoadingEarlier={isLoadMore}
          loadEarlier={isLoadMore}
          renderLoadEarlier={renderLoadEarlier}
          alwaysShowSend={true}
          bottomOffset={Platform.OS === 'ios' ? scale(48) : undefined}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderActions={renderActions as any}
          renderTime={NoRender}
          messagesContainerStyle={styles.messagesContainerStyle}
          keyboardShouldPersistTaps="never"
          minInputToolbarHeight={minInputToolbarHeight}
          onPressAvatar={onPressAvatar}
        />
      ) : (
        <ActivityIndicator style={{ flex: 1, alignSelf: 'center' }} color={Colors.Dark_Gray1} size={scale(25)} />
      )}
      {ViewBlock || ViewAcceptRequest}
      {detailRoom && <EditNamePopup ref={editNamePopup as any} roomId={detailRoom.id} name={detailRoom.name || ''} />}
      <ButtonSheet ref={buttonSheetRef as any} />
    </View>
  );
});
InRoomChat.displayName = 'ChatScreen/InRoomChat';
