import React from 'react';
import { FlatList, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Comment } from './Comment';
import unionBy from 'lodash/unionBy';
import { validFindIndex } from '@/utils/helper';
import { IComment } from '@/stores/types/comment.type';
import { useAppSelector } from '@/stores';
import { IRenderItem } from '@/stores/types/common.type';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { TextComponent } from '@/containers/components/TextComponent';
interface IState {
  renderData: IComment[];
  expand: boolean;
}
const NUMBER_COMMENT_PER_RENDER = 3;
export const ReplyTreeView = React.memo(
  ({ reply, navigation, expand }: { reply: IComment[]; navigation: any; expand: boolean }) => {
    const indexRef = React.useRef({
      minLength: 0,
      maxLength: reply.length,
      startIndex: reply.length - NUMBER_COMMENT_PER_RENDER > 0 ? reply.length - NUMBER_COMMENT_PER_RENDER : 0,
      endIndex: reply.length,
    });

    const commentLikeReply = useAppSelector(rootState => rootState.commentState.commentLikeReply);

    const [state, setState] = React.useState<IState>({
      renderData: [],
      expand,
    });

    React.useEffect(() => {
      if (commentLikeReply) {
        const cloneRenderData = [...state.renderData];
        const idx = cloneRenderData.findIndex(data => data.id === commentLikeReply.comment.id);
        if (validFindIndex(idx)) {
          cloneRenderData[idx] = {
            ...cloneRenderData[idx],
            totalReact: commentLikeReply.totalReact,
            isReacted: commentLikeReply.isReacted,
          };
          setState(prevState => ({
            ...prevState,
            renderData: cloneRenderData,
          }));
        }
      }
    }, [commentLikeReply]);

    React.useEffect(() => {
      if (reply.length) {
        const indexRefCurrent = { ...indexRef.current };
        if (reply.length - indexRefCurrent.endIndex) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          indexRef.current = {
            ...indexRef.current,
            endIndex: reply.length,
          };
          setState(prevState => ({
            ...prevState,
            renderData: [...prevState.renderData, ...reply.slice(indexRefCurrent.endIndex, reply.length)],
            expand: true,
          }));
        }
        indexRef.current = {
          ...indexRef.current,
          maxLength: reply.length,
          // endIndex: reply.length,
        };
      }
    }, [reply]);

    const indexHightlight = React.useMemo(() => reply.findIndex(data => data.isHighlight), [reply]);

    React.useEffect(() => {
      if (indexHightlight !== -1) {
        const startIndex =
          indexHightlight - NUMBER_COMMENT_PER_RENDER + 1 > 0 ? indexHightlight - NUMBER_COMMENT_PER_RENDER + 1 : 0;
        const newRenderData = reply.slice(startIndex, indexHightlight + 1);
        indexRef.current = {
          ...indexRef.current,
          startIndex: startIndex - NUMBER_COMMENT_PER_RENDER + 1 > 0 ? startIndex - NUMBER_COMMENT_PER_RENDER + 1 : 0,
          endIndex: indexHightlight + 1,
        };

        setState(prevState => ({
          ...prevState,
          renderData: newRenderData,
          expand: true,
        }));
      }
    }, [indexHightlight]);

    const data = React.useMemo(
      () => (state.expand ? unionBy([...state.renderData], 'id') : []),
      [state.expand, state.renderData],
    );

    const renderItem = React.useMemo(
      () =>
        ({ item }: IRenderItem<IComment>) =>
          <Comment comment={item} navigation={navigation} />,
      [navigation],
    );

    const toggleExpand = () => {
      setState(prevState => ({ ...prevState, expand: !prevState.expand }));
    };

    const pushRenderData = React.useCallback(() => {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const { startIndex, endIndex } = { ...indexRef.current };
        const newRenderData = reply.slice(startIndex, endIndex);
        indexRef.current = {
          ...indexRef.current,
          startIndex: startIndex - NUMBER_COMMENT_PER_RENDER > 0 ? startIndex - NUMBER_COMMENT_PER_RENDER : 0,
        };

        setState(prevState => ({
          ...prevState,
          renderData: newRenderData,
          expand: true,
        }));
      } catch (error) {
        console.log(error);
      }
    }, [reply]);

    const pushRenderDataAfter = React.useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const { endIndex } = { ...indexRef.current };
      const newRenderData = reply.slice(
        endIndex,
        endIndex + NUMBER_COMMENT_PER_RENDER < reply.length ? endIndex + NUMBER_COMMENT_PER_RENDER : reply.length,
      );
      indexRef.current = {
        ...indexRef.current,
        endIndex:
          endIndex + NUMBER_COMMENT_PER_RENDER < reply.length ? endIndex + NUMBER_COMMENT_PER_RENDER : reply.length,
      };

      setState(prevState => ({
        ...prevState,
        renderData: [...prevState.renderData, ...newRenderData],
        expand: true,
      }));
    }, [reply]);

    const textViewReplies = (length: number) => {
      if (length > 1) {
        return `View ${length} replies`;
      } else {
        return `View ${length} reply`;
      }
    };

    const textViewMore = (length: number) => {
      if (length > 1) {
        return `View ${length} more replies`;
      } else {
        return `View ${length} more reply`;
      }
    };

    const textViewPreviousRep = (length: number) => {
      if (length > 1) {
        return `View ${length} previous replies`;
      } else {
        return `View ${length} previous reply`;
      }
    };

    const ViewBeforeReply = React.useMemo(() => {
      if (!reply.length) {
        return null;
      }
      if (state.renderData.length === indexRef.current.endIndex) {
        return state.renderData.length > 2 ? (
          <TouchableOpacity style={styles.viewClickExpand} onPress={toggleExpand} activeOpacity={1}>
            <View style={styles.textExpandBefore} />
            {state.expand ? (
              <TextComponent style={styles.textExpand}>Hide replies</TextComponent>
            ) : (
              <TextComponent style={styles.textExpand}>{textViewReplies(reply.length)}</TextComponent>
            )}
          </TouchableOpacity>
        ) : null;
      }
      return (
        <TouchableOpacity style={styles.viewClickExpand} onPress={pushRenderData} activeOpacity={1}>
          <View style={styles.textExpandBefore} />
          <TextComponent style={styles.textExpand}>
            {state.renderData.length
              ? textViewPreviousRep(indexRef.current.endIndex - state.renderData.length)
              : textViewReplies(indexRef.current.endIndex - state.renderData.length)}
          </TextComponent>
        </TouchableOpacity>
      );
    }, [reply.length, state.renderData.length, state.expand, pushRenderData]);

    const ViewAfterReply = React.useMemo(() => {
      if (!reply.length) {
        return null;
      }
      if (reply.length - indexRef.current.endIndex < 1) {
        return null;
      }
      if (state.renderData.length < reply.length) {
        return (
          <TouchableOpacity style={styles.viewClickExpand} onPress={pushRenderDataAfter} activeOpacity={1}>
            <View style={styles.textExpandBefore} />
            <TextComponent style={styles.textExpand}>
              {textViewMore(reply.length - indexRef.current.endIndex)}
            </TextComponent>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={styles.viewClickExpand} onPress={pushRenderDataAfter} activeOpacity={1}>
          <View style={styles.textExpandBefore} />
          <TextComponent style={styles.textExpand}>
            {textViewMore(indexRef.current.endIndex - state.renderData.length)}
          </TextComponent>
        </TouchableOpacity>
      );
    }, [reply.length, state.renderData.length, pushRenderDataAfter]);

    const keyExtractor = React.useMemo(() => (item: IComment) => item?.id?.toString(), []);

    return (
      <>
        {ViewBeforeReply}
        <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} />
        {ViewAfterReply}
      </>
    );
  },
);
ReplyTreeView.displayName = 'ReplyTreeView';

const styles = StyleSheet.create({
  viewClickExpand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(3),
    paddingHorizontal: scale(8),
    paddingLeft: '12.5%',
  },
  textExpand: {
    color: Colors.Dark_Gray2,
    fontFamily: 'Lexend-Bold',
    fontSize: scale(11),
    opacity: 0.5,
  },
  textExpandBefore: {
    height: scale(1),
    backgroundColor: Colors.Dark_Gray2,
    width: scale(25),
    marginRight: scale(6),
    opacity: 0.5,
  },
});
