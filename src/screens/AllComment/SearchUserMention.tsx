import { ImageComponent } from '@/containers/components/ImageComponent';
import { TextComponent } from '@/containers/components/TextComponent';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { IUserInfo } from '@/stores';
import { ISearchUserMentionProps } from '@/stores/types/comment.type';
import { Colors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';

export const SearchUserMention = React.memo(
  ({ data, onSelectUser, aniAppearView, searching }: ISearchUserMentionProps) => {
    const memoizedContentContainerStyle = usePaddingBottomFlatlist();

    const keyExtractor = React.useMemo(() => (item: IUserInfo) => item.id.toString(), []);

    const select = React.useCallback(
      (user: IUserInfo) => () => {
        onSelectUser(user);
      },
      [onSelectUser],
    );

    const renderItem = React.useMemo(
      () =>
        ({ item, index }: any) => {
          return (
            <>
              <TouchableOpacity activeOpacity={0.5} style={styles.viewFriendVertical} onPress={select(item)}>
                <View style={styles.marginAvt}>
                  <ImageComponent
                    uri={item.avatar || ''}
                    width={scale(48)}
                    height={scale(48)}
                    borderRadius={scale(48)}
                  />
                </View>
                <View>
                  <TextComponent style={styles.displayNameText}>{item.displayName || ''}</TextComponent>
                  <TextComponent style={styles.fullNameText}>{item.firstName + '  ' + item.lastName}</TextComponent>
                </View>
              </TouchableOpacity>
            </>
          );
        },
      [select],
    );
    const memoizedData = React.useMemo(() => data, [data]);

    const translateY = aniAppearView.interpolate({
      inputRange: [0, 10],
      outputRange: [Dimensions.get('window').height, 0],
    });
    const opacity = aniAppearView.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 1],
    });

    return (
      <Animated.View style={[styles.container, { transform: [{ translateY }] }, { opacity }]}>
        {searching ? (
          <View style={styles.viewSearching}>
            <ActivityIndicator size={scale(16)} color={Colors.Gray} />
            <TextComponent style={styles.textSearching}>{searching}</TextComponent>
          </View>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={memoizedData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={memoizedContentContainerStyle}
          />
        )}
      </Animated.View>
    );
  },
);

SearchUserMention.displayName = 'SearchUserMention';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    top: scale(90),
    left: 0,
    right: 0,
    bottom: scale(65),
  },
  viewSearching: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(10),
    width: '90%',
  },
  textSearching: {
    color: Colors.Gray,
    fontSize: scale(13),
    marginLeft: scale(10),
  },
  viewFriendVertical: {
    alignItems: 'center',
    paddingVertical: scale(12),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_Gray,
  },
  marginAvt: {
    marginHorizontal: scale(18),
  },
  avt: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48),
  },
  displayNameText: {
    fontFamily: 'Lexend-Bold',
    fontSize: scale(13),
    color: 'black',
  },
  fullNameText: {
    fontFamily: 'Lexend-Medium',
    fontSize: scale(11),
    color: Colors.Gray,
  },
});
