import { APP_NAVIGATION, COMMENT_NAVIGATION, PROFILE_NAVIGATION } from '@/constants';
import { TextComponent } from '@/containers/components/TextComponent';
import { userController } from '@/controllers';
import { useAuth } from '@/hooks/useAuth';
import { IRenderTextCommentProps } from '@/stores/types/comment.type';
import { Colors } from '@/theme/colors';
import { combineInterleaveArray } from '@/utils/helper';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const RenderTextComment = React.memo(({ comment, commentator, navigation }: IRenderTextCommentProps) => {
  const userInfo = useAuth();
  const regexMention = /\B@\w+/g;
  const arrMatch = comment.match(regexMention)?.map(e => ({ text: e, isMention: true })) || [];
  const splitOriginal = comment.split(regexMention).map(e => ({ text: e, isMention: false }));

  const chunkCombineText = (
    combineInterleaveArray(splitOriginal, arrMatch) as {
      text: string;
      isMention: boolean;
    }[]
  ).reduce((prev, curr) => {
    if (curr.isMention) {
      return [...prev, curr];
    } else {
      return [...prev, ...(curr.text.split(' ')?.map(e => ({ text: e, isMention: curr.isMention })) || [])];
    }
  }, [] as { text: string; isMention: boolean }[]);

  const goProfile = () => {
    if (!commentator.id) {
      return;
    }
    if (userInfo.id !== commentator.id) {
      navigation.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.VIEW_PROFILE,
        initial: false,
        params: { userId: commentator.id, screen: COMMENT_NAVIGATION.ALL_COMMENT, stumpId: true },
      });
    } else {
      navigation.navigate(APP_NAVIGATION.PROFILE, { screen: PROFILE_NAVIGATION.DETAIL_PROFILE, initial: false });
    }
  };

  const goProfileFromMention = (displayName: string) => async () => {
    try {
      const res = await userController.findByDisplayName(displayName.replace('@', ''));
      if (res.data && res.data.id) {
        if (userInfo.id !== res.data.id) {
          navigation.navigate(APP_NAVIGATION.PROFILE, {
            screen: PROFILE_NAVIGATION.VIEW_PROFILE,
            initial: true,
            params: { userId: res.data.id, screen: COMMENT_NAVIGATION.ALL_COMMENT, stumpId: true },
          });
        } else {
          navigation.navigate(APP_NAVIGATION.PROFILE, { screen: PROFILE_NAVIGATION.DETAIL_PROFILE, initial: false });
        }
      } else {
        Alert.alert('', 'User not found.');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TouchableOpacity onPress={goProfile}>
        <TextComponent style={styles.textCommentator}>{commentator?.displayName}</TextComponent>
      </TouchableOpacity>
      {chunkCombineText.map((element, i: number) => {
        return (
          <TextComponent style={styles.textNonMention} key={i}>
            {element.isMention ? (
              <TextComponent style={styles.textMention} onPress={goProfileFromMention(element.text)}>
                {element.text}
              </TextComponent>
            ) : (
              ' ' + element.text
            )}
          </TextComponent>
        );
      })}
    </>
  );
});

RenderTextComment.displayName = 'RenderTextComment';

const styles = StyleSheet.create({
  textCommentator: {
    fontFamily: 'Lexend-Bold',
    color: Colors.dark,
    fontSize: scale(13),
    lineHeight: scale(22),
  },
  textMention: {
    color: Colors.Strong_Blue,
    fontSize: scale(13),
    flexDirection: 'row',
    lineHeight: scale(22),
    textAlignVertical: 'bottom',
  },
  textNonMention: {
    color: Colors.dark,
    fontSize: scale(13),
    flexDirection: 'row',
    flexWrap: 'wrap',
    lineHeight: scale(22),
  },
});
