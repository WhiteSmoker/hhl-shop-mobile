import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NameStyled, styles, ViewParticipantStyled, ViewStatusStyled, WrapViewStyled } from './styles';
import { Participant } from '@/stores';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { useAuth } from '@/hooks/useAuth';
import { navigationRef } from '@/navigators/refs';
import { APP_NAVIGATION, PROFILE_NAVIGATION, RECORD_MODE, RECORD_NAVIGATION } from '@/constants';
import { indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
type IProps = {
  data: Participant[];
  mode: number;
  myId: number;
  hostId: number;
};
const RenderParticipant = (props: IProps) => {
  const { isBlockMe } = useUserBlockMe();
  const userInfo = useAuth();
  const [width, setWidth] = useState(88);
  useEffect(() => {
    if (props.data.length === 1) {
      setWidth(196);
    } else {
      setWidth(88);
    }
  }, [props.data.length]);

  const goToProfile = (userId?: number) => () => {
    if (!userId) {
      return;
    }
    isBlockMe(userId);
    if (userId === userInfo?.id) {
      navigationRef.current?.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
        initial: false,
      });
      return;
    }

    navigationRef.current?.navigate(APP_NAVIGATION.PROFILE, {
      screen: PROFILE_NAVIGATION.VIEW_PROFILE,
      initial: false,
      params: { userId, screen: RECORD_NAVIGATION.RECORDING },
    });
  };

  const paddingStyle = (i: number) => {
    switch (i) {
      case 0:
        return {
          marginBottom: scale(20),
        };
      case 1:
        return {
          marginLeft: scale(40),
          marginBottom: scale(20),
        };
      case 3:
        return {
          marginLeft: scale(40),
        };
      default:
        return {};
    }
  };

  const wrapStyle: any = useMemo(
    () => (props.mode === RECORD_MODE.SOLO ? { justifyContent: 'center', alignItems: 'center' } : {}),
    [props.mode],
  );

  return (
    <WrapViewStyled style={wrapStyle}>
      {props.data?.length > 0
        ? props.data?.map((participant, index) => {
            return (
              <ViewParticipantStyled key={participant.id} style={{ ...paddingStyle(index) }}>
                <TouchableOpacity onPress={goToProfile(participant.userId)}>
                  <ViewIndicateHost width={scale(width)}>
                    <ImageComponent
                      uri={participant?.user?.avatar || ''}
                      width={scale(width)}
                      height={scale(width)}
                      borderRadius={scale(width)}
                    />

                    {participant.isHost && <View style={indicateHostStyle} />}
                  </ViewIndicateHost>
                </TouchableOpacity>
                <ViewStatusStyled>
                  {participant.user ? (
                    <NameStyled
                      numberOfLines={1}
                      width={props.mode === RECORD_MODE.SOLO ? 173 : 73}
                      color={participant?.online ? Colors.Background2 : Colors.Light_Gray}>
                      {participant?.user?.displayName}
                    </NameStyled>
                  ) : (
                    <NameStyled
                      numberOfLines={1}
                      width={props.mode === RECORD_MODE.SOLO ? 173 : 73}
                      color={participant?.online ? Colors.Background2 : Colors.Light_Gray}>
                      {props.myId === props.hostId ? participant?.inviteValue : `Guest ${index + 1}`}
                    </NameStyled>
                  )}
                  {participant?.online ? <View style={styles.tickOnline} /> : null}
                </ViewStatusStyled>
              </ViewParticipantStyled>
            );
          })
        : null}
      {props.mode === RECORD_MODE.FRIENDS && props.data?.length === 2 ? (
        <View style={{ width: scale(width), height: scale(width) }} />
      ) : null}
    </WrapViewStyled>
  );
};

export default React.memo(RenderParticipant);
