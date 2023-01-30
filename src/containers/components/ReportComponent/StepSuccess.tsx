import { IconSuccess } from '@/assets/icons/Icon';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';
import { styles } from './styles';

const StepSuccess = () => {
  return (
    <View style={styles.viewSuccess}>
      <View style={styles.viewSuccessSvg}>
        <IconSuccess width={scale(32)} height={scale(32)} fill={Colors.Background3} />
      </View>
      <TextComponent style={styles.textTitleSuccess}>Thanks for letting us know</TextComponent>
      <TextComponent style={styles.textGreySuccess} numberOfLines={2}>
        Your feedback is important in helping us keep the Stump community safe.
      </TextComponent>
    </View>
  );
};
export default StepSuccess;
