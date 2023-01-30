import { IPost } from '@/stores/types/discovery.type';
import { Colors } from '@/theme/colors';
import React from 'react';

import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';
import { ViewContainerPostCard } from '../TrendingComponent/styles';

const width = Dimensions.get('window').width;

interface ICarouselComponentProps {
  onPressPost: (post: IPost) => void;
  listEvent: IPost[];
  duration?: number;
  height?: number;
}

const CarouselComponent: React.FC<ICarouselComponentProps> = React.memo(
  ({ listEvent, onPressPost, duration = 5000 }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollRef = React.useRef<ScrollView>(null);
    const intervalRef = React.useRef<any>(false);

    React.useEffect(() => {
      intervalRef.current = setInterval(() => {
        setSelectedIndex(prev => (prev === listEvent?.length - 1 ? 0 : prev + 1));
      }, duration);

      return () => {
        clearInterval(intervalRef.current);
      };
    }, [duration, listEvent?.length]);

    React.useEffect(() => {
      scrollRef.current?.scrollTo({
        animated: true,
        y: 0,
        x: width * selectedIndex,
      });
    }, [selectedIndex]);

    const onMomentumScrollEnd = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const viewSize = nativeEvent.layoutMeasurement.width;
      const contentOffset = nativeEvent.contentOffset.x;
      const selectedIndex1 = Math.floor(contentOffset / viewSize);
      setSelectedIndex(selectedIndex1);
    };

    return (
      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          bounces
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.container}>
          {listEvent.map((event, index) => (
            <View key={index.toString()} style={styles.imageCarousel}>
              <TouchableOpacity onPress={() => onPressPost(event)}>
                <ViewContainerPostCard>
                  <View style={styles.content}>
                    <TextComponent style={styles.titlePost} numberOfLines={3}>
                      {event.title}
                    </TextComponent>
                    <TextComponent style={styles.descriptionPost} numberOfLines={1}>
                      {event.author}
                    </TextComponent>
                    <View style={styles.viewNumber}>
                      <TextComponent style={{ color: '#fff' }}>{event.countStump || 0}</TextComponent>
                    </View>
                  </View>
                  <FastImage
                    style={styles.imgPostTrending}
                    source={{
                      uri: event.avatarUrl,
                    }}
                  />
                </ViewContainerPostCard>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  },
);

CarouselComponent.displayName = 'CarouselComponent';

export default CarouselComponent;

const styles = StyleSheet.create({
  container: {
    width: width,
  },
  imageCarousel: {
    width: width,
    height: scale(163),
    marginBottom: scale(10),
  },
  circleDiv: {
    position: 'absolute',
    bottom: 8,
    height: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'red',
  },

  imgPostTrending: {
    width: 131,
    height: 131,
    borderRadius: scale(6),
    marginLeft: scale(12),
  },
  titlePost: {
    fontSize: scale(16),
    fontFamily: 'Lexend-Bold',
    color: Colors.Secondary_Color,
    marginBottom: scale(6),
  },
  descriptionPost: {
    fontSize: scale(12),
    lineHeight: scale(18),
    maxWidth: '100%',
    width: '100%',
    color: Colors.Body_3,
    marginBottom: scale(6),
  },
  content: {
    flex: 1,
    marginRight: scale(6),
  },
  viewNumber: {
    borderRadius: 100,
    width: 36,
    height: 36,
    backgroundColor: Colors.Background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  time: {
    fontSize: 10,
    color: Colors.Body_3,
    textAlign: 'right',
    marginBottom: scale(6),
  },
  scoreItem: {
    borderRightColor: Colors.Light_grey5,
    borderRightWidth: 1,
    borderStyle: 'solid',
    flex: 1,
    paddingStart: scale(10),
    paddingEnd: scale(16),
  },
  scoreItemLast: {
    borderRightWidth: 0,
  },
  scoreName: {
    fontSize: 12,
    color: Colors.blackOriginal,
  },
  borderTop: {
    borderTopColor: Colors.Light_grey6,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
});
