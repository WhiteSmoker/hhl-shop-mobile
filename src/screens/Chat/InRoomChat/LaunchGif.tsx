import React from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconGif } from '@/assets/icons/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { scale } from 'react-native-size-scaling';
import { DragModal, IDragModalRef } from '@/containers/components/DragModalComponent';
import useKeyboard from '@/hooks/useKeyboard';
import { GifObject } from '@/stores/types/chat.type';
import { chatSlice } from '@/stores/reducers';
import { IRenderItem } from '@/stores/types/common.type';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { Colors } from '@/theme/colors';
import { chatController } from '@/controllers/chat.controller';

export const LaunchGif = React.memo(({ containerStyle, onChange, userGiftedChat }: any) => {
  const dispatch = useDispatch();
  const finalStyle = React.useMemo(() => containerStyle, [containerStyle]);
  const { height: keyboardHeight } = useKeyboard();
  const [data, setData] = React.useState<{ trending: GifObject[]; search?: GifObject[] }>({
    trending: [],
    search: undefined,
  });

  const dragModalRef = React.useRef<IDragModalRef>();
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const timeout = React.useRef<number>();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    chatController.getTrendingGif().then(res => {
      setData(prev => ({ ...prev, trending: res.data }));
    });
  }, []);

  const showModal = async () => {
    dragModalRef.current?.show();
  };

  const chooseGif = (url: string) => () => {
    const tempId = Date.now();
    const msgPending = {
      _id: tempId,
      tempId,
      text: '',
      createdAt: new Date().getTime(),
      image: url,
      user: userGiftedChat,
      pending: true,
    };
    dispatch(chatSlice.actions.appendMessagePending([msgPending]));
    if (onChange) {
      onChange([msgPending]);
    }
    dragModalRef.current?.hide();
  };

  const onChangeText = async (text: string) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (!text) {
      Animated.spring(focusAnim, { bounciness: 0.5, toValue: 0, useNativeDriver: true }).start();
      setData(prev => ({ ...prev, search: undefined }));
      return;
    }
    if (text && text.length === 1) {
      Animated.spring(focusAnim, { bounciness: 0.5, toValue: 1, useNativeDriver: true }).start();
    }
    timeout.current = setTimeout(async () => {
      const res = await chatController.searchGif(text);
      setData(prev => ({ ...prev, search: res.data }));
    }, 350);
  };

  const onFocus = () => {
    dragModalRef?.current?.onFocus();
  };

  const renderItem = React.useCallback(({ item }: IRenderItem<GifObject>) => {
    const urlShow = item?.images?.preview_gif?.url || '';
    const urlSend = item?.images?.fixed_height?.url || '';
    return (
      <TouchableOpacity
        style={{ margin: scale(10), flex: 0.5, width: '100%' }}
        activeOpacity={0.8}
        onPress={chooseGif(urlSend)}>
        <ImageComponent uri={urlShow} width={'100%'} height={scale(100)} borderRadius={scale(10)} />
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = React.useCallback((item: GifObject) => item.id?.toString(), []);

  const memoData = React.useMemo(() => data.search || data.trending, [data.search, data.trending]);

  const memoContentContainerStyle = React.useMemo(
    () => ({ paddingBottom: keyboardHeight || scale(100) }),
    [keyboardHeight],
  );

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY },
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  return (
    <>
      <TouchableOpacity style={finalStyle} onPress={showModal}>
        <IconGif width={scale(20)} height={scale(20)} />
      </TouchableOpacity>
      <DragModal ref={dragModalRef as any} scrollY={scrollY}>
        <View style={styles.viewSearch}>
          <Icon name="search-outline" size={scale(22)} color={Colors.Gray} />
          <TextInput
            style={styles.viewInputSearch}
            placeholder="Search more GIF..."
            onChangeText={onChangeText}
            onFocus={onFocus}
          />
          <Animated.View
            style={{
              opacity: focusAnim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 0, 1],
              }),
            }}>
            <Icon name="close-outline" size={scale(22)} color={Colors.Gray} />
          </Animated.View>
        </View>
        <Animated.FlatList
          data={memoData}
          renderItem={renderItem}
          onScroll={handleScroll}
          keyExtractor={keyExtractor}
          numColumns={2}
          style={styles.styleFlatlist}
          contentContainerStyle={memoContentContainerStyle}
        />
      </DragModal>
    </>
  );
});
LaunchGif.displayName = 'ChatScreen/LaunchGif';

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: scale(100),
  },
  styleFlatlist: { marginTop: scale(12), flex: 1 },
  viewSearch: {
    marginTop: scale(8),
    backgroundColor: Colors.Light_Gray,
    opacity: 0.7,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(3),
    borderRadius: scale(8),
    flexDirection: 'row',
  },
  viewInputSearch: { padding: 0, marginLeft: scale(0), width: '80%', fontSize: scale(13) },
});
