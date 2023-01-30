import { commonStyles, insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Animated, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { IconChevronLeft } from '@/assets/icons/Icon';
type IProps = {
  navigation?: any;
  screen?: string;
  clearParams?(): void;
  route?: any;
  focusAnim?: Animated.Value;
};
const ChatHeader = (props: IProps) => {
  const goBack = () => {
    if (props.clearParams) {
      props.clearParams();
    }
    props.navigation.goBack();
    if (props.screen) {
      props.navigation.navigate(props.screen);
    }
  };

  const title = React.useMemo(() => props.route?.params?.title || 'Messages', [props.route?.params?.title]);

  const translateY = React.useMemo(
    () =>
      props.focusAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, scale(-50)],
      }) || 0,
    [props.focusAnim],
  );
  const opacity = React.useMemo(
    () =>
      props.focusAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }) || 1,
    [props.focusAnim],
  );

  return (
    <>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }, { opacity }]}>
        <SafeAreaView style={styles.container}>
          <View style={styles.itemHeader}>
            <TouchableOpacity
              onPress={goBack}
              activeOpacity={0.8}
              hitSlop={insets}
              style={commonStyles.mg_horizontal_12}>
              <IconChevronLeft width={scale(22)} height={scale(24)} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemHeaderCenter}>
            <HeaderTitleStyled>{title}</HeaderTitleStyled>
          </View>
          <View style={styles.itemHeader1} />
        </SafeAreaView>
      </Animated.View>
    </>
  );
};
ChatHeader.displayName = 'ChatHeader';

const HeaderTitleStyled = styled.Text`
  font-style: normal;
  font-family: Lexend-Bold;
  font-size: ${scale(18)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.white};
`;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    height: scale(90),
    width: '100%',
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
    alignItems: 'flex-end',
    ...commonStyles.mg_horizontal_12,
  },
});

export default React.memo(ChatHeader);
