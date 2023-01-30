import React from 'react';
import { Animated, FlatList, TouchableOpacity, View } from 'react-native';
import styles, { SmallTextStyled, TextMessageStyled, TextStyled } from './styles';
import { commonStyles } from '@/styles/common';
import unionBy from 'lodash/unionBy';
import { IUserInfo } from '@/stores';
import { Colors } from '@/theme/colors';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { scale } from 'react-native-size-scaling';
import { IconTickCircle } from '@/assets/icons/Icon';
interface IProps {
  heightSearch: number;
  heightKeyboard: number;
  usersChecked: IUserInfo[];
  filterList?: IUserInfo[];
  userSystem?: IUserInfo[];
  translateY: Animated.Value;
  pressItem: (user: IUserInfo) => void;
  collapse: () => void;
  loadMore: () => void;
  loadMoreUserSystem: () => void;
}
export const ListFriendVertical = React.memo(
  ({
    usersChecked,
    filterList,
    userSystem,
    heightSearch,
    translateY,
    pressItem,
    collapse,
    loadMore,
    loadMoreUserSystem,
    heightKeyboard,
  }: IProps) => {
    const memoData = React.useMemo(() => unionBy(filterList || userSystem, 'id'), [filterList, userSystem]);
    const ListEmptyComponent = React.useMemo(
      () => (
        <View style={styles.viewNoFriend}>
          {filterList && !filterList.length ? (
            <TextMessageStyled>No results found.</TextMessageStyled>
          ) : (
            <TextMessageStyled />
          )}
        </View>
      ),
      [filterList],
    );

    const keyExtractor = React.useCallback((item: IUserInfo) => item.id.toString(), []);

    const viewContainerStyle = React.useMemo(
      () => ({
        padding: scale(16),
        transform: [{ translateY }],
        position: 'absolute',
        top: heightSearch,
        backgroundColor: Colors.Very_Light_Gray,
        zIndex: 1,
        // elevation: 10,
        height: '95%',
        width: '100%',
      }),
      [heightSearch, translateY],
    );

    const press = React.useCallback(
      (item: IUserInfo) => () => {
        pressItem(item);
      },
      [pressItem],
    );
    const _collapse = React.useCallback(() => {
      collapse();
    }, [collapse]);

    const renderFriendVertical = React.useCallback(
      ({ item, index }: { item: IUserInfo; index: number }) => {
        return (
          <>
            <TouchableOpacity onPress={press(item)} activeOpacity={0.5} style={styles.viewFriendVertical}>
              {usersChecked?.map(e => e.id).includes(item.id) ? (
                <View style={styles.absolute}>
                  <IconTickCircle fill="white" />
                </View>
              ) : null}

              <ImageComponent uri={item.avatar || ''} width={scale(64)} height={scale(64)} borderRadius={scale(64)} />

              <SmallTextStyled
                numberOfLines={1}
                marginLeft={15}
                color={item.checked ? Colors.Background2 : Colors.blackOriginal}>
                {item?.displayName}
              </SmallTextStyled>
            </TouchableOpacity>
            {index + 1 === filterList?.length && <View style={{ height: scale(50) }} />}
          </>
        );
      },
      [filterList?.length, press, usersChecked],
    );

    const onEndReached = React.useCallback(() => {
      if (filterList) {
        loadMore();
      } else {
        loadMoreUserSystem();
      }
    }, [filterList, loadMore, loadMoreUserSystem]);

    return (
      <Animated.View style={viewContainerStyle as any}>
        <TouchableOpacity style={[commonStyles.flexRow, commonStyles.selfEnd]} onPress={_collapse}>
          <TextStyled color={Colors.Light_Blue}>Done</TextStyled>
        </TouchableOpacity>
        <FlatList
          data={memoData}
          renderItem={renderFriendVertical}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: heightKeyboard }}
          ListEmptyComponent={ListEmptyComponent}
        />
      </Animated.View>
    );
  },
);
