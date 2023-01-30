import { IconExit } from '@/assets/icons/Icon';
import { TextComponent } from '@/containers/components/TextComponent';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styles, { ViewListEmail } from './styles';
type IProps = {
  data: string[];
  controlName: 'email' | 'phoneNumber';
  onPress(tag: string): void;
};
const RenderList = (props: IProps) => {
  const _onPress = (tag: string) => () => {
    props.onPress(tag);
  };
  return props.data.length ? (
    <ViewListEmail>
      {props.data.map((tag, index) => {
        return (
          <TouchableOpacity key={`${tag}-${index}`} style={styles.tag} onPress={_onPress(tag)} activeOpacity={0.8}>
            <View style={styles.tagView}>
              <TextComponent style={styles.textTag}>{tag}</TextComponent>
              <IconExit width={scale(10)} height={scale(10)} fill={Colors.Black} />
            </View>
          </TouchableOpacity>
        );
      })}
    </ViewListEmail>
  ) : null;
};

export default React.memo(RenderList);
