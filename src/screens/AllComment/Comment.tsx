import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RenderTextComment } from './RenderTextComment';
import { ReplyTreeView } from './ReplyTreeView';
import { useDispatch } from 'react-redux';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import { commonStyles, insets } from '@/styles/common';
import { commentController } from '@/controllers/comment.controller';
import { IComment, NavigationComment } from '@/stores/types/comment.type';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAVIGATION, COMMENT_NAVIGATION, PROFILE_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { commentSlice } from '@/stores/reducers';
import { DoubleTap } from '@/containers/components/DoubleTap';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { diffFormatDistanceMonthMinute } from '@/utils/date-fns.config';
import { TextComponent } from '@/containers/components/TextComponent';
import { IconHeart } from '@/assets/icons/Icon';

export const Comment = React.memo(({ comment, navigation }: { comment: IComment; navigation: NavigationComment }) => {
  const dispatch = useDispatch();
  const myInfo = useAuth();
  const { isBlockMe } = useUserBlockMe();
  const aniHighlight = React.useRef(new Animated.Value(0)).current;

  const gotoProfile = React.useCallback(() => {
    try {
      if (myInfo?.id !== comment?.user?.id) {
        isBlockMe(comment?.user?.id);

        navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: true,
          params: { userId: comment?.user?.id, screen: COMMENT_NAVIGATION.ALL_COMMENT, stumpId: true },
        });
      } else {
        navigation?.navigate(APP_NAVIGATION.PROFILE, { screen: PROFILE_NAVIGATION.DETAIL_PROFILE, initial: false });
      }
    } catch (error) {
      //
    }
  }, [myInfo?.id, comment?.user?.id, isBlockMe, navigation]);

  const RenderAvatar = React.useMemo(
    () => (
      <TouchableOpacity activeOpacity={0.5} onPress={gotoProfile}>
        <ImageComponent
          uri={comment?.user?.avatar || ''}
          width={scale(35)}
          height={scale(35)}
          borderRadius={scale(35)}
        />
      </TouchableOpacity>
    ),
    [comment?.user?.avatar, gotoProfile],
  );

  const reply = () => {
    dispatch(commentSlice.actions.setReplyComment(comment));
  };

  const like = async () => {
    if (comment._id) {
      return;
    }
    const res = await commentController.likeReply(comment.id);
    dispatch(commentSlice.actions.setLikeComment({ comment, totalReact: res.data, isReacted: !comment?.isReacted }));
  };

  const totalLike = React.useMemo(
    () => (comment?.totalReact ? `${comment.totalReact} ${comment?.totalReact > 1 ? 'likes' : 'like'}` : ''),
    [comment?.totalReact],
  );

  const timeComment = React.useMemo(() => {
    return comment?.createdAt ? diffFormatDistanceMonthMinute(comment.createdAt) : '';
  }, [comment?.createdAt]);

  const showAllUserLiked = () => {
    navigation.push(COMMENT_NAVIGATION.COMMENT_LIKES, {
      screen: COMMENT_NAVIGATION.ALL_COMMENT,
      commentId: comment?.id,
    });
  };

  React.useEffect(() => {
    if (comment?.isHighlight) {
      setTimeout(() => {
        Animated.timing(aniHighlight, {
          useNativeDriver: false,
          duration: 1000,
          toValue: 100,
        }).start();
      }, 100);
    }
  }, [aniHighlight, comment?.isHighlight]);

  const aniViewStyle: any = React.useMemo(
    () => ({
      position: 'absolute',
      zIndex: -1,
      height: '100%',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: aniHighlight.interpolate({
        inputRange: [0, 100],
        outputRange: [Colors.primaryColor05, Colors.white],
      }),
      opacity: aniHighlight.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
      }),
    }),
    [aniHighlight],
  );

  const memoContainerStyle = React.useMemo(
    () => ({ ...styles.container, paddingLeft: comment?.parentId ? '12.5%' : scale(8) }),
    [comment],
  );

  const isGif = React.useMemo(() => (comment?.content || '').indexOf('.gif') !== -1, [comment?.content]);
  const onPress = React.useCallback(() => {
    if (isGif) {
      return;
    }
    navigation.push(ROOT_ROUTES.MEDIA, { uri: comment?.content, mimeType: 'image' });
  }, [isGif, navigation, comment?.content]);

  return (
    <TouchableOpacity activeOpacity={1}>
      <Animated.View style={aniViewStyle} />
      <View style={memoContainerStyle}>
        <View style={commonStyles.flex_1}>{RenderAvatar}</View>
        <View style={styles.viewContent}>
          <View style={styles.viewTextComment}>
            {comment?.type === 'MEDIA' ? (
              <DoubleTap onPress={onPress} onLongPress={like} onDoubleTap={like}>
                <ImageComponent
                  uri={comment?.content || ''}
                  width={scale(120)}
                  height={scale(160)}
                  borderRadius={scale(6)}
                />
              </DoubleTap>
            ) : (
              <RenderTextComment commentator={comment?.user} comment={comment?.content || ''} navigation={navigation} />
            )}
          </View>
          {!comment._id && (
            <View style={styles.otherContent}>
              <TextComponent style={styles.colorTextOtherContent}>{timeComment}</TextComponent>
              <TouchableOpacity activeOpacity={0.8} onPress={showAllUserLiked} hitSlop={insets}>
                <Text style={[commonStyles.m_l_10, styles.colorTextOtherContent]}>{totalLike}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={reply} hitSlop={insets}>
                <Text style={[commonStyles.m_l_10, styles.colorTextOtherContent]}>Reply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!comment._id && (
          <View style={styles.viewBtnLike}>
            <TouchableOpacity activeOpacity={0.8} onPress={like} hitSlop={insets}>
              <IconHeart
                width={scale(16)}
                height={scale(16)}
                fill={comment?.isReacted ? Colors.Vivid_red : Colors.White}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {comment?.childs && comment?.childs.length ? (
        <View style={styles.containerReplyTree}>
          <View style={styles.flexReplyTree}>
            <ReplyTreeView reply={comment?.childs || []} navigation={navigation} expand={!!comment?.expand} />
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
});
Comment.displayName = 'Comment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: scale(8),
    paddingHorizontal: scale(8),
  },
  viewContent: {
    flex: 6,
  },
  viewTextComment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  otherContent: {
    flexDirection: 'row',
    marginTop: scale(6),
  },
  colorTextOtherContent: {
    color: Colors.Dark_Gray2,
  },
  avt: {
    width: scale(35),
    height: scale(35),
    borderRadius: 100,
  },
  textMention: {
    color: Colors.Strong_Blue,
  },
  textNonMention: {
    color: Colors.dark,
  },
  viewBtnLike: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: scale(8),
    marginRight: scale(12),
  },
  containerReplyTree: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  flexReplyTree: { flex: 7, paddingTop: scale(8) },
});
