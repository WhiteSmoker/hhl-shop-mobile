import React from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Comment } from './Comment';
import { MentionInput } from './MentionInput';
import { SearchUserMention } from './SearchUserMention';
import { useDispatch } from 'react-redux';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { IUserInfo } from '@/stores/types';
import { commonStyles } from '@/styles/common';
import { validFindIndex } from '@/utils/helper';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { setAllComment, setReplyComment } from '@/stores/reducers/comment.reducer';
import { IAllCommentProps, IComment, IMentionInputRef } from '@/stores/types/comment.type';
import { IRenderItem } from '@/stores/types/common.type';
import { useMentionComment } from '@/hooks/useMentionComment';
import TitleHeader from '@/navigators/headers/TitleHeader';
import { TextComponent } from '@/containers/components/TextComponent';

export const AllComment = ({ navigation, route }: IAllCommentProps) => {
  const dispatch = useDispatch();
  const aniAppearView = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef<FlatList>();
  const mentionInputRef = React.useRef<IMentionInputRef>();
  const stumpId = React.useMemo(() => route.params?.stumpId, [route.params?.stumpId]);
  const screen = React.useMemo(() => route.params?.screen, [route.params?.screen]);
  const commentId = React.useMemo(() => route.params?.commentId, [route.params?.commentId]);
  const mentionedComment = React.useMemo(() => route.params?.mentionedComment, [route.params?.mentionedComment]);

  const {
    loadingMore,
    fetching,
    searching,
    mentionUsers,
    comments,
    canViewAll,
    onSearch,
    onRefresh,
    sendReply,
    loadMoreComment,
    viewAllFromMention,
    unmount,
  } = useMentionComment(stumpId, commentId, mentionedComment, navigation);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => backHandler.remove();
  }, []);

  const renderItem = React.useMemo(
    () =>
      ({ item }: IRenderItem<IComment>) =>
        <Comment comment={item} navigation={navigation} />,
    [navigation],
  );
  const keyExtractor = React.useMemo(() => (item: IComment) => item.id.toString(), []);
  const memoizedData = React.useMemo(() => comments, [comments]);
  const refreshControl = React.useMemo(() => <RefreshControl refreshing={false} onRefresh={onRefresh} />, [onRefresh]);
  const ListFooterComponent = React.useMemo(() => <FooterLoadMore loadingMore={loadingMore} />, [loadingMore]);

  const appearView = React.useCallback((): Promise<void> => {
    return new Promise(resolve => {
      Animated.timing(aniAppearView, {
        useNativeDriver: true,
        toValue: 10,
        duration: 500,
      }).start(cb => {
        if (cb.finished) {
          resolve();
        }
      });
    });
  }, [aniAppearView]);

  const disappearView = React.useCallback((): Promise<void> => {
    return new Promise(resolve => {
      Animated.timing(aniAppearView, {
        useNativeDriver: true,
        toValue: 0,
        duration: 500,
      }).start(cb => {
        if (cb.finished) {
          resolve();
        }
      });
    });
  }, [aniAppearView]);

  const onSelectUser = React.useCallback(
    async (user: IUserInfo) => {
      mentionInputRef.current?.mention(user);
      Keyboard.dismiss();
      await disappearView();
    },
    [disappearView],
  );

  const clearParams = React.useCallback(() => {
    navigation.setParams({ stumpId: undefined, screen: undefined, commentId: undefined, mentionedComment: undefined });
    dispatch(setReplyComment(undefined));
    dispatch(setAllComment([]));
    unmount();
  }, [dispatch, navigation, unmount]);

  const viewAll = async () => {
    await viewAllFromMention();
  };

  const scrollToEnd = React.useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const scrollToIdx = React.useCallback(
    (parentId: number) => {
      const idx = memoizedData.findIndex((e: any) => e.id === parentId);
      if (validFindIndex(idx)) {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      }
    },
    [memoizedData],
  );

  const ListEmptyComponent = React.useMemo(
    () => <TextComponent style={styles.textEmptyList}>No comments</TextComponent>,
    [],
  );
  const memoizedContentContainerStyle = usePaddingBottomFlatlist();

  return stumpId ? (
    <DismissKeyboard>
      <View style={styles.container}>
        <TitleHeader title={'Comments'} clearParams={clearParams} screen={screen} navigation={navigation} />
        {commentId && canViewAll && (
          <TouchableOpacity onPress={viewAll}>
            <TextComponent style={styles.textViewAll}>View all comments</TextComponent>
          </TouchableOpacity>
        )}
        {!fetching ? (
          <FlatList
            ref={flatListRef as any}
            data={memoizedData}
            extraData={memoizedData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.styleFlatlist}
            keyboardShouldPersistTaps="always"
            refreshControl={refreshControl}
            onEndReached={loadMoreComment}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={ListEmptyComponent}
            onEndReachedThreshold={0.1}
            contentContainerStyle={memoizedContentContainerStyle}
          />
        ) : (
          <ActivityIndicator style={commonStyles.flex_1} size={scale(16)} color={Colors.Gray} />
        )}
        <MentionInput
          ref={mentionInputRef}
          onSearch={onSearch}
          sendReply={sendReply}
          appearView={appearView}
          disappearView={disappearView}
          scrollToEnd={scrollToEnd}
          scrollToIdx={scrollToIdx}
          containerInputStyle={styles.containerInputStyle}
          style={styles.mentionInputStyle}
          buttonSendStyle={styles.buttonSendStyle}
          placeholder="Add a comment..."
        />
        <SearchUserMention
          data={mentionUsers}
          onSelectUser={onSelectUser}
          aniAppearView={aniAppearView}
          searching={searching}
        />
      </View>
    </DismissKeyboard>
  ) : null;
};
AllComment.displayName = 'AllComment';

const styles = StyleSheet.create({
  styleFlatlist: { paddingHorizontal: scale(0), position: 'relative' },
  container: { position: 'relative', width: '100%', height: '100%', flex: 1, backgroundColor: '#fff' },
  containerInputStyle: {
    borderColor: Colors.Dark_Gray1,
    borderWidth: scale(1),
    borderRadius: scale(199),
    paddingHorizontal: scale(10),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
  },
  mentionInputStyle: {
    paddingVertical: Platform.OS === 'android' ? scale(10) : scale(15),
    fontSize: scale(13),
    flex: 1,
  },
  buttonSendStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: scale(3),
  },
  textViewAll: { color: Colors.Soft_Blue, marginHorizontal: scale(8), fontSize: scale(13), lineHeight: scale(30) },
  textEmptyList: {
    color: Colors.DarkGray,
    fontSize: scale(13),
    lineHeight: scale(50),
    alignSelf: 'center',
  },
});
