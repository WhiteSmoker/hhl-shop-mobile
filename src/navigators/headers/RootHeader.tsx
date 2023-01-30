import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGetMyId } from '@/hooks/useGetMyId';
import { APP_NAVIGATION, CHAT_NAVIGATION, HOME_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { useAppSelector } from '@/stores';
import { commonStyles, insets } from '@/styles/common';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { IconChat, IconDraft, IconLogo1, IconLogo2, IconSchedule } from '@/assets/icons/Icon';
import { HeaderTitleStyled } from './styles';
import { TextComponent } from '@/containers/components/TextComponent';

type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation?: any;
  route?: any;
  screen?: string;
};

const RootHeader = (props: IProps) => {
  const myId = useGetMyId();
  const { count: countScheduled, countDraft, countAccepted } = useAppSelector(rootState => rootState.counterState);
  const rooms = useAppSelector(rootState => rootState.chatState.rooms);
  const msgUnreadLength = React.useMemo(() => {
    const roomUnread = rooms?.filter(room => {
      const memberIsMe = room.members.find(mem => mem.id === myId);
      const lastMsg = room.messages[0];
      return lastMsg.id > (memberIsMe?.lastMsgId || 0);
    });
    return roomUnread.length;
  }, [myId, rooms]);

  const navigate = React.useCallback(() => {
    props.navigation?.navigate(APP_NAVIGATION.HOME, {
      screen: HOME_NAVIGATION.SCHEDULEDHOME,
      initial: false,
      params: { tab: '' },
    });
  }, [props.navigation]);

  const goToDraft = React.useCallback(() => {
    props.navigation?.navigate(APP_NAVIGATION.HOME, {
      screen: HOME_NAVIGATION.DRAFTHOME,
      initial: false,
      params: { screen: `string` },
    });
  }, [props.navigation]);

  const gotoChat = React.useCallback(() => {
    props.navigation?.navigate(ROOT_ROUTES.CHAT, {
      screen: CHAT_NAVIGATION.ALL_CONVERSATION,
      initial: false,
      params: { type: 'CHAT', title: 'Messages', screen: props.screen },
    });
  }, [props.navigation, props.screen]);

  const DraftView = React.useMemo(
    () => (
      <View style={styles.itemHeader2}>
        {props.showArrow ? (
          <TouchableOpacity
            onPress={goToDraft}
            activeOpacity={0.8}
            hitSlop={insets}
            style={[commonStyles.mg_horizontal_12, { width: scale(24) }]}>
            <IconDraft width={scale(22)} height={scale(24)} />
            {countDraft ? (
              <View style={styles.absCount}>
                <TextComponent style={styles.textSmall}>{countDraft}</TextComponent>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    ),
    [goToDraft, countDraft, props.showArrow],
  );

  const TitleView = React.useMemo(
    () => (
      <View style={styles.itemHeader}>
        {props.title ? (
          <HeaderTitleStyled>{props.title}</HeaderTitleStyled>
        ) : (
          <View style={{ ...commonStyles.flexRow, ...commonStyles.containerView }}>
            <IconLogo1 width={scale(26)} height={scale(26)} />
            <HorizontalRuleComponent width={scale(4)} height={scale(0)} color="transparent" />
            <IconLogo2 width={scale(153)} height={scale(20)} />
          </View>
        )}
      </View>
    ),
    [props.title],
  );

  const RightView = React.useMemo(
    () => (
      <View
        style={[styles.itemHeader1, (props.showArrow || (!props.showArrow && props.hideRight)) && commonStyles.flex_1]}>
        {!props.hideRight ? (
          <TouchableOpacity onPress={navigate} activeOpacity={0.8} hitSlop={insets}>
            <IconSchedule width={scale(24)} height={scale(24)} />
            {countScheduled || countAccepted ? (
              <View style={styles.absCount}>
                <TextComponent style={styles.textSmall}>{countScheduled + countAccepted}</TextComponent>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={insets}
          style={[commonStyles.mg_horizontal_12, { width: scale(24) }]}
          onPress={gotoChat}>
          <IconChat width={scale(24)} height={scale(24)} />
          {msgUnreadLength ? (
            <View style={styles.absCount}>
              <TextComponent style={styles.textSmall}>{msgUnreadLength}</TextComponent>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    ),
    [props.showArrow, props.hideRight, navigate, countScheduled, countAccepted, gotoChat, msgUnreadLength],
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        {DraftView}
        {TitleView}
        {RightView}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(90),
    backgroundColor: Colors.Background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
  itemHeader: {
    flex: 1,
    height: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeader2: {
    flex: 1,
    height: scale(90),
    justifyContent: 'center',
  },
  itemHeader1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  textSmall: {
    color: Colors.white,
    fontSize: scale(8),
    lineHeight: scale(8),
    paddingHorizontal: scale(3),
  },
  absCount: {
    position: 'absolute',
    backgroundColor: Colors.Pure_Orange,
    zIndex: 1,
    minWidth: scale(12),
    height: scale(12),
    right: 0,
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(RootHeader);
