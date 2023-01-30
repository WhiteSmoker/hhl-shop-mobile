import { APP_NAVIGATION, CHAT_NAVIGATION, PROFILE_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { stumpController, userController } from '@/controllers';
import { useAuth } from '@/hooks/useAuth';
import { ASYNC_STORE, storage } from '@/storage';
import { IUserInfo, useAppDispatch, useAppSelector } from '@/stores';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { commonStyles } from '@/styles/common';
import { ContainerStyled } from '@/styles/styled-component';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Animated, LayoutChangeEvent, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { IProps } from './Profile.prop';
import {
  MessageButtonStyled,
  MessageButtonTextStyled,
  styles,
  TextDescriptionStyled,
  TextFollowGroupStyled,
  TextFollowStyled,
  TextNumberFollowStyled,
  TextPrimaryNameStyled,
  TextTagNameStyled,
  ViewAvatarStyled,
  ViewDescriptionStyled,
  ViewFollowStyled,
  ViewMainInformationStyled,
  ViewMainProfileStyled,
  ViewMyStumpStyled,
  ViewNameStyled,
} from './Profile.style';
import TabView from './TabView';
import { OpenURLButton } from '@/containers/components/OpenURLButton';
import { Colors } from '@/theme/colors';
import Skeleton from './Skeleton';
import { globalLoading } from '@/containers/actions/emitter.action';
import { IButtonSheetRef } from '@/containers/components/ButtonSheet/propState';
import { ButtonSheet } from '@/containers/components/ButtonSheet';
import { IconFollow, IconUnfollow } from '@/assets/icons/Icon';
import { chatController } from '@/controllers/chat.controller';

type IState = {
  isBlock: boolean;
  isFollow: boolean;
  loading: boolean;
  user?: IUserInfo;
};
export const MIN_HEIGHT_HEADER = scale(10) + scale(100) + scale(20) + scale(14) + scale(22);
export const MAX_HEIGHT_HEADER = scale(10) + scale(100) + scale(20) + scale(14 * 4) + scale(22);

const ProfileComponent = (props: IProps) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const userInfo = useAuth();
  const buttonSheetRef = React.useRef<IButtonSheetRef>();
  const userIdRoute = React.useMemo(() => props?.route?.params?.userId, [props?.route?.params?.userId]);
  const heightConsume = useAppSelector(rootState => rootState.commonState.heightConsume);

  const [heightHeader, setHeightHeader] = React.useState(0);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const scrollYClamped = React.useMemo(() => Animated.diffClamp(scrollY, 0, heightHeader), [heightHeader, scrollY]);
  const translateY = React.useMemo(
    () =>
      scrollYClamped.interpolate({
        inputRange: [0, heightHeader / 3],
        outputRange: [0, -(heightHeader / 1)],
      }),
    [heightHeader, scrollYClamped],
  );

  const [state, setState] = useState<IState>({
    isBlock: false,
    isFollow: false,
    loading: true,
  });
  const [indexActive, setIndexActive] = useState<{ index: number } | undefined>({
    index: 0,
  });

  const userData = useMemo(() => {
    if (userIdRoute) {
      return state.user;
    }
    return userInfo;
  }, [userInfo, userIdRoute, state?.user]);

  useEffect(() => {
    if (isFocused && !userIdRoute) {
      getUserInfo();
    }
  }, [dispatch, isFocused]);

  useEffect(() => {
    setState(preState => ({ ...preState, loading: true }));
    getUserInfo();
  }, [userIdRoute]);

  const getUserInfo = async () => {
    const loginMethod = await storage.getItem(ASYNC_STORE.LOGIN_METHOD);
    try {
      const res = await userController.fetchUser(userIdRoute, loginMethod || '');
      const isFollow = res?.data.listFollowers?.rows?.findIndex((e: any) => e?.id === userInfo?.id) !== -1;
      const isBlock = res?.data.blockedBy?.findIndex(e => e?.id === userInfo?.id) !== -1;
      if (res.status === 1) {
        setState(preState => ({ ...preState, loading: false, user: res.data, isFollow, isBlock }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _navigateFollowScreen =
    (idxActive: number, count = 0) =>
    () => {
      if (!userData) {
        return;
      }
      if (!count) {
        return;
      }
      const screen = userIdRoute ? PROFILE_NAVIGATION.FOLLOW_SCREEN_PROFILE : PROFILE_NAVIGATION.FOLLOW_SCREEN;
      props.navigation.push(screen, {
        userInfo: userData,
        userIdRoute,
        indexActive: idxActive,
      });
    };

  const _goToSetting = React.useCallback(() => {
    props.navigation.push(PROFILE_NAVIGATION.SETTINGS);
  }, [props.navigation]);

  const clearParam = useCallback(() => {
    props.navigation.setParams(undefined);
  }, [props.navigation]);

  useEffect(() => {
    if (props.route.params?.indexActive) {
      setIndexActive(props.route.params?.indexActive);
    } else {
      setIndexActive(undefined);
    }
  }, [props.route.params?.indexActive]);

  const handleMeasureView = React.useCallback((e: LayoutChangeEvent) => {
    e.persist();
    setHeightHeader(e?.nativeEvent?.layout?.height);
  }, []);

  const _follow = React.useCallback(async () => {
    try {
      if (!userIdRoute) {
        return;
      }
      globalLoading(true);
      const res_follow = await stumpController.followUser(userInfo?.id || 0, userIdRoute);
      if (res_follow.status === 1) {
        dispatch(fetchUser(false));
        await getUserInfo();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [dispatch, userIdRoute, userInfo?.id]);

  const goToMessage = React.useCallback(async () => {
    try {
      if (!userIdRoute) {
        return;
      }
      const res = await chatController.createRoom([userIdRoute], 'CHAT');
      if (res.status === 1) {
        props.navigation.navigate(ROOT_ROUTES.CHAT, {
          screen: CHAT_NAVIGATION.IN_ROOM_CHAT,
          initial: false,
          params: { roomId: res.data.roomId, screen: PROFILE_NAVIGATION.VIEW_PROFILE, type: res.data.type },
        });
      } else {
        Alert.alert(res.data as any);
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.navigation, userIdRoute]);

  const _block = React.useCallback(async () => {
    try {
      if (!userIdRoute) {
        return;
      }
      globalLoading(true);
      buttonSheetRef.current?.close();
      const res_block = await userController.blockUser(userIdRoute);
      if (res_block.status === 1) {
        dispatch(fetchUser(false));
        setState(prevState => ({ ...prevState, isBlock: !prevState.isBlock, isFollow: false }));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [dispatch, userIdRoute]);

  const openModal = React.useCallback(() => {
    buttonSheetRef.current?.open();
  }, []);

  const pressMenu = React.useCallback(() => {
    if (userIdRoute) {
      openModal();
    } else {
      _goToSetting();
    }
  }, [_goToSetting, openModal, userIdRoute]);

  const buttons = React.useMemo(
    () => [
      {
        label: state.isBlock ? 'Unblock' : 'Block',
        color: Colors.red,
        onPress: _block,
      },
    ],
    [_block, state.isBlock],
  );

  const RenderButtonFollow = React.useMemo(
    () =>
      !state.isBlock ? (
        <TouchableOpacity onPress={_follow}>
          {state.isFollow ? (
            <View style={styles.viewIconFollow}>
              <IconFollow width={scale(20)} height={scale(20)} fill={Colors.Background3} />
            </View>
          ) : (
            <View style={styles.viewIconUnFollow}>
              <IconUnfollow width={scale(20)} height={scale(20)} fill={Colors.dark} />
            </View>
          )}
        </TouchableOpacity>
      ) : null,
    [state.isBlock, state.isFollow, _follow],
  );

  const ButtonViewProfile = useMemo(() => {
    if (!userIdRoute) {
      return null;
    }
    return (
      <View style={{ ...commonStyles.flexRow, marginTop: scale(9) }}>
        <MessageButtonStyled onPress={goToMessage}>
          <MessageButtonTextStyled>Message</MessageButtonTextStyled>
        </MessageButtonStyled>
        {RenderButtonFollow}
      </View>
    );
  }, [RenderButtonFollow, goToMessage, userIdRoute]);

  if (state.loading) {
    return (
      <View style={[commonStyles.containerFlatlist, commonStyles.pd_horizontal_24]}>
        <Skeleton />
      </View>
    );
  }

  return (
    <ContainerStyled>
      {Platform.OS === 'android' ? (
        <ScrollView style={commonStyles.flex_1} showsVerticalScrollIndicator={false}>
          <ViewMainProfileStyled>
            <ViewMainInformationStyled>
              <ViewAvatarStyled>
                <ImageComponent
                  uri={userData?.avatar || ''}
                  width={scale(100)}
                  height={scale(100)}
                  borderRadius={scale(100)}
                />
              </ViewAvatarStyled>
              <ViewNameStyled>
                <TextPrimaryNameStyled numberOfLines={1}>
                  {`${userData?.firstName.trim() || ''} ${userData?.lastName.trim() || ''}`}
                </TextPrimaryNameStyled>
                <TextTagNameStyled numberOfLines={1}>{`@${
                  userData?.displayName.toLowerCase() || ''
                }`}</TextTagNameStyled>
                <OpenURLButton url={userData?.website} />
                {ButtonViewProfile}
              </ViewNameStyled>
              <TouchableOpacity activeOpacity={0.8} onPress={pressMenu}>
                <Icon
                  name={userIdRoute ? 'ellipsis-horizontal-sharp' : 'settings-sharp'}
                  size={scale(20)}
                  color={Colors.Gray}
                />
              </TouchableOpacity>
            </ViewMainInformationStyled>
            <ViewDescriptionStyled>
              <TextDescriptionStyled numberOfLines={4}>{userData?.described || ''}</TextDescriptionStyled>
            </ViewDescriptionStyled>
            <ViewFollowStyled>
              <ViewFollowStyled>
                <TextFollowGroupStyled onPress={_navigateFollowScreen(0, userData?.listFollowing?.count)}>
                  <TextNumberFollowStyled>{userData?.listFollowing?.count || 0}</TextNumberFollowStyled>
                  <TextFollowStyled>Following</TextFollowStyled>
                </TextFollowGroupStyled>
                <TextFollowGroupStyled onPress={_navigateFollowScreen(1, userData?.listFollowers?.count)}>
                  <TextNumberFollowStyled>{userData?.listFollowers?.count || 0}</TextNumberFollowStyled>
                  <TextFollowStyled>Followers</TextFollowStyled>
                </TextFollowGroupStyled>
              </ViewFollowStyled>
            </ViewFollowStyled>
          </ViewMainProfileStyled>
          {!state.isBlock && (
            <ViewMyStumpStyled style={{ height: heightConsume }}>
              <TabView
                navigation={props.navigation}
                indexActive={indexActive}
                clearParam={clearParam}
                scrollY={scrollY}
                scrollYClamped={scrollYClamped}
                heightHeader={heightHeader}
                userId={userIdRoute}
                displayName={userData?.displayName}
              />
            </ViewMyStumpStyled>
          )}
        </ScrollView>
      ) : (
        <View style={commonStyles.flex_1}>
          <Animated.View
            style={{
              paddingHorizontal: scale(24),
              paddingVertical: scale(10),
              transform: [{ translateY }],
              position: 'absolute',
              zIndex: 10,
              width: '100%',
            }}
            onLayout={handleMeasureView}>
            <ViewMainInformationStyled>
              <ViewAvatarStyled>
                <ImageComponent
                  uri={userData?.avatar || ''}
                  width={scale(100)}
                  height={scale(100)}
                  borderRadius={scale(100)}
                />
              </ViewAvatarStyled>
              <ViewNameStyled>
                <TextPrimaryNameStyled numberOfLines={1}>
                  {`${userData?.firstName.trim() || ''} ${userData?.lastName.trim() || ''}`}
                </TextPrimaryNameStyled>
                <TextTagNameStyled numberOfLines={1}>{`@${
                  userData?.displayName.toLowerCase() || ''
                }`}</TextTagNameStyled>
                <OpenURLButton url={userData?.website} />
                {ButtonViewProfile}
              </ViewNameStyled>
              <TouchableOpacity activeOpacity={0.8} onPress={pressMenu}>
                <Icon
                  name={userIdRoute ? 'ellipsis-horizontal-sharp' : 'settings-sharp'}
                  size={scale(20)}
                  color={Colors.Gray}
                />
              </TouchableOpacity>
            </ViewMainInformationStyled>
            <ViewDescriptionStyled>
              <TextDescriptionStyled numberOfLines={4}>{userData?.described || ''}</TextDescriptionStyled>
            </ViewDescriptionStyled>
            <ViewFollowStyled>
              <ViewFollowStyled>
                <TextFollowGroupStyled onPress={_navigateFollowScreen(0, userData?.listFollowing?.count)}>
                  <TextNumberFollowStyled>{userData?.listFollowing?.count || 0}</TextNumberFollowStyled>
                  <TextFollowStyled>Following</TextFollowStyled>
                </TextFollowGroupStyled>
                <TextFollowGroupStyled onPress={_navigateFollowScreen(1, userData?.listFollowers?.count)}>
                  <TextNumberFollowStyled>{userData?.listFollowers?.count || 0}</TextNumberFollowStyled>
                  <TextFollowStyled>Followers</TextFollowStyled>
                </TextFollowGroupStyled>
              </ViewFollowStyled>
            </ViewFollowStyled>
          </Animated.View>
          {!state.isBlock && (
            <TabView
              navigation={props.navigation}
              indexActive={indexActive}
              clearParam={clearParam}
              scrollY={scrollY}
              scrollYClamped={scrollYClamped}
              heightHeader={heightHeader}
              userId={userIdRoute}
              displayName={userData?.displayName}
            />
          )}
        </View>
      )}
      <ButtonSheet ref={buttonSheetRef as any} buttons={buttons} />
    </ContainerStyled>
  );
};
export default React.memo(ProfileComponent);
