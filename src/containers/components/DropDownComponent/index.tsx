import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextComponent } from '../TextComponent';
import styles from './index.style';

interface IDropDownProps {
  items: object[];
  placeholder?: string;
  height?: number;
  dropdownPosition?: 'bottom' | 'top';
  onChange: (team: any, league: string) => void;
}

const DropDownC: React.FC<IDropDownProps> = props => {
  const { items, placeholder, height, dropdownPosition, onChange } = props;

  const [value, setValue] = React.useState<any>([]);

  return (
    <View>
      <TextComponent style={styles.textLeagueStyle}>{placeholder}</TextComponent>
      <MultiSelect
        style={[styles.dropDownContainer, value.length > 0 ? styles.hasValueStyle : styles.noValueStyle]}
        placeholderStyle={styles.textStyle}
        selectedTextStyle={styles.textStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.itemContainer}
        itemTextStyle={styles.textStyle}
        iconColor={Colors.blackOriginal}
        data={items}
        labelField="label"
        valueField="value"
        value={value}
        renderItem={item => (
          <View style={styles.selectedStyle}>
            <TextComponent style={styles.textStyle}>{item.label}</TextComponent>
          </View>
        )}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedItemStyle}>
              <View style={{ flexDirection: 'row' }}>
                <TextComponent style={styles.textStyle}>{item.label}</TextComponent>
                <Icon name="remove" size={scale(12)} color={Colors.Background} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        placeholder={'Select item'}
        search
        searchPlaceholder="Search..."
        inside={true}
        dropdownPosition={dropdownPosition || 'auto'}
        // renderInputSearch={}
        maxHeight={height || 300}
        statusBarIsTranslucent={true}
        onChange={(item: number[]) => {
          if (placeholder) {
            onChange(item, placeholder);
            setValue(item);
          }
        }}
      />
    </View>
  );
};

export default DropDownC;
