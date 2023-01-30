import { ROOT_ROUTES } from '@/constants';
import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { RouteProp, useIsFocused } from '@react-navigation/native';

import React, { useEffect } from 'react';
import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { RootStackParam } from '@/navigators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { commonSlice } from '@/stores/reducers';
interface IProps {
  navigation: NativeStackNavigationProp<RootStackParam, ROOT_ROUTES.MEDIA>;
  route: RouteProp<RootStackParam, ROOT_ROUTES.MEDIA>;
}
export const PlayMedia = React.memo(({ navigation, route }: IProps) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(commonSlice.actions.setTabActive(ROOT_ROUTES.MEDIA));
    }
  }, [isFocused]);
  const aniLoading = React.useRef(new Animated.Value(0)).current;
  const onLoad = React.useCallback(() => {
    Animated.timing(aniLoading, {
      useNativeDriver: true,
      toValue: 1,
      duration: 100,
    }).start();
  }, [aniLoading]);

  const onError = (err: any) => {
    console.log(err);
  };

  const uri = React.useMemo(() => route.params?.uri, [route.params?.uri]);
  const mimeType = React.useMemo(() => route.params?.mimeType, [route.params?.mimeType]);
  const RenderImage = React.useMemo(
    () => <FastImage source={{ uri }} style={styles.fullDim} onLoad={onLoad} />,
    [uri, onLoad],
  );

  const opacity = aniLoading.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const scaleXY = aniLoading.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const RenderVideo = React.useMemo(
    () => (
      <>
        <Animated.View
          style={{
            position: 'absolute',
            flex: 1,
            zIndex: 2,
            top: '45%',
            left: '45%',
            transform: [{ scale: scaleXY }],
            opacity,
          }}>
          <ActivityIndicator size={scale(30)} color={Colors.Very_Light_Gray} />
        </Animated.View>
        <Video
          source={{ uri }}
          rate={1}
          volume={0.3}
          paused={false}
          style={styles.fullDim}
          repeat={true}
          controls={true}
          resizeMode={'contain'}
          onLoad={onLoad}
          onError={onError}
        />
      </>
    ),
    [scaleXY, opacity, uri, onLoad],
  );

  const goBack = React.useCallback(() => {
    navigation.setParams({ uri: '' });
    navigation.goBack();
  }, [navigation]);

  return uri ? (
    <SafeAreaView style={styles.container}>
      <View style={commonStyles.flex_1}>
        <TouchableOpacity style={styles.containerClose} onPress={goBack}>
          <Icon name="close-outline" size={scale(30)} color={Colors.Very_Light_Gray} />
        </TouchableOpacity>
        {mimeType === 'image' ? RenderImage : RenderVideo}
      </View>
    </SafeAreaView>
  ) : null;
});
PlayMedia.displayName = 'Media/PlayMedia';

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.dark, flex: 1, paddingTop: scale(40) },
  containerClose: { position: 'absolute', top: 0, left: scale(6), zIndex: 2 },
  fullDim: { width: '100%', height: '100%' },
});
