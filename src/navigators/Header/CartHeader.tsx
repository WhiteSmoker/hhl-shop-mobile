import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';

import { IconChevronLeft } from '@/assets/icons/header';
import { commonStyles } from '@/styles';
import { Colors } from '@/theme/colors';

type IProps = {
  title: string;
  showArrow?: boolean;
  navigation?: any;
};

const CartHeader = (props: IProps) => {
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
          <Text style={[commonStyles.textWhite, commonStyles.font_20, commonStyles.m_l_10]}>{props.title}</Text>
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
});

export default React.memo(CartHeader);
