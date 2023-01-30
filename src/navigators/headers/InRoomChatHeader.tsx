import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { IUserInfo } from '@/stores';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { APP_NAVIGATION, PROFILE_NAVIGATION } from '@/constants';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { scale } from 'react-native-size-scaling';
import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { IconChevronLeft } from '@/assets/icons/header';
import { TextComponent } from '@/containers/components/TextComponent';
type IProps = {
  members: IUserInfo[];
  isGroup: boolean;
  loading: boolean;
  navigation?: any;
  screen?: string;
  clearParams?(): void;
  openEditName?(): void;
  name?: string;
};

export const InRoomChatHeader = ({ openEditName, ...props }: IProps) => {
  const dispatch = useDispatch();
  const { isBlockMe } = useUserBlockMe();
  const goBack = () => {
    if (props.clearParams) {
      props.clearParams();
    }
    props.navigation.goBack();

    if (props.screen) {
      props.navigation.navigate(props.screen);
    }
  };

  const goToProfile = React.useCallback(() => {
    try {
      if (!props.members[0].id) {
        return;
      }
      isBlockMe(props.members[0].id);
      props.navigation.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.VIEW_PROFILE,
        initial: false,
        params: { userId: props.members[0].id, screen: props.screen },
      });
    } catch (error) {
      console.log(error);
    }
  }, [isBlockMe, props.members, props.navigation, props.screen]);

  const HeaderCenter = React.useMemo(() => {
    const nameGroup = props.members
      .map(mem => mem.firstName + ' ' + mem.lastName)
      .toString()
      .replace(/[,]/gi, ', ');
    return !props.isGroup && props.members?.length ? (
      <View style={styles.itemHeaderCenter}>
        <TouchableOpacity onPress={goToProfile}>
          <ImageComponent
            uri={props.members[0]?.avatar || ''}
            width={scale(50)}
            height={scale(50)}
            borderRadius={scale(50)}
            style={styles.avt}
          />
        </TouchableOpacity>

        <View style={{ paddingHorizontal: scale(12) }}>
          <TextComponent numberOfLines={1} style={styles.partnerName}>
            {props.members[0]?.firstName + ' ' + props.members[0]?.lastName}
          </TextComponent>
          <TextComponent numberOfLines={1} style={styles.partnerDisplayname}>
            @{props.members[0]?.displayName}
          </TextComponent>
        </View>
      </View>
    ) : (
      <View style={styles.itemHeaderCenter}>
        <TextComponent numberOfLines={1} style={styles.partnerName}>
          {props.name || nameGroup}
        </TextComponent>
      </View>
    );
  }, [props.members, props.isGroup, props.name, goToProfile]);

  const openPopup = React.useCallback(() => {
    if (openEditName) {
      openEditName();
    }
  }, [openEditName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemHeader}>
        <TouchableOpacity onPress={goBack} activeOpacity={0.8} hitSlop={insets} style={commonStyles.mg_horizontal_12}>
          <IconChevronLeft width={scale(22)} height={scale(24)} />
        </TouchableOpacity>
      </View>
      {props.loading ? null : HeaderCenter}
      {props.isGroup && (
        <TouchableOpacity
          onPress={openPopup}
          activeOpacity={0.8}
          hitSlop={insets}
          style={commonStyles.mg_horizontal_12}>
          <Icon name="create-outline" color="white" size={scale(22)} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
InRoomChatHeader.displayName = 'ChatScreen/HeaderInRoomChat';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(100),
    backgroundColor: Colors.Background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
  itemHeader: {
    flex: 1,
    height: scale(100),
    justifyContent: 'center',
  },
  itemHeaderCenter: {
    flex: 6,
    height: scale(90),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeader1: {
    flex: 1,
    justifyContent: 'center',
  },
  partnerName: {
    color: Colors.white,
    fontSize: scale(16),
    fontFamily: 'Lexend-Bold',
  },
  partnerDisplayname: {
    color: Colors.Light_Gray,
    fontSize: scale(13),
  },
  avt: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(60),
    borderColor: Colors.primaryColor05,
    borderWidth: scale(1),
  },
});
