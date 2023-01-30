import { IconStumpFriend, IconStumpSolo } from '@/assets/icons/Icon';
import { RECORD_MODE, RECORD_NAVIGATION, SCHEDULE_MODE } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { conversationController } from '@/controllers/conversation.controller';
import { useAuth } from '@/hooks/useAuth';
import { recordSlice } from '@/stores/reducers';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { requestMicroPermission } from '@/utils/permission';
import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import { IProps } from './propState';
import { TextContentStyled, ViewIconStyled, ViewWrapStyled } from './styles';

const FirstStep = (props: IProps) => {
  const dispatch = useDispatch();
  const userInfo = useAuth();

  console.log('route', props.route);

  const _navigate = (recordMode: number) => async () => {
    dispatch(recordSlice.actions.setConfig({ recordMode }));
    if (recordMode === RECORD_MODE.SOLO) {
      try {
        globalLoading(true);
        const host = [
          {
            inviteCode: null,
            inviteValue: userInfo?.email,
            inviteMethod: null,
            userId: userInfo?.id,
            isHost: 1,
          },
        ];
        const res_create = await conversationController.addConversation({
          hostId: userInfo?.id,
          mode: recordMode,
          scheduleMode: SCHEDULE_MODE.NOW,
          scheduledStart: new Date(),
          message: `${userInfo?.displayName} mode solo`,
          status: 1,
          participant: [...host],
        });
        if (res_create.status === 1) {
          const permission = await requestMicroPermission();
          if (!permission) {
            return;
          }
          const res_get_detail = await conversationController.getDetailConversation(res_create.data.id);
          if (res_get_detail.status === 1) {
            dispatch(
              recordSlice.actions.setConfig({
                role: 'host',
                roomDetail: res_get_detail.data[0],
                participantToEmit: res_get_detail.data[0].participants,
                stoped: false,
                start_time: 0,
                duration: res_get_detail.data[0]?.duration || 0,
                postId: props.route.params?.postId,
                matchId: props.route.params?.matchId,
                sportId: props.route.params?.sportId,
                leagueId: props.route.params?.leagueId,
                teamId: props.route.params?.teamId,
                marketId: props.route.params?.marketId,
              }),
            );
            props.navigation.push(RECORD_NAVIGATION.RECORDING, {
              conversationId: res_get_detail.data[0].id.toString(),
            });
          }
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    } else {
      props.navigation.push(RECORD_NAVIGATION.SECOND_STEP, {
        postId: props.route.params?.postId,
        matchId: props.route.params?.matchId,
        sportId: props.route.params?.sportId,
        leagueId: props.route.params?.leagueId,
        teamId: props.route.params?.teamId,
        marketId: props.route.params?.marketId,
      });
    }
  };

  return (
    <ContainerStyled>
      <ViewWrapStyled>
        <View style={commonStyles.containerView}>
          <ViewIconStyled onPress={_navigate(RECORD_MODE.SOLO)}>
            <IconStumpSolo />
          </ViewIconStyled>
          <TextContentStyled>STUMP SOLO</TextContentStyled>
        </View>
        <View style={[commonStyles.containerView, { marginTop: scale(105) }]}>
          <ViewIconStyled onPress={_navigate(RECORD_MODE.FRIENDS)} backgroundColor={Colors.Background3}>
            <IconStumpFriend />
          </ViewIconStyled>
          <TextContentStyled>STUMP W/ FRIENDS</TextContentStyled>
        </View>
      </ViewWrapStyled>
    </ContainerStyled>
  );
};

export default React.memo(FirstStep);
