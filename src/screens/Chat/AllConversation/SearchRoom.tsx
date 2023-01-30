import { IRoomChat, ISearchRoomProps } from '@/stores/types/chat.type';
import { IRenderItem, ISectionData } from '@/stores/types/common.type';
import React from 'react';
import { Animated, SectionList, SectionListData, StyleSheet, Text } from 'react-native';
import { CardConversation } from './CardConversation';
import { ifNotchIphone } from '../../../theme/scale';
import { scale } from '@/theme/scale';
import { TextMessageStyled } from '@/screens/Home/Home.style';
import { Colors } from '@/theme/colors';
import useKeyboard from '@/hooks/useKeyboard';
import { useAppSelector } from '@/stores';
import { TextComponent } from '@/containers/components/TextComponent';

export const SearchRoom = React.memo(({ focusAnim, navigation, searchData }: ISearchRoomProps) => {
  const rooms = useAppSelector(rootState => rootState.chatState.rooms);
  const defaultRoom = React.useMemo(() => rooms.filter(room => room.type !== 'MESSAGE_REQUESTS'), [rooms]);
  const { height: heightKeyboard } = useKeyboard();
  const defaultSearch = React.useMemo(() => {
    const sectionList = [
      {
        title: 'Recently',
        data: [...defaultRoom],
      },
    ] as ISectionData<IRoomChat>[];

    const sectionListResult = [
      {
        title: 'Result',
        data: [...(searchData || [])],
      },
    ] as ISectionData<IRoomChat>[];
    return searchData ? sectionListResult : sectionList;
  }, [defaultRoom, searchData]);

  const translateY = React.useMemo(
    () =>
      focusAnim.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [scale(1000), scale(60), 0],
      }),
    [focusAnim],
  );

  const opacity = React.useMemo(
    () =>
      focusAnim.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [0, 0.2, 1],
      }),
    [focusAnim],
  );

  const renderItem = React.useCallback(
    ({ item }: IRenderItem<IRoomChat>) => <CardConversation item={item} navigation={navigation} mode="search" />,
    [navigation],
  );
  const renderSectionHeader = React.useCallback(
    ({ section }: { section: SectionListData<IRoomChat, ISectionData<IRoomChat>> }) => (
      <TextComponent style={styles.textHeaderSection}>{section.title}</TextComponent>
    ),
    [],
  );
  const keyExtractor = React.useCallback(
    (item: IRoomChat, index: number) =>
      item.members.reduce((prev, curr) => (prev += curr.id + curr.displayName + index), '').toString(),
    [],
  );

  const aniStyle = React.useMemo(
    () => ({
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 2,
      top: ifNotchIphone(scale(90 + 6), scale(90 + 12)),
      backgroundColor: 'white',
      transform: [{ translateY }],
      opacity,
    }),
    [opacity, translateY],
  );

  const contentContainerStyle = React.useMemo(
    () => ({ paddingBottom: heightKeyboard + ifNotchIphone(scale(90 + 6), scale(90 + 12)) }),
    [heightKeyboard],
  );

  const ListFooterComponent = React.useMemo(
    () => (searchData && !searchData.length ? <TextMessageStyled>No results found.</TextMessageStyled> : null),
    [searchData],
  );

  return (
    <Animated.View style={aniStyle as any}>
      <SectionList
        contentContainerStyle={contentContainerStyle}
        sections={defaultSearch}
        extraData={defaultSearch}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={ListFooterComponent}
      />
    </Animated.View>
  );
});
SearchRoom.displayName = 'ChatScreen/SearchRoom';
const styles = StyleSheet.create({
  containerSection: { paddingBottom: scale(90 + 12) },
  textHeaderSection: { color: Colors.dark, fontSize: scale(16), padding: scale(12), fontFamily: 'Lexend-Bold' },
});
