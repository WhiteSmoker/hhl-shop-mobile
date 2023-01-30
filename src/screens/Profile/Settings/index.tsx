import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Linking, Platform, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  GroupContainerStyled,
  GroupTouchStyled,
  GroupViewStyled,
  LogOutStyled,
  SubTitleStyled,
  TextLogOutStyled,
  TitleStyled,
} from './styles';

import { APP_NAVIGATION, PROFILE_NAVIGATION, RECORD_MODE, ROOT_ROUTES, SCHEDULE_MODE } from '@/constants';
import CustomSwitch from '@/containers/components/CustomSwitch';
import { ASYNC_STORE, storage } from '@/storage';
import { useAppDispatch } from '@/stores';
import { recordSlice } from '@/stores/reducers/record.reducer';
import { logOut } from '@/stores/thunks/auth.thunk';
import { ContainerStyled, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { requestStoragePermission } from '@/utils/permission';
import * as mime from 'react-native-mime-types';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { NavigationProfile } from '../Profile.prop';
import { format } from 'date-fns';
import { conversationController } from '@/controllers/conversation.controller';
import { stumpController } from '@/controllers';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';

interface Props {
  navigation: NavigationProfile;
}

const Settings = (props: Props) => {
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = async () => {
    await storage.setItem(ASYNC_STORE.AUTOPLAY, !isEnabled ? '1' : '0');
    setIsEnabled(!isEnabled);
  };
  const userInfo = useAuth();

  React.useEffect(() => {
    storage.getItem(ASYNC_STORE.AUTOPLAY).then(autoplay => {
      if (autoplay) {
        setIsEnabled(!!Number(autoplay));
      }
    });
  }, []);

  const _editProfile = () => {
    props.navigation.push(PROFILE_NAVIGATION.EDIT_PROFILE, { profileInfo: userInfo, screen: APP_NAVIGATION.PROFILE });
  };
  const _goToBlocking = () => {
    props.navigation.push(PROFILE_NAVIGATION.BLOCKING);
  };

  const _changePassword = () => {
    props.navigation.push(PROFILE_NAVIGATION.CHANGE_PASSWORD, {
      email: userInfo?.email || '',
      screen: APP_NAVIGATION.PROFILE,
    });
  };

  const _goToPreference = () => {
    props.navigation.navigate(ROOT_ROUTES.PROFILE_PREFERENCE);
  };

  const _link = (type: 'term' | 'policy') => async () => {
    if (type === 'term') {
      await Linking.openURL('https://www.getstump.com/terms');
    } else {
      await Linking.openURL('https://www.getstump.com/privacy');
    }
  };

  const _logOut = async () => {
    console.log('userInfo', userInfo);
    if (Number(userInfo?.loginMethod) === 8) {
      const data = await AccessToken.getCurrentAccessToken();
      if (data?.accessToken) {
        const api = new GraphRequest(
          'me/permissions/',
          {
            accessToken: data.accessToken,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            console.log({ error, result });
          },
        );
        new GraphRequestManager().addRequest(api).start();
        LoginManager.logOut();
      }
    }

    dispatch(logOut({ url: `user/removeDevice`, onEnd: () => props.navigation.push(ROOT_ROUTES.AUTH_NAVIGATION) }));
  };

  const trackColor = React.useMemo(
    () => ({
      false: '#ccadaa',
      true: Colors.Background2,
    }),
    [],
  );

  const uploadExternal = async () => {
    try {
      const permission = await requestStoragePermission();
      if (!permission) {
        return;
      }

      const type = Platform.select({
        ios: ['public.mp3', 'public.mpeg-4-audio'] as any,
        android: [mime.lookup('mp3'), mime.lookup('m4a')],
      });

      const result = await DocumentPicker.pickSingle({
        type,
        allowMultiSelection: false,
      });

      dispatch(recordSlice.actions.setConfig({ recordMode: RECORD_MODE.SOLO }));
      Toast.show({
        type: 'info',
        text1: `Stump`,
        text2: `Formatting audio. We will notify you when ready for upload.`,
        visibilityTime: 10000,
      });
      const host = [
        {
          inviteCode: null,
          inviteValue: userInfo?.email,
          inviteMethod: null,
          userId: userInfo?.id,
          isHost: 1,
        },
      ];
      const res_create = await conversationController.addConversation({
        hostId: userInfo?.id,
        mode: RECORD_MODE.SOLO,
        scheduleMode: SCHEDULE_MODE.NOW,
        scheduledStart: new Date(),
        message: `${userInfo?.displayName} mode solo`,
        status: 1,
        participant: [...host],
      });
      const res_get_detail = await conversationController.getDetailConversation(res_create.data.id);
      const participant = res_get_detail.data[0].participants[0];
      const formData = new FormData();
      let ext = '.m4a';
      if (result.name?.indexOf('.mp3') !== -1) {
        ext = '.mp3';
      }
      formData.append('file', {
        uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', ''),
        name: format(new Date(), 't') + ext,
        type: result.type || 'image/jpeg',
      });

      formData.append('conversationId', participant.conversationId);
      formData.append('participantId', participant.id);
      await stumpController.uploadAudio(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContainerStyled>
      <GroupContainerStyled>
        <GroupViewStyled paddingTop={32}>
          <TitleStyled>Account Settings</TitleStyled>
          <GroupTouchStyled>
            <SubTitleStyled>Auto-play</SubTitleStyled>
            <CustomSwitch
              value={isEnabled}
              trackColor={trackColor}
              thumbColor={isEnabled ? Colors.White : '#f4f3f4'}
              onChange={toggleSwitch}
            />
          </GroupTouchStyled>
        </GroupViewStyled>
        <GroupViewStyled paddingTop={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={_changePassword}>
            <GroupTouchStyled>
              <SubTitleStyled>Change Password</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        <GroupViewStyled paddingTop={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={_editProfile}>
            <GroupTouchStyled>
              <SubTitleStyled>Edit Profile</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        <GroupViewStyled paddingTop={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={_goToPreference}>
            <GroupTouchStyled>
              <SubTitleStyled>Preference</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        <GroupViewStyled paddingTop={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={_goToBlocking}>
            <GroupTouchStyled>
              <SubTitleStyled>Blocked users</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        {userInfo?.isAdvancedUser && (
          <GroupViewStyled paddingTop={16}>
            <TouchableOpacity activeOpacity={0.5} disabled={true}>
              <GroupTouchStyled>
                <SubTitleStyled>Upload externally recorded podcasts</SubTitleStyled>
                <TouchableOpacity activeOpacity={0.8} onPress={uploadExternal} hitSlop={insets}>
                  <Icon name="cloud-upload-outline" size={scale(20)} color={Colors.Gray} />
                </TouchableOpacity>
              </GroupTouchStyled>
            </TouchableOpacity>
          </GroupViewStyled>
        )}
        <GroupViewStyled paddingTop={32}>
          <TitleStyled>Help</TitleStyled>
          <TouchableOpacity activeOpacity={0.5} onPress={_link('term')}>
            <GroupTouchStyled>
              <SubTitleStyled>Terms and Conditions</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        <GroupViewStyled paddingTop={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={_link('policy')}>
            <GroupTouchStyled>
              <SubTitleStyled>Privacy Policy</SubTitleStyled>
            </GroupTouchStyled>
          </TouchableOpacity>
        </GroupViewStyled>
        <LogOutStyled activeOpacity={0.5} onPress={_logOut}>
          <TextLogOutStyled>Log Out</TextLogOutStyled>
        </LogOutStyled>
      </GroupContainerStyled>
    </ContainerStyled>
  );
};

export default Settings;
