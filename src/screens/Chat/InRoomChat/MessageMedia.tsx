import { APP_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { DoubleTap } from '@/containers/components/DoubleTap';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { IMessageMediaProps } from '@/stores/types/chat.type';
import { Colors } from '@/theme/colors';
import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

export const MessageMedia = React.memo(
  ({ messageId, type, navigation, uri, thumbnail, onDoubleTap, onLongPressMedia, isLike }: IMessageMediaProps) => {
    const isGif = React.useMemo(() => (uri || '').indexOf('.gif') !== -1, [uri]);
    const onPress = React.useCallback(() => {
      if (isGif) {
        return;
      }
      navigation.push(ROOT_ROUTES.MEDIA, { uri, mimeType: type });
    }, [isGif, navigation, uri, type]);

    const RenderMessage = React.useMemo(() => {
      if (type === 'image') {
        return (
          <ImageComponent
            uri={uri}
            width={scale(120)}
            height={scale(160)}
            borderRadius={scale(6)}
            style={styles.containerVideoMessage}
          />
        );
      }
      if (type === 'video') {
        return (
          <View style={styles.containerVideoMessage}>
            <View style={styles.viewPlayVideoIcon}>
              <Icon name="play-circle-outline" size={scale(45)} color={Colors.white} />
            </View>
            <ImageComponent
              uri={thumbnail || ''}
              width={scale(120)}
              height={scale(160)}
              borderRadius={scale(6)}
              style={styles.containerVideoMessage}
            />
          </View>
        );
      }
      return null;
    }, [type, uri, thumbnail]);

    const onLongPress = React.useCallback(() => {
      onLongPressMedia(messageId, isLike)();
    }, [isLike, messageId, onLongPressMedia]);
    return (
      <DoubleTap onPress={onPress} onLongPress={onLongPress} onDoubleTap={onDoubleTap}>
        {RenderMessage}
      </DoubleTap>
    );
  },
);
