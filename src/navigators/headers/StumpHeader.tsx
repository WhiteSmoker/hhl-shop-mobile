import {
  APP_NAVIGATION,
  CHAT_NAVIGATION,
  COMMENT_NAVIGATION,
  HOME_NAVIGATION,
  PROFILE_NAVIGATION,
  ROOT_ROUTES,
} from '@/constants';
import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';

import React from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import HorizontalRuleComponent from '@/containers/components/HorizontalRuleComponent';
import { IconChevronLeft, IconLogo1, IconLogo2 } from '@/assets/icons/Icon';

type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation?: any;
  route?: any;
  isGoBack: boolean;
};

const StumpHeader = (props: IProps) => {
  const screen = props?.route?.params?.screen;
  console.log('screen', screen);

  const goBack = () => {
    try {
      if (props.isGoBack) {
        props?.navigation?.goBack();
        return;
      }
      if (!screen) {
        props?.navigation?.goBack();
      }

      switch (screen) {
        case HOME_NAVIGATION.DRAFTHOME:
          props?.navigation?.goBack();
          props?.navigation?.navigate(APP_NAVIGATION.HOME, { screen: HOME_NAVIGATION.DRAFTHOME, initial: false });
          break;
        case HOME_NAVIGATION.SCHEDULEDHOME:
          props?.navigation?.goBack();
          props?.navigation?.navigate(APP_NAVIGATION.HOME, { screen: HOME_NAVIGATION.SCHEDULEDHOME, initial: false });
          break;
        case PROFILE_NAVIGATION.FOLLOW_SCREEN:
          props?.navigation?.goBack();
          break;
        case COMMENT_NAVIGATION.ALL_COMMENT:
          props?.navigation?.goBack();
          props?.navigation?.navigate(ROOT_ROUTES.COMMENT);

          break;
        case CHAT_NAVIGATION.ALL_CONVERSATION:
          props?.navigation?.goBack();
          props?.navigation?.navigate(ROOT_ROUTES.CHAT);
          break;
        default:
          props?.navigation?.goBack();
          props?.navigation?.navigate(screen);
          break;
      }
    } catch (error) {
      console.log(error);
    }
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
              <IconChevronLeft width={scale(24)} height={scale(24)} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.itemHeaderCenter}>
          <IconLogo1 width={scale(26)} height={scale(26)} />
          <HorizontalRuleComponent width={scale(4)} height={scale(0)} color="transparent" />
          <IconLogo2 width={scale(153)} height={scale(20)} />
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
    flexDirection: 'row',
  },
  itemHeader1: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default React.memo(StumpHeader);
