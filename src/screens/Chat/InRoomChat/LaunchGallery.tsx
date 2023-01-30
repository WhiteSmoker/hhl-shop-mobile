import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { ILaunchGalleryProps, ITempMessage } from '@/stores/types/chat.type';
import { Colors } from '@/theme/colors';
import { requestCameraPermission, requestStoragePermission } from '@/utils/permission';
import { _uploadPresignedUrl, getType, getTypeMessage } from '@/utils/helper';
import { chatSlice } from '@/stores/reducers';
import { chatController } from '@/controllers/chat.controller';
import { scale } from 'react-native-size-scaling';

export const LaunchGallery = React.memo(
  ({
    onChange,
    userGiftedChat,
    containerStyle,
    mode,
    iconName = 'images-outline',
    tintColorIcon = Colors.dark,
  }: ILaunchGalleryProps) => {
    const dispatch = useDispatch();

    const getResultByMode = React.useCallback(async () => {
      let result: ImageOrVideo[] = [];
      if (mode === 'pick') {
        const permission = await requestStoragePermission();
        if (!permission) {
          Promise.reject('No permission.');
        }
        result = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          multiple: true,
          includeBase64: true,
          compressImageQuality: 0.5,
        });
      } else {
        const permission = await requestCameraPermission();
        if (!permission) {
          Promise.reject('No permission.');
        }
        const response = await ImagePicker.openCamera({ mediaType: 'photo' });
        result = [response];
      }
      return result;
    }, [mode]);

    const openGallery = React.useCallback(async () => {
      try {
        const result = await getResultByMode();
        const tempId = Date.now();
        const msgPending: ITempMessage[] = result.map((e, index) => {
          return {
            _id: tempId - index * 1000,
            tempId: tempId - index * 1000,
            text: '',
            createdAt: new Date().getTime() + index * 1000,
            [getTypeMessage(e.mime)]: e.path,
            thumbnail: e.path,
            user: userGiftedChat,
            pending: true,
          };
        });
        dispatch(chatSlice.actions.appendMessagePending(msgPending));
        await Promise.all(
          result.map(async (item, index): Promise<ITempMessage> => {
            const data = {
              uri: item.path,
              data: RNFetchBlob.wrap(Platform.OS === 'android' ? item.path : item.path.replace('file://', '')),
              type: item.mime || 'image/jpeg',
              name: format(new Date(), 't'),
              filename: format(new Date(), 't') + getType(item.mime || 'image/jpeg'),
            };

            let url = '';
            let thumbnail = '';
            if (getTypeMessage(item.mime) === 'video') {
              const formData = new FormData();

              formData.append('file', {
                uri: Platform.OS === 'android' ? item.path : item.path.replace('file://', ''),
                name: format(new Date(), 't') + '.mp4',
                type: item.mime || 'image/jpeg',
              });

              const res = await chatController.getThumnailVideo(formData);
              thumbnail = res.data.thumbnail;
              url = res.data.video;
            } else {
              const file_s3 = await _uploadPresignedUrl(data);
              url = file_s3?.url || '';
            }
            const newMsg = {
              _id: tempId - index * 1000,
              tempId: tempId - index * 1000,
              text: '',
              createdAt: new Date().getTime() + index * 1000,
              [getTypeMessage(item.mime)]: url,
              user: userGiftedChat,
              thumbnail,
            };
            if (onChange) {
              onChange([newMsg]);
            }
            return newMsg;
          }),
        );
      } catch (error) {
        console.log(error);
      }
    }, [dispatch, getResultByMode, onChange, userGiftedChat]);

    const finalStyle = React.useMemo(() => containerStyle, [containerStyle]);

    const icon = React.useMemo(
      () => <Icon name={iconName} size={scale(22)} color={tintColorIcon} />,
      [iconName, tintColorIcon],
    );

    return (
      <TouchableOpacity onPress={openGallery} style={finalStyle}>
        {icon}
      </TouchableOpacity>
    );
  },
);
LaunchGallery.displayName = 'ChatScreen/LaunchGallery';
