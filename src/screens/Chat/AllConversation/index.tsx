import React from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardConversation } from './CardConversation';
import { SearchRoom } from './SearchRoom';
import { useSearchChat } from './useSearchChat';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { useIsFocused } from '@react-navigation/native';
import { IAllConversationProps, IRoomChat } from '@/stores/types/chat.type';
import { commonSlice } from '@/stores/reducers';
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchListRoom } from '@/stores/thunks/chat.thunk';
import { CHAT_NAVIGATION } from '@/constants';
import { commonStyles } from '@/styles/common';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { IRenderItem } from '@/stores/types/common.type';
import ChatHeader from '@/navigators/headers/ChatHeader';
import { IconMessage } from '@/assets/icons/Icon';
import { TextComponent } from '@/containers/components/TextComponent';

export const AllConversation = React.memo(({ navigation, route }: IAllConversationProps) => {
  const dispatch = useAppDispatch();
  const memoizedContentContainerStyle = usePaddingBottomFlatlist();

  const rooms = useAppSelector(rootState => rootState.chatState.rooms);
  const textInputRef = React.useRef<TextInput>();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const { searchData, onChangeText, clear } = useSearchChat();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      dispatch(commonSlice.actions.setPlayStump());
    }
  }, [isFocused]);

  const memoizedRooms = React.useMemo(
    () =>
      route.params?.type !== 'MESSAGE_REQUESTS'
        ? rooms.filter(room => room.type !== 'MESSAGE_REQUESTS')
        : rooms.filter(room => room.type === 'MESSAGE_REQUESTS'),
    [rooms, route.params?.type],
  );

  const onRefresh = React.useCallback(() => {
    dispatch(fetchListRoom({}));
  }, [dispatch]);

  const navigateMsgRequest = React.useCallback(() => {
    navigation.push(CHAT_NAVIGATION.ALL_CONVERSATION, {
      type: 'MESSAGE_REQUESTS',
      title: 'Message requests',
      screen: CHAT_NAVIGATION.ALL_CONVERSATION,
    });
  }, [navigation]);

  const onFocus = React.useCallback(() => {
    Animated.spring(focusAnim, { toValue: 1, useNativeDriver: true, bounciness: 1 }).start(cb => {
      setScrollEnabled(false);
    });
  }, [focusAnim]);

  const onBlur = React.useCallback(() => {
    Keyboard.dismiss();
    clear();
    textInputRef.current?.clear();
    Animated.spring(focusAnim, { toValue: 0, useNativeDriver: true, bounciness: 1 }).start(cb => {
      setScrollEnabled(true);
    });
  }, [clear, focusAnim]);

  const ListHeaderComponent = React.useMemo(() => {
    const lengthMsgRequests = rooms.filter(room => room.type === 'MESSAGE_REQUESTS').length || 0;
    return route.params?.type !== 'MESSAGE_REQUESTS' ? (
      <Animated.View
        style={[
          commonStyles.flex_1,
          {
            marginTop: scale(90),
            zIndex: 2,
            transform: [
              {
                translateY: focusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, scale(-50)],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.viewSearch}>
          <Icon name="search-outline" size={scale(22)} color={Colors.Gray} />
          <TextInput
            ref={textInputRef as any}
            style={styles.viewInputSearch}
            placeholder="Search"
            onFocus={onFocus}
            onChangeText={onChangeText}
          />
          <Animated.View
            style={{
              transform: [
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [scale(150), 0],
                  }),
                },
              ],
              opacity: focusAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            }}>
            <Icon name="close-outline" size={scale(22)} color={Colors.Gray} onPress={onBlur} />
          </Animated.View>
        </View>
        <View style={styles.viewSectionMessage}>
          <TextComponent style={styles.textSection}>Messages</TextComponent>
          <TouchableOpacity onPress={navigateMsgRequest}>
            <TextComponent style={styles.textRequest}>
              {lengthMsgRequests} request{lengthMsgRequests > 1 ? 's' : ''}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </Animated.View>
    ) : lengthMsgRequests ? (
      <View style={styles.notice}>
        <TextComponent numberOfLines={2} style={styles.textNotice}>
          {`Requests aren't marked as seen until you've accepted them.`}
        </TextComponent>
      </View>
    ) : null;
  }, [rooms, route.params?.type, focusAnim, onFocus, onChangeText, onBlur, navigateMsgRequest]);

  const ListEmptyComponent = React.useMemo(
    () => (
      <View style={styles.emptyView}>
        <View style={styles.viewIcon}>
          <IconMessage width={scale(52)} height={scale(52)} fill={Colors.dark} />
        </View>
        <TextComponent style={styles.textEmptyBold}>
          {route.params?.type !== 'MESSAGE_REQUESTS' ? 'No message' : 'No message requests'}
        </TextComponent>
        <TextComponent style={styles.textEmpty}>
          {route.params?.type !== 'MESSAGE_REQUESTS'
            ? `You don't have any message`
            : `You don't have any message requests`}
        </TextComponent>
      </View>
    ),
    [route.params?.type],
  );

  const renderItem = React.useMemo(
    () =>
      ({ item }: IRenderItem<IRoomChat>) =>
        <CardConversation item={item} navigation={navigation} />,
    [navigation],
  );

  const keyExtractor = React.useMemo(() => (item: any) => item.id.toString(), []);

  const refreshControl = React.useMemo(() => <RefreshControl refreshing={false} onRefresh={onRefresh} />, [onRefresh]);

  React.useEffect(() => {
    dispatch(
      fetchListRoom({
        onSuccess: () => {
          Animated.timing(opacity, {
            useNativeDriver: true,
            toValue: 1,
            duration: 200,
          }).start();
        },
      }),
    );
  }, [opacity, dispatch]);

  return (
    <View style={styles.container}>
      <ChatHeader navigation={navigation} route={route} focusAnim={focusAnim} screen={route.params?.screen} />
      <Animated.View style={[styles.container, { opacity: 1 }]}>
        <FlatList
          data={memoizedRooms}
          extraData={memoizedRooms}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshControl={refreshControl}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          keyboardShouldPersistTaps="always"
          scrollEnabled={scrollEnabled}
          contentContainerStyle={memoizedContentContainerStyle}
        />
        <SearchRoom focusAnim={focusAnim} searchData={searchData} navigation={navigation} />
      </Animated.View>
    </View>
  );
});
AllConversation.displayName = 'ChatScreen/AllConversation';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  viewSearch: {
    marginTop: scale(8),
    backgroundColor: Colors.Light_Gray,
    opacity: 0.7,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(8),
    borderRadius: scale(8),
    flexDirection: 'row',
  },
  viewInputSearch: { padding: 0, marginLeft: scale(0), width: '80%', fontSize: scale(16) },
  viewSectionMessage: {
    marginTop: scale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  textSection: { color: Colors.dark, fontSize: scale(16), fontFamily: 'Lexend-Bold' },
  textRequest: { color: Colors.Dark_Gray2, fontSize: scale(14), fontFamily: 'Lexend-Bold' },
  emptyView: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewIcon: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(90),
    borderColor: Colors.dark,
    borderWidth: scale(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmptyBold: { color: Colors.dark, fontSize: scale(24), fontFamily: 'Lexend-Bold', lineHeight: scale(56) },
  textEmpty: { color: Colors.Dark_Gray1, fontSize: scale(15) },
  notice: {
    backgroundColor: '#fbfbfb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    paddingVertical: scale(12),
    marginTop: scale(90),
  },
  textNotice: { color: '#8b8a8a', fontSize: scale(11), textAlign: 'center' },
});
