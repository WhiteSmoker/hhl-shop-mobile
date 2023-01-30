import { IconEdit } from '@/assets/icons/Icon';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles, ViewContainerScore, ViewHorizontal, ViewTrending } from './styles';
import CarouselComponent from '../CarouselComponent';
import moment from 'moment';
import { IMatch, IPost } from '@/stores/types/discovery.type';
import { TextComponent } from '../TextComponent';

interface ITrendingComponentProps {
  onPressPreference?: () => void;
  onPressPost: (post: IPost) => void;
  onPressMathches: (match: IMatch) => void;
  listEvent: IPost[];
  listMatch: IMatch[];
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
        <CarouselComponent listEvent={props.listEvent} onPressPost={post => props.onPressPost(post)} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.borderTop, { marginHorizontal: '2.5%' }]}>
          <ViewContainerScore>
            {props.listMatch?.map((match, index: number) => (
              <View style={styles.scoreItem} key={index.toString()}>
                <TouchableOpacity onPress={() => props.onPressMathches(match)}>
                  <TextComponent style={styles.time}>{moment(new Date(match.date)).format('hh:mm a')}</TextComponent>
                  <ViewHorizontal>
                    <ViewHorizontal>
                      <Image style={styles.teamIcon} source={{ uri: match.homeLogo }} />
                      <TextComponent style={styles.scoreName}>
                        {match.homeNickname ? match.homeNickname : match.home?.split(' ').pop()}
                      </TextComponent>
                    </ViewHorizontal>
                    <TextComponent style={styles.scoreNumber}>{match.scoreHome ? match.scoreHome : 0}</TextComponent>
                  </ViewHorizontal>
                  <ViewHorizontal>
                    <ViewHorizontal>
                      <Image style={styles.teamIcon} source={{ uri: match.awayLogo }} />
                      <TextComponent style={styles.scoreName}>
                        {match.awayNickname ? match.awayNickname : match.away?.split(' ').pop()}
                      </TextComponent>
                    </ViewHorizontal>
                    <TextComponent style={styles.scoreNumber}>{match.scoreAway ? match.scoreAway : 0}</TextComponent>
                  </ViewHorizontal>
                </TouchableOpacity>
              </View>
            ))}
          </ViewContainerScore>
        </ScrollView>
      </View>
    </ViewTrending>
  );
};
export default TrendingComponent;
