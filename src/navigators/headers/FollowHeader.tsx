import { PROFILE_NAVIGATION } from '@/constants';
import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { ProfileStackParam } from '../ProfileNavigator';
import { IconChevronLeft } from '@/assets/icons/header';
import { TextComponent } from '@/containers/components/TextComponent';
type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation: any;
  route:
    | RouteProp<ProfileStackParam, PROFILE_NAVIGATION.FOLLOW_SCREEN>
    | RouteProp<ProfileStackParam, PROFILE_NAVIGATION.FOLLOW_SCREEN_PROFILE>;
};
const FollowHeader = (props: IProps) => {
  const goBack = () => {
    props.navigation?.pop();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.itemHeader}>
          {props.showArrow ? (
            <TouchableOpacity
              onPress={goBack}
              activeOpacity={0.8}
              hitSlop={insets}
              style={commonStyles.mg_horizontal_12}>
              <IconChevronLeft width={scale(22)} height={scale(24)} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.itemHeaderCenter}>
          <TextComponent style={styles.text}>{props.route.params?.userInfo?.displayName || ''}</TextComponent>
        </View>
        <View style={styles.itemHeader1} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(90),
    backgroundColor: Colors.Background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
  text: {
    fontSize: scale(16),
    lineHeight: scale(18),
    color: Colors.White,
  },
  itemHeader: {
    flex: 1,
    height: scale(90),
    justifyContent: 'center',
  },
  itemHeaderCenter: {
    flex: 3,
    height: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeader1: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default React.memo(FollowHeader);
