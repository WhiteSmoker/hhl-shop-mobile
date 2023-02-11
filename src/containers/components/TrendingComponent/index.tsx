import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import { TextComponent } from '../TextComponent';
import { styles, ViewContainerScore, ViewHorizontal, ViewTrending } from './styles';

import { IconEdit } from '@/assets/icons/Icon';
import { Colors } from '@/theme/colors';

interface ITrendingComponentProps {
  onPressPreference?: () => void;
}

const TrendingComponent = (props: ITrendingComponentProps) => {
  return (
    <ViewTrending>
      <ViewHorizontal style={{ marginBottom: 6, width: '95%', alignSelf: 'center' }}>
        <TextComponent style={{ fontSize: 12, color: Colors.Secondary_Color }}>Your Favorite Sports</TextComponent>
        <TouchableOpacity onPress={props.onPressPreference}>
          <ViewHorizontal>
            <IconEdit />
            <TextComponent style={{ fontSize: 12, color: Colors.Secondary_Color, marginLeft: 6 }}>Edit</TextComponent>
          </ViewHorizontal>
        </TouchableOpacity>
      </ViewHorizontal>
      <View style={{ backgroundColor: '#fff' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.borderTop, { marginHorizontal: '2.5%' }]}>
          <ViewContainerScore />
        </ScrollView>
      </View>
    </ViewTrending>
  );
};
export default TrendingComponent;
