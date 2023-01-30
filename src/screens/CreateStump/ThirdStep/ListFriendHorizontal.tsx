import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import unionBy from 'lodash/unionBy';
import styles, { SmallTextStyled } from './styles';
import { IUserInfo } from '@/stores';
import { useGetMyId } from '@/hooks/useGetMyId';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { userController } from '@/controllers/user.controller';
import { IconTickCircle } from '@/assets/icons/Icon';

interface IProps {
  usersChecked: IUserInfo[];
  pressItem: (user: IUserInfo) => void;
}

export const ListFriendHorizontal = React.memo(({ usersChecked, pressItem }: IProps) => {
  const [allFriend, setAllFriend] = useState<IUserInfo[]>([]);

  useEffect(() => {
    const getFriend = async () => {
      const res_friend = await userController.getAllFriends();
      if (res_friend.status === 1) {
        setAllFriend(res_friend.data);
      }
    };
    getFriend();
  }, []);

  const myId = useGetMyId();

  const press = React.useCallback(
    (item: IUserInfo) => () => {
      pressItem(item);
    },
    [pressItem],
  );

  const renderFriend = React.useCallback(
    ({ item }: { item: IUserInfo }) => {
      return (
        <TouchableOpacity
          onPress={press(item)}
          activeOpacity={1}
          style={{ alignItems: 'center', marginHorizontal: scale(8), width: scale(80) }}>
          {usersChecked.map(e => e.id).includes(item.id) ? (
            <View style={styles.absolute}>
              <IconTickCircle fill="white" />
            </View>
          ) : null}
          <ImageComponent uri={item.avatar} width={scale(64)} height={scale(64)} borderRadius={scale(64)} />
          <SmallTextStyled numberOfLines={2} color={item.checked ? Colors.Background2 : Colors.blackOriginal}>
            {item?.displayName}
          </SmallTextStyled>
        </TouchableOpacity>
      );
    },
    [press, usersChecked],
  );

  const keyExtractor = React.useCallback((item: IUserInfo) => item.id.toString(), []);

  const memoData = React.useMemo(
    () =>
      unionBy(
        [...usersChecked, ...(allFriend ?? [])].filter(user => user.id !== myId),
        'id',
      ),
    [allFriend, myId, usersChecked],
  );

  return (
    <FlatList
      data={memoData}
      extraData={memoData}
      renderItem={renderFriend}
      keyExtractor={keyExtractor}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
});
