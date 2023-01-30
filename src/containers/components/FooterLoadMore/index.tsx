import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';
type Props = {
  loadingMore: boolean;
};
const FooterLoadMore = (props: Props) => {
  return (
    <View>
      {props.loadingMore ? (
        <View style={commonStyles.viewIndicator}>
          <ActivityIndicator color={Colors.Dark_Gray1} size={scale(25)} />
          <TextComponent style={commonStyles.textIndicator}>Loading more</TextComponent>
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(FooterLoadMore);
