import { IconDownload, IconLogo1, IconShare } from '@/assets/icons/Icon';
import { Stump, useAppSelector } from '@/stores';
import { commonSlice, stumpSlice } from '@/stores/reducers';
import { apiURL } from '@/networking';
import React, { useImperativeHandle, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import Share from 'react-native-share';
import { useDispatch } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { styles } from './styles';
import { useAuth } from '@/hooks/useAuth';
import { globalLoading } from '@/containers/actions/emitter.action';
import { providerController } from '@/controllers/provider.controller';
import { stumpController } from '@/controllers/stump.controller';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { TextComponent } from '../TextComponent';

const ShareModal = React.forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const [shareItem, setShareItem] = useState<Stump>();
  const userInfo = useAuth();
  const stumps = useAppSelector(rootState => rootState.stumpState.stumps);
  // const stumpSearch = useAppSelector(rootState => rootState.searchState.search_stumps);
  // const dfSearch = useAppSelector(rootState => rootState.searchState.default_search);
  const [bgModal, setBgModal] = useState('transparent');
  const slideYAnim = React.useRef(new Animated.Value(300)).current;

  const increaseNumberShare = (data: Stump[]) => {
    return data.map(stump => {
      if (stump.id === shareItem?.id) {
        return { ...stump, userShared: [...(stump.userShared ?? []), userInfo?.id] };
      } else {
        return { ...stump };
      }
    });
  };

  const _reStump = async () => {
    try {
      if (checkShareItem()) {
        Alert.alert('', 'You can not share this stump!');
        return;
      }
      if (!shareItem) {
        return;
      }
      setShareItem(undefined);
      globalLoading(true);
      const res_shareStump = await stumpController.shareStump(shareItem?.id);
      if (res_shareStump.status === 1) {
        const newShareItem = { ...shareItem, userShared: [...(shareItem.userShared ?? []), userInfo?.id || 0] };
        // const newRestumped = [...stumps.restumped, ...[newShareItem]];
        // const newLiked = increaseNumberShare(stumps.liked);
        // const newJoined = increaseNumberShare(stumps.joined);
        // const newJoinedProfile = increaseNumberShare(stumps.joinedProfile);
        // const newLikedProfile = increaseNumberShare(stumps.likedProfile);
        // const newCreatedProfile = increaseNumberShare(stumps.createdProfile);
        // const newShareProfile = increaseNumberShare(stumps.restumpedProfile);
        // const newHome = increaseNumberShare(stumps.home);

        // dispatch(
        //   stumpSlice.actions.setListStump({
        //     restumped: newRestumped,
        //     home: newHome,
        //     liked: newLiked,
        //     joined: newJoined,
        //     joinedProfile: newJoinedProfile,
        //     likedProfile: newLikedProfile,
        //     createdProfile: newCreatedProfile,
        //     restumpedProfile: newShareProfile,
        //   }),
        // );
        // const newHashtagArr = increaseNumberShare(stumpSearch.hashtag);
        // const newTitleArr = increaseNumberShare(stumpSearch.title);

        // const newDefaultSearch = dfSearch.default.map((e: any) => {
        //   const newStumps = increaseNumberShare(e.stumps);
        //   return { ...e, stumps: newStumps };
        // });
        // dispatch(setListStumpSearch({ hashtag: newHashtagArr, title: newTitleArr }));
        // dispatch(setDefaultSearch({ default: newDefaultSearch }));
        // dispatch(fetchRestump('stump/getListStumpShared'));
        dispatch(commonSlice.actions.setPlayStump(newShareItem));
        emitter(EDeviceEmitter.UPDATE_NUMBER_SHARE_HOME, { id: shareItem?.id, userId: userInfo?.id || 0 });
        emitter(EDeviceEmitter.UPDATE_NUMBER_SHARE_PROFILE, { id: shareItem?.id, userId: userInfo?.id || 0 });
        emitter(EDeviceEmitter.UPDATE_NUMBER_SHARE_OTHER_PROFILE, { id: shareItem?.id, userId: userInfo?.id || 0 });
        emitter(EDeviceEmitter.SHARE_SUCCESFULLY);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  const checkShareItem = () => {
    return userInfo && shareItem?.hostId === userInfo.id;
  };

  const _more = async () => {
    try {
      const linkTrial = `${apiURL}/stump/socialSharing?url=${'stump://app/consume/' + shareItem?.id}&audioUrl=${
        shareItem?.file[0]?.filePath
      }&stumpId=${shareItem?.id}&description=${shareItem?.description}&author=${
        shareItem?.participants[0]?.user?.displayName
      }`;
      const res_short = await providerController.getShortLinkHelper(linkTrial);
      const shareOptions = {
        title: res_short?.shortLink ?? '',
        url: res_short?.shortLink ?? '',
      };
      await Share.open(shareOptions);
    } catch (error: any) {
      console.log(error);
    } finally {
      _closeModal();
    }
  };

  const getFileExtention = (fileUrl: any) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const checkPermission = async () => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadStump();
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadStump();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadStump = () => {
    console.log('download');
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = shareItem?.file[0]?.filePath || '';
    // Function to get extention of the file url
    let file_ext: any = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.MusicDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Alert.alert('File Downloaded Successfully.', '');
      });
  };

  const _closeModal = async () => {
    await _aniOffSlideY();
    setShareItem(undefined);
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

  useImperativeHandle(
    ref,
    () => ({
      open: (data: Stump) => {
        setShareItem(data);
      },
      close: () => {
        _closeModal();
      },
    }),
    [],
  );

  return (
    <Modal visible={!!shareItem} animationType="none" transparent={true} onShow={onShow}>
      <TouchableWithoutFeedback onPress={_closeModal}>
        <View style={[styles.modalContainer, { backgroundColor: bgModal }]}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideYAnim }] }]}>
            <View style={styles.sign} />
            <TextComponent style={styles.headerText}>Share</TextComponent>
            <View style={styles.body}>
              {!checkShareItem() ? (
                <View style={styles.iconView}>
                  <TouchableOpacity style={styles.iconView} activeOpacity={0.6} onPress={_reStump}>
                    <View style={styles.viewRestump}>
                      <IconLogo1 width={scale(30)} height={scale(30)} />
                    </View>
                    <TextComponent style={styles.socialText}>Stump</TextComponent>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.iconView}>
                <TouchableOpacity style={styles.iconView} activeOpacity={0.6} onPress={checkPermission}>
                  <View style={styles.viewMore}>
                    <IconDownload width={scale(42)} height={scale(42)} />
                  </View>
                  <TextComponent style={styles.socialText}>Download</TextComponent>
                </TouchableOpacity>
              </View>
              <View style={styles.iconView}>
                <TouchableOpacity style={styles.iconView} activeOpacity={0.6} onPress={_more}>
                  <View style={styles.viewMore}>
                    <IconShare width={scale(24)} height={scale(24)} />
                  </View>
                  <TextComponent style={styles.socialText}>More Options...</TextComponent>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default ShareModal;
