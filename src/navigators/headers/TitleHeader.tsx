import { IconChevronLeft } from '@/assets/icons/Icon';
import { COMMENT_NAVIGATION } from '@/constants';
import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { HeaderTitleStyled } from './styles';

type IProps = {
  title?: string;
  navigation?: any;
  screen?: string;
  clearParams?(): void;
};
const TitleHeader = (props: IProps) => {

  const goBack = () => {
    if (props.clearParams) {
      props.clearParams();
    }
    props.navigation.goBack();
    if (props.screen) {
      switch (props.screen) {
        case COMMENT_NAVIGATION.ALL_COMMENT: {
          // props.navigation.navigate(props.screen);
          break;
        }
        default: {
          props.navigation.navigate(props.screen);
          break;
        }
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.itemHeader}>
          <TouchableOpacity onPress={goBack} activeOpacity={0.8} hitSlop={insets} style={commonStyles.mg_horizontal_12}>
            <IconChevronLeft width={scale(22)} height={scale(24)} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemHeaderCenter}>
          <HeaderTitleStyled>{props.title}</HeaderTitleStyled>
        </View>
        <View style={styles.itemHeader1} />
      </SafeAreaView>
    </>
  );
};
TitleHeader.displayName = 'CommentHeader';

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

export default React.memo(TitleHeader);
