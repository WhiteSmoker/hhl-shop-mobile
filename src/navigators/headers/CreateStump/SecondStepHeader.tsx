import { Colors } from '@/theme/colors';
import { commonStyles, insets } from '@/styles/common';
import React from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HeaderTitleStyled, TextRightStyled } from '../styles';
import { APP_NAVIGATION, RECORD_NAVIGATION } from '@/constants';
import { IconChevronLeft } from '@/assets/icons/Icon';
import { scale } from 'react-native-size-scaling';
type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation?: any;
  route?: any;
};
const ChooseContentHeader = (props: IProps) => {
  const count = 0;
  const goBack = async () => {
    Keyboard.dismiss();
    switch (props.route?.params?.screen) {
      case APP_NAVIGATION.HOME: {
        props.navigation?.goBack();
        props.navigation.navigate(props.route?.params?.screen);
        break;
      }
      case RECORD_NAVIGATION.PUBLISH_SUCCESS:
      case RECORD_NAVIGATION.PUBLISH: {
        props.navigation?.navigate(APP_NAVIGATION.CREATE, { screen: RECORD_NAVIGATION.FIRST_STEP, initial: false });
        break;
      }
      default: {
        props.navigation?.goBack();
        break;
      }
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container]}>
        <View style={styles.itemHeader2}>
          {props.showArrow ? (
            <TouchableOpacity
              onPress={goBack}
              activeOpacity={0.5}
              hitSlop={insets}
              style={commonStyles.mg_horizontal_12}>
              <IconChevronLeft width={scale(22)} height={scale(24)} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.itemHeader}>
          <HeaderTitleStyled>{props.title}</HeaderTitleStyled>
        </View>
        <View style={[styles.itemHeader1, (props.showArrow || (!props.showArrow && props.hideRight)) && { flex: 1 }]}>
          {!props.hideRight ? (
            <TouchableOpacity activeOpacity={0.8} hitSlop={insets} style={commonStyles.mg_horizontal_12}>
              <TextRightStyled>SCHEDULED({count})</TextRightStyled>
            </TouchableOpacity>
          ) : null}
        </View>
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
    flex: 2,
    height: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeader2: {
    flex: 1,
    height: scale(90),
    justifyContent: 'center',
    // alignItems: 'center',
  },
  itemHeader1: {
    justifyContent: 'center',
  },
});

export default React.memo(ChooseContentHeader);
