import { CONVERSATION_STATUS, HOME_NAVIGATION, NUMBER_BREAK_PAGE } from '@/constants';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import SkeletonComponent from '@/containers/components/SkeletonComponent';
import { conversationController } from '@/controllers/conversation.controller';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { FieldSchedule, UrlSchedule } from '@/stores';
import { Conversation } from '@/stores/types/record.type';
import { commonStyles, ContainerStyled } from '@/styles/common';
import unionBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { formatConversationDataByTime } from '../func';
import ScheduleCardComponent from './ScheduleCardComponent';
import ScheduleGreyCardComponent from './ScheduleGreyCardComponent';
import { TextMessageStyled, TextTitleStyled } from './styles';

interface Props {
  navigation: any;
  contentContainerStyle: StyleProp<ViewStyle>;
  field: FieldSchedule;
  url: UrlSchedule;
}
export interface IState {
  currentPage: number;
  maxPage: number;
  data: Conversation[];
  loadingMore: boolean;
  refreshing: boolean;
  lazyLoading: boolean;
}

const CommonTabSchedule = (props: Props) => {
  const [state, setState] = useState<IState>({
    currentPage: 1,
    maxPage: 1,
    data: [],
    loadingMore: false,
    refreshing: false,
    lazyLoading: true,
  });

  const formattedData = useMemo(() => {
    return formatConversationDataByTime(unionBy(state.data, 'id'));
  }, [state.data]);

  useEffect(() => {
    if (state.currentPage === 1) {
      _getPageOne();
    } else {
      _getMoreData(state.currentPage);
    }
  }, [state.currentPage]);

  const _getPageOne = async () => {
    const res_conversation = await conversationController.getListSchedule(props.url, 1);
    setState(preState => ({
      ...preState,
      loadingMore: false,
      refreshing: false,
      lazyLoading: false,
      data: res_conversation.data[1] || [],
      maxPage: Math.ceil(res_conversation.data[0].count / NUMBER_BREAK_PAGE) || 1,
    }));
  };

  const _getMoreData = async (pageNumber: number) => {
    try {
      const res_conversation = await conversationController.getListSchedule(props.url, pageNumber);
      setState(preState => ({
        ...preState,
        loadingMore: false,
        refreshing: false,
        data: [...preState.data, ...(res_conversation.data[1] || [])],
        maxPage: Math.ceil(res_conversation.data[0].count / NUMBER_BREAK_PAGE) || 1,
      }));
    } catch (error) {
      //
    }
  };

  const RenderItem = ({ item, index }: { item: { header: string; data: Conversation[] }; index: number }) => (
    <>
      <TextTitleStyled marginTop={index ? 20 : 10} style={commonStyles.pd_horizontal_16}>
        {item?.header}
      </TextTitleStyled>
      {item?.data?.map(card => {
        return card.status === CONVERSATION_STATUS.FINISHED || card.status === CONVERSATION_STATUS.PUBLISHED ? (
          <ScheduleGreyCardComponent
            key={card.id}
            data={card}
            navigation={props.navigation}
            screen={HOME_NAVIGATION.SCHEDULEDHOME}
            field={props.field}
          />
        ) : (
          <ScheduleCardComponent
            key={card.id}
            data={card}
            navigation={props.navigation}
            screen={HOME_NAVIGATION.SCHEDULEDHOME}
            field={props.field}
          />
        );
      })}
    </>
  );

  const _loadMore = async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  };

  const _onRefresh = () => {
    if (state.currentPage === 1) {
      _getPageOne();
    } else {
      setState(preState => ({ ...preState, refreshing: true, currentPage: 1 }));
    }
  };

  const _keyExtractor = (item: { header: string; data: Conversation[] }) => item.header;
  const renderFooter = () => <FooterLoadMore loadingMore={state.loadingMore} />;

  useEmitter(EDeviceEmitter.FETCH_DATA_SCHEDULE, () => {
    _getPageOne();
  });

  useEmitter(
    EDeviceEmitter.UPDATE_RESCHEDULE_SUCCESS,
    (params: { id: number; message: string; scheduledStart: string }) => {
      if (props.field === 'schedule') {
        setState(preState => ({
          ...preState,
          data: preState.data.map(schedule => {
            if (schedule.id === params.id) {
              return { ...schedule, message: params.message, scheduledStart: params.scheduledStart };
            }
            return schedule;
          }),
        }));
      }
    },
    [props.field],
  );

  useEmitter(
    EDeviceEmitter.DELETE_CONVERSATION,
    (deleteId: number) => {
      setState(preState => ({ ...preState, data: preState.data.filter(schedule => schedule.id !== deleteId) }));
    },
    [state.data],
  );

  if (state.lazyLoading) {
    return (
      <ScrollView style={[commonStyles.containerFlatlist, commonStyles.pd_horizontal_24]}>
        <SkeletonComponent size={Math.ceil(Dimensions.get('window').height / 120)} />
      </ScrollView>
    );
  }

  return (
    <ContainerStyled style={commonStyles.containerView}>
      {formattedData?.length ? (
        <FlatList
          style={commonStyles.containerFlatlist}
          contentContainerStyle={props.contentContainerStyle}
          data={formattedData}
          extraData={formattedData}
          renderItem={RenderItem}
          onEndReached={_loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={_onRefresh} />}
          keyExtractor={_keyExtractor}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <TextMessageStyled>
          {props.field === 'schedule' && 'You have not created any scheduled stumps.'}
          {props.field === 'scheduleParticipatedIn' && 'You have not accepted any stumps yet.'}
        </TextMessageStyled>
      )}
    </ContainerStyled>
  );
};
export default React.memo(CommonTabSchedule);
