import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { File } from '@/stores';
import { commonSlice } from '@/stores/reducers';
import { Conversation } from '@/stores/types/record.type';
import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { formatTime } from '@/utils/format';
import React, { useImperativeHandle, useState } from 'react';
import { Animated, FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { TextComponent } from '../TextComponent';
import { styles } from './styles';

const ChooseFileModal = React.forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const [filePlayable, setFilePlayable] = useState<Conversation>();
  const contentContainerStyle = usePaddingBottomFlatlist();
  const [bgModal, setBgModal] = useState('transparent');
  const slideYAnim = React.useRef(new Animated.Value(300)).current;

  const _closeModal = async () => {
    await _aniOffSlideY();
    setFilePlayable(undefined);
  };

  const onShow = async () => {
    setBgModal('rgba(0,0,0,0.2)');
    await _aniSlideY();
  };

  const _aniSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const _aniOffSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 300,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const playAudio = (index: number) => async () => {
    if (filePlayable) {
      const newData = {
        ...filePlayable,
        title: (filePlayable?.draft && JSON.parse(filePlayable?.draft).title) || '',
        description: (filePlayable?.draft && JSON.parse(filePlayable?.draft).description) || '',
        file: [filePlayable?.files[index]],
        screen: '',
        notStump: true,
        duration: filePlayable?.files[index].duration,
        listStump: [],
        conversationId: filePlayable?.id,
      };
      await _closeModal();
      dispatch(commonSlice.actions.setPlayStump(newData as any));
    }
  };

  const _keyExtractor = (item: any) => item.id?.toString();

  const renderItem = ({ item, index }: { item: File; index: number }) => (
    <>
      <TouchableOpacity style={styles.iconView} activeOpacity={0.6} key={item.id} onPress={playAudio(index)}>
        <Icon name="musical-notes-sharp" size={scale(22)} color={Colors.Gray} />
        <TextComponent style={styles.socialText}>File {index + 1}</TextComponent>
        <TextComponent style={styles.socialText}>Duration: {formatTime(item?.duration)}</TextComponent>
      </TouchableOpacity>
    </>
  );

  useImperativeHandle(
    ref,
    () => ({
      open: (data: Conversation) => {
        setFilePlayable(data);
      },
      close: () => {
        _closeModal();
      },
    }),
    [],
  );

  return (
    <Modal visible={!!filePlayable} animationType="none" transparent={true} onShow={onShow}>
      <TouchableWithoutFeedback onPress={_closeModal}>
        <View style={[styles.modalContainer, { backgroundColor: bgModal }]}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideYAnim }] }]}>
            <View style={styles.sign} />
            <TextComponent style={styles.headerText}>Choose file to play</TextComponent>
            <View style={styles.body}>
              <FlatList
                style={commonStyles.containerFlatlist}
                contentContainerStyle={contentContainerStyle}
                data={filePlayable?.files?.filter(file => !!file.filePath)}
                renderItem={renderItem}
                keyExtractor={_keyExtractor}
              />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default ChooseFileModal;
