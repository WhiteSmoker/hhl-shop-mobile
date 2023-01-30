import { Colors } from '@/theme/colors';
import React from 'react';
import { CheckBox } from 'react-native-elements';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './index.style';

interface ICheckboxProps {
  title: any;
  iconRight: boolean;
  checked: boolean;
  onPress: () => void;
}

const CheckBoxC: React.FC<ICheckboxProps> = props => {
  const { title, iconRight, checked, onPress } = props;

  return (
    <CheckBox
      title={title}
      checked={checked}
      onPress={onPress}
      checkedIcon={<Icon name="radio-button-on" size={scale(20)} color={Colors.Background} />}
      uncheckedIcon={<Icon name="radio-button-off" size={scale(20)} color={Colors.blackOriginal} />}
      textStyle={styles.textStyle}
      iconRight={iconRight}
      containerStyle={[styles.checkboxContainer, checked ? styles.hasValueStyle : styles.noValueStyle]}
    />
  );
};

export default CheckBoxC;
