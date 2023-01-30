import { IconBin } from '@/assets/icons/Icon';
import { SCHEDULE_MODE } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import DateTimePicker from '@/containers/components/DateTimePicker';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { conversationController } from '@/controllers/conversation.controller';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { Participant, useAppDispatch } from '@/stores';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { sortParticipantByHostHelper } from '@/utils/array';
import { convertTimeToUTC } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { IProps, IState } from './propState';
import {
  CreateTouchStyled,
  DeleteTouchStyled,
  NomarlTextStyled,
  SmallTextStyled,
  TextInputStyled,
  TextTitleStyled,
} from './styles';

const RescheduleHomeComponent = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit, setValue } = useForm<{ message: string }>();

  const [state, setState] = useState<IState>({
    estimateTime: new Date(props.route.params.data.scheduledStart),
    modeDateTime: 'date',
  });

  useEffect(() => {
    setValue('message', props.route.params.data?.message || '');
  }, [props.route.params.data?.message]);

  const _onSubmit = async (data: { message: string }) => {
    try {
      globalLoading(true);
      const res_reschedule = await conversationController.editConversation({
        id: props.route?.params?.data?.id,
        scheduledStart: convertTimeToUTC(state.estimateTime),
        message: data.message,
        scheduleMode: SCHEDULE_MODE.SCHEDULE,
      });
      if (res_reschedule.status === 1) {
        emitter(EDeviceEmitter.UPDATE_RESCHEDULE_SUCCESS, {
          id: props.route?.params?.data?.id,
          scheduledStart: state.estimateTime.toISOString(),
          message: data.message,
        });
        props.navigation.goBack();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

  const _deleteConversation = async () => {
    const result = await conversationController.removeConversation(props.route?.params?.data?.id);
    if (result.status === 1) {
      emitter(EDeviceEmitter.DELETE_CONVERSATION, props.route?.params?.data?.id);
      props.navigation.goBack();
      dispatch(getNumberConversation());
      Toast.show({
        text1: 'Stump',
        text2: `Your stump was deleted.`,
        type: 'success',
      });
    }
  };

  const _onChangeDate = React.useCallback((selectDate: Date, mode?: 'date' | 'time') => {
    setState(preState => ({ ...preState, estimateTime: selectDate, modeDateTime: mode === 'date' ? 'time' : 'date' }));
  }, []);

  const _renderFriend = ({ item }: { item: Participant }) => {
    return (
      <View style={{ alignItems: 'center', marginRight: scale(16), width: scale(80) }}>
        <ImageComponent uri={item.user?.avatar || ''} width={scale(64)} height={scale(64)} borderRadius={scale(64)} />
        <SmallTextStyled numberOfLines={2} color={Colors.blackOriginal}>
          {item.userId ? item.user?.displayName?.split(' ').join('') : item?.inviteValue}
        </SmallTextStyled>
      </View>
    );
  };
  const _keyExtractor = (item: Participant) => item.id.toString();
  return (
    <ContainerStyled style={commonStyles.pd_horizontal_16}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TextTitleStyled>Participants ({props.route?.params?.data?.participants?.length})</TextTitleStyled>

        <FlatList
          data={sortParticipantByHostHelper(props.route?.params?.data?.participants || [])}
          extraData={sortParticipantByHostHelper(props.route?.params?.data?.participants || [])}
          renderItem={_renderFriend}
          keyExtractor={_keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

        <TextTitleStyled>Choose Date & Time</TextTitleStyled>
        <DateTimePicker
          label="Select a date"
          value={state.estimateTime}
          onChangeDate={_onChangeDate}
          mode={state.modeDateTime}
        />

        <TextTitleStyled>Add a message</TextTitleStyled>
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputStyled
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={'Enter your message here…'}
              />
            )}
            name="message"
            defaultValue={''}
          />
        </View>

        <CreateTouchStyled onPress={handleSubmit(_onSubmit)} backgroundColor={Colors.Strong_Blue}>
          <NomarlTextStyled>RE-SCHEDULE</NomarlTextStyled>
        </CreateTouchStyled>
        <DeleteTouchStyled onPress={_deleteConversation}>
          <IconBin fill={Colors.Black} width={scale(18)} height={scale(18)} />
          <NomarlTextStyled color={Colors.Black} marginLeft={8}>
            DELETE
          </NomarlTextStyled>
        </DeleteTouchStyled>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};

export default React.memo(RescheduleHomeComponent);
