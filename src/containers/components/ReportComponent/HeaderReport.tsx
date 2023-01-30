import { insets } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextComponent } from '../TextComponent';
import { styles } from './styles';
interface Props {
  hasStepTwo: boolean;
  onBack(): void;
  onClose(): void;
}
const HeaderReport = (props: Props) => {
  const _goBack = () => {
    props.onBack();
  };
  const _onClose = () => {
    props.onClose();
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: scale(10),
        paddingHorizontal: scale(15),
        borderBottomWidth: scale(2),
        borderColor: Colors.WhiteSmoke,
      }}>
      {props.hasStepTwo ? (
        <TouchableOpacity activeOpacity={0.8} hitSlop={insets} onPress={_goBack}>
          <Icon name="chevron-back-outline" size={scale(35)} color={Colors.dark} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: scale(35) }} />
      )}
      <TextComponent style={styles.headerText}>{props.hasStepTwo ? 'Other' : 'Report'}</TextComponent>
      <TouchableOpacity activeOpacity={0.8} hitSlop={insets} onPress={_onClose}>
        <Icon name="close-outline" size={scale(35)} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(HeaderReport);
