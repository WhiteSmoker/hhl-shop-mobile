import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import { useAuth } from '@/hooks/useAuth';
import { requestCameraPermission, requestStoragePermission } from '@/utils/permission';
import { _uploadPresignedUrl, getType } from '@/utils/helper';
import { insets } from '@/styles/common';
import { commentSlice } from '@/stores/reducers';

export const CommentPickPhoto = React.memo(
  ({
    onChange,
    containerStyle,
    mode,
    parentId,
    iconName = 'images-outline',
    tintColorIcon = Colors.dark,
    size = scale(22),
  }: any) => {
    const dispatch = useDispatch();
    const userInfo = useAuth();
    const getResultByMode = React.useCallback(async () => {
      let result: ImageOrVideo;
      if (mode === 'pick') {
        const permission = await requestStoragePermission();
        if (!permission) {
          Promise.reject('No permission.');
        }
        result = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          compressImageQuality: 0.5,
          multiple: false,
        });
      } else {
        const permission = await requestCameraPermission();
        if (!permission) {
          Promise.reject('No permission.');
        }
        const response = await ImagePicker.openCamera({ mediaType: 'photo' });
        result = response;
      }
      return result;
    }, [mode]);

    const openGallery = React.useCallback(async () => {
      try {
        const result = await getResultByMode();
        const data = {
          uri: result.path,
          data: RNFetchBlob.wrap(Platform.OS === 'android' ? result.path : result.path.replace('file://', '')),
          type: result.mime || 'image/jpeg',
          name: format(new Date(), 't'),
          filename: format(new Date(), 't') + getType(result.mime || 'image/jpeg'),
        };
        const tempId = Date.now();
        dispatch(
          commentSlice.actions.addResReplyComment({
            _id: tempId,
            id: Date.now(),
            content: result.path,
            parentId,
            type: 'MEDIA',
            createdAt: new Date().toISOString(),
            user: userInfo,
            likedBy: [],
            totalReact: 0,
            isReacted: false,
          }),
        );
        const file_s3 = await _uploadPresignedUrl(data);
        onChange(file_s3?.url || '', tempId);
      } catch (error) {
        console.log(error);
      }
    }, [getResultByMode, dispatch, parentId, userInfo, onChange]);

    const finalStyle = React.useMemo(() => containerStyle, [containerStyle]);

    const icon = React.useMemo(
      () => <Icon name={iconName} size={size} color={tintColorIcon} />,
      [iconName, tintColorIcon, size],
    );

    return (
      <TouchableOpacity onPress={openGallery} style={finalStyle} hitSlop={insets}>
        {icon}
      </TouchableOpacity>
    );
  },
);
CommentPickPhoto.displayName = 'ChatScreen/CommentPickPhoto';
