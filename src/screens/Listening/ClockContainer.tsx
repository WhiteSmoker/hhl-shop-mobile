import { TextComponent } from '@/containers/components/TextComponent';
import { formatMMSS } from '@/utils/format';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
interface IProps {
  currentTime: number;
  duration: number;
}

export const ClockContainer = React.memo(({ currentTime, duration }: IProps) => {
  return (
    <View style={styles.clockContainer}>
      <TextComponent style={styles.clockText}>{formatMMSS(currentTime)}</TextComponent>
      <TextComponent style={styles.clockText}>{formatMMSS(duration)}</TextComponent>
    </View>
  );
});
