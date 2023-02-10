import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';

import { IconChevronLeft } from '@/assets/icons/header';
import { useAuth } from '@/hooks/useAuth';
import { commonStyles } from '@/styles';
import { Colors } from '@/theme/colors';

type IProps = {
  title?: string;
  showArrow?: boolean;
  navigation?: any;
};

const ProfileHeader = (props: IProps) => {
  const userInfo = useAuth();

  const goBack = () => {
    props.navigation?.pop();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemHeaderCenter}>
        {props.showArrow ? (
          <TouchableOpacity onPress={goBack} activeOpacity={0.8} style={styles.itemHeader}>
            <IconChevronLeft width={scale(22)} height={scale(24)} />
            <Text style={[commonStyles.textWhite, commonStyles.font_20]}>{props.title}</Text>
          </TouchableOpacity>
        ) : (
          <View style={[commonStyles.flexRow, commonStyles.align_i_center, commonStyles.m_l_10]}>
            <FastImage
              style={styles.userImage}
              source={{
                uri:
                  userInfo.image ||
                  `https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg`,
              }}
              resizeMode="cover"
            />
            <Text style={[commonStyles.textWhite, commonStyles.font_20, commonStyles.m_l_10]}>{userInfo.username}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scale(50),
    backgroundColor: Colors.Soft_Blue,
  },
  itemHeaderCenter: {
    width: '100%',
    height: scale(50),
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    marginLeft: scale(10),
  },
  userImage: {
    aspectRatio: 1,
    height: scale(40),
    borderRadius: scale(50),
  },
});

export default React.memo(ProfileHeader);
