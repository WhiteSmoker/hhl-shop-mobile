import { useAuth } from '@/hooks/useAuth';
import { IUserInfo } from '@/stores';
import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { ImageComponent } from '../ImageComponent/index';
interface ICardUserFollowProps {
  item: IUserInfo;
  myId: number;
  clickAvatar: (id: number) => void;
  clickFollow?: (followId: number, follow: boolean) => void;
  clickBlock?: (userId: number) => void;
  listFollowing?: IUserInfo[];
  listBlock?: IUserInfo[];
  mode?: 'block' | 'follow';
}
export const CardUserFollow = React.memo(
  ({
    item,
    clickAvatar,
    clickFollow,
    clickBlock,
    myId,
    listFollowing = [],
    listBlock = [],
    mode = 'follow',
  }: ICardUserFollowProps) => {
    const myInfo = useAuth();
    const onPress = React.useCallback(() => {
      clickAvatar(item?.id);
    }, [clickAvatar, item]);

    const onFollow = React.useCallback(() => {
      if (clickFollow) {
        clickFollow(item?.id, item?.isFollow);
      }
    }, [clickFollow, item]);

    const onBlock = React.useCallback(() => {
      if (clickBlock) {
        clickBlock(item?.id);
      }
    }, [clickBlock, item]);

    const isBlockThisUser = React.useMemo(
      () => !!myInfo?.blocks?.filter(user => user.id === item.id).length,
      [myInfo, item.id],
    );

    const RenderButtonFollow = React.useMemo(() => {
      if (isBlockThisUser || item?.id === myId) {
        return null;
      }
      if (listFollowing?.filter(user => user.id === item?.id).length) {
        return (
          <TouchableOpacity style={[commonStyles.flex_1, styles.btnFollower]} onPress={onFollow}>
            <SmallTextStyled numberOfLines={1}>Unfollow</SmallTextStyled>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={[commonStyles.flex_1, styles.btnFollowing]} onPress={onFollow}>
            <SmallTextStyled numberOfLines={1} color={Colors.White}>
              Follow
            </SmallTextStyled>
          </TouchableOpacity>
        );
      }
    }, [isBlockThisUser, item?.id, listFollowing, myId, onFollow]);

    const RenderButtonBlock = React.useMemo(() => {
      if (listBlock?.filter(user => user.id === item?.id).length) {
        return (
          <TouchableOpacity style={[commonStyles.flex_1, styles.btnFollower]} onPress={onBlock}>
            <SmallTextStyled numberOfLines={1}>Unblock</SmallTextStyled>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={[commonStyles.flex_1, styles.btnFollowing]} onPress={onBlock}>
            <SmallTextStyled numberOfLines={1} color={Colors.White}>
              Block
            </SmallTextStyled>
          </TouchableOpacity>
        );
      }
    }, [item?.id, listBlock, onBlock]);

    return (
      <View style={[commonStyles.flex_1, styles.viewFriendVertical]}>
        <TouchableOpacity style={styles.viewFlex3} activeOpacity={0.8} onPress={onPress}>
          <View style={commonStyles.mg_right_16}>
            <ImageComponent uri={item.avatar || ''} width={scale(64)} height={scale(64)} borderRadius={scale(64)} />
          </View>
          <SmallTextStyled numberOfLines={1}>{item?.displayName}</SmallTextStyled>
        </TouchableOpacity>
        {mode === 'follow' && RenderButtonFollow}
        {mode === 'block' && RenderButtonBlock}
      </View>
    );
  },
);
CardUserFollow.displayName = 'CardUserFollow';
const styles = StyleSheet.create({
  viewFriendVertical: {
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_Gray,
  },
  viewFlex3: {
    alignItems: 'center',
    flex: 3,
    flexDirection: 'row',
  },
  btnFollowing: {
    borderWidth: scale(1),
    borderColor: Colors.Background3,
    borderRadius: scale(6),
    marginLeft: scale(6),
    backgroundColor: Colors.Background3,
  },
  btnFollower: {
    borderWidth: scale(1),
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
    borderRadius: scale(6),
    marginLeft: scale(6),
  },
});

type StyleProps = {
  color?: string;
};

const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.dark};
  font-size: ${scale(14)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  padding-vertical: ${scale(5)}px;
  text-align: center;
`;
