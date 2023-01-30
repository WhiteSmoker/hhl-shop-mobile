import React, { useEffect, useImperativeHandle } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommentPickPhoto } from './CommentPickPhoto';
import { FCWithRefFromComponent } from '@/stores/types/common.type';
import { IMentionInputProps, IMentionInputRef } from '@/stores/types/comment.type';
import { useAuth } from '@/hooks/useAuth';
import { IUserInfo, useAppSelector } from '@/stores';
import { commentSlice } from '@/stores/reducers';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { ifIphoneX, insets } from '@/styles/common';
import { getElementDiffArr, replaceRangeHelper } from '@/utils/helper';
import { debouncePress } from '@/utils/debounce';
import { TextComponent } from '@/containers/components/TextComponent';

export const MentionInput: FCWithRefFromComponent<IMentionInputProps, IMentionInputRef> = React.memo(
  React.forwardRef(
    (
      {
        onSearch,
        sendReply,
        appearView,
        disappearView,
        scrollToEnd,
        scrollToIdx,
        containerInputStyle,
        buttonSendStyle,
        ...rest
      },
      ref,
    ) => {
      const userInfo = useAuth();
      const dispatch = useDispatch();
      const [disabled, setDisabled] = React.useState(true);
      const replyComment = useAppSelector(rootState => rootState.commentState.replyComment);
      const regexMention = /\B@\w+/g;
      const textInputRef = React.useRef<TextInput>();
      const preTextMentionMatchRef = React.useRef<string[]>([]);
      const idxStartDiff = React.useRef(0);
      const keywordRef = React.useRef('');
      const selectionRef = React.useRef({ start: 0, end: 0 });
      const isAppear = React.useRef(false);
      const aniViewReplying = React.useRef(new Animated.Value(0)).current;
      const [value, setValue] = React.useState('');

      useEffect(() => {
        if (replyComment) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          Animated.timing(aniViewReplying, {
            useNativeDriver: true,
            duration: 150,
            toValue: 100,
          }).start();
          textInputRef.current?.focus();
          if (!value) {
            preTextMentionMatchRef.current = [`@${replyComment.user.displayName}`];
            setValue(`@${replyComment.user.displayName} `);
            setDisabled(false);
          }
        } else {
          Animated.timing(aniViewReplying, {
            useNativeDriver: true,
            duration: 150,
            toValue: 0,
          }).start();
        }
      }, [aniViewReplying, replyComment]);

      useImperativeHandle(ref, () => ({
        mention: (user: IUserInfo) => {
          const text = replaceRangeHelper(
            value,
            idxStartDiff.current,
            idxStartDiff.current + keywordRef.current.length + 1,
            `@${user.displayName} `,
          );
          preTextMentionMatchRef.current = text.match(regexMention) || [];
          isAppear.current = false;
          setValue(text);
        },
        getValue: () => value,
        getKeyword: () => keywordRef.current,
      }));

      const opacity = aniViewReplying.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
      });

      const onChangeText = React.useCallback(
        async (str: string) => {
          const text = str.replace('  ', ' ');
          if (!text) {
            setDisabled(true);
          }
          if (text.length > 0 && text.length < 5) {
            setDisabled(false);
          }
          const arrMatch = text.match(regexMention) || [];

          const arrPreTextMentionMatch = JSON.parse(JSON.stringify(preTextMentionMatchRef));
          const elementDiff = getElementDiffArr(arrMatch, arrPreTextMentionMatch.current);
          const isDiff =
            arrMatch.length >= arrPreTextMentionMatch.current.length
              ? arrMatch.toString() !== arrPreTextMentionMatch.current.toString()
              : false;

          if (isDiff) {
            let arrIndexStart: number[] = [];
            for (let i = 0; i <= arrMatch.length; i++) {
              const match = regexMention.exec(text);
              if (match) {
                arrIndexStart = [...arrIndexStart, match.index || 0];
              }
            }
            const indexCursor = selectionRef.current.start;
            const startDiff = Math.max(...arrIndexStart.filter(e => e < indexCursor));
            idxStartDiff.current = startDiff;
            keywordRef.current = elementDiff.replace('@', '');
            if (!isAppear.current) {
              appearView();
            }
            isAppear.current = true;
            onSearch(keywordRef.current, startDiff);
          } else {
            if (isAppear.current) {
              disappearView();
            }
            isAppear.current = false;
          }
          preTextMentionMatchRef.current = arrMatch;
          setValue(text);
        },
        [appearView, disappearView, onSearch],
      );

      const onSelectionChange = React.useCallback((event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        const { start, end } = event.nativeEvent.selection;
        if (start === end) {
          selectionRef.current = { start, end };
        }
      }, []);

      const closeReply = React.useCallback(async () => {
        setValue('');
        setDisabled(true);
        aniViewReplying.setValue(0);
        dispatch(commentSlice.actions.setReplyComment(undefined));
        await disappearView();
        Keyboard.dismiss();
      }, [aniViewReplying, dispatch, disappearView]);

      const post = (type: 'TEXT' | 'MEDIA') => () => {
        let parentId = 0;
        if (replyComment) {
          parentId = replyComment.parentId || replyComment.id;
        }
        if (!value) {
          return;
        }
        sendReply(value, parentId, type, 0, async () => {
          await closeReply();
          if (!parentId) {
            scrollToEnd();
          } else {
            scrollToIdx(parentId);
          }
        });
      };

      const sendMedia = (content: string, _id: number) => {
        let parentId = 0;
        if (replyComment) {
          parentId = replyComment.parentId || replyComment.id;
        }
        if (!content) {
          return;
        }
        sendReply(content, parentId, 'MEDIA', _id, async () => {
          await closeReply();
          if (!parentId) {
            scrollToEnd();
          } else {
            scrollToIdx(parentId);
          }
        });
      };

      const MemoViewReplying = React.useMemo(
        () =>
          replyComment ? (
            <Animated.View style={[styles.viewReplying, { opacity }]}>
              <TextComponent
                style={styles.textReplying}>{`Replying to ${replyComment?.user.displayName}`}</TextComponent>
              <TouchableOpacity onPress={closeReply}>
                <Icon name="close-outline" size={scale(18)} color={Colors.Gray} />
              </TouchableOpacity>
            </Animated.View>
          ) : null,
        [replyComment, opacity, closeReply],
      );

      const memoContainerInputStyle = React.useMemo(() => containerInputStyle || {}, [containerInputStyle]);

      return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {MemoViewReplying}
          <View style={styles.container}>
            <ImageComponent
              uri={userInfo?.avatar || ''}
              width={scale(35)}
              height={scale(35)}
              borderRadius={scale(35)}
            />
            <View style={memoContainerInputStyle}>
              <CommentPickPhoto
                onChange={sendMedia}
                containerStyle={styles.sendContainerStyle}
                iconName="camera"
                mode={'take'}
                tintColorIcon={Colors.Light_Blue}
                parentId={replyComment?.parentId || replyComment?.id || 0}
              />
              <TextInput
                ref={textInputRef as any}
                {...rest}
                value={value}
                onChangeText={onChangeText}
                onSelectionChange={onSelectionChange}
              />

              <CommentPickPhoto
                onChange={sendMedia}
                containerStyle={styles.sendContainerStyle}
                mode={'pick'}
                tintColorIcon={Colors.Light_Blue}
                size={scale(18)}
                parentId={replyComment?.parentId || replyComment?.id || 0}
              />

              <TouchableOpacity
                style={buttonSendStyle}
                hitSlop={insets}
                onPress={() => {
                  debouncePress('onPress', post('TEXT'), 350);
                }}
                disabled={disabled}>
                <TextComponent style={{ ...styles.textSendBtn, opacity: disabled ? 0.5 : 1 }}>Post</TextComponent>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    },
  ),
);
MentionInput.displayName = 'MentionInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: scale(10),
    paddingHorizontal: scale(14),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ifIphoneX(scale(12), 0),
  },
  viewReplying: {
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    padding: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textReplying: { color: '#cfcfcf', fontSize: scale(13) },
  avt: { width: scale(35), height: scale(35), borderRadius: 100 },
  textSendBtn: { color: Colors.Light_Blue, fontSize: scale(13), alignSelf: 'center' },
  sendContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingRight: scale(10),
    paddingLeft: scale(6),
  },
});
