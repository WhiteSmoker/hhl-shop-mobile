import { IconChevronLeft } from '@/assets/icons/header';
import { APP_NAVIGATION } from '@/constants';
import { NavigationHome } from '@/screens/Home/Home.prop';
import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { HeaderTitleStyled } from './styles';
type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation?: NavigationHome;
  route: any;
  isGoBack: boolean;
  clearParams?(): void;
};
const HomeHeader = (props: IProps) => {
  const screen = props?.route?.params?.stumpDetail?.screen;

  const goBack = () => {
    if (props.clearParams) {
      props.clearParams();
    }
    if (props.isGoBack) {
      props?.navigation?.goBack();
      return;
    }
    if (!screen) {
      props?.navigation?.goBack();
    }
    switch (screen) {
      case APP_NAVIGATION.HOME:
        props?.navigation?.goBack();
        break;
      case APP_NAVIGATION.SEARCH:
        props?.navigation?.goBack();
        props?.navigation?.navigate(APP_NAVIGATION.SEARCH);
        break;
      default:
        props?.navigation?.goBack();
        props?.navigation?.navigate(screen);
        break;
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
              <IconChevronLeft width={scale(22)} height={scale(24)} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.itemHeaderCenter}>
          <HeaderTitleStyled>{props.title}</HeaderTitleStyled>
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
  },
  itemHeader1: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default React.memo(HomeHeader);
