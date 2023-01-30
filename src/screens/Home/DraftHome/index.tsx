import { HOME_NAVIGATION, NUMBER_BREAK_PAGE } from '@/constants';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { conversationController } from '@/controllers/conversation.controller';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { useAppDispatch } from '@/stores';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { Conversation } from '@/stores/types/record.type';
import { commonStyles, ContainerStyled } from '@/styles/common';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView } from 'react-native';
import { IState, Props } from './propState';
import { TextMessageStyled, TextTitleStyled } from './styles';
import SkeletonComponent from '@/containers/components/SkeletonComponent';
import { formatConversationDataByTime } from '../func';
import DraftItem from './DraftItem';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';

const DraftHomeStumpComponent = (props: Props) => {
  const dispatch = useAppDispatch();
  const contentContainerStyle = usePaddingBottomFlatlist();

  const [state, setState] = useState<IState>({
    data: [],
    currentPage: 1,
    maxPage: 3,
    isLoading: true,
    loadingMore: false,
  });

  const renderStumpList = ({ item, index }: { item: { header: string; data: Conversation[] }; index: number }) => (
    <>
      <TextTitleStyled marginTop={index ? 20 : 10} style={commonStyles.pd_horizontal_16}>
        {item?.header}
      </TextTitleStyled>
      {item?.data?.map(card => {
        return <DraftItem key={card.id} data={card} navigation={props.navigation} screen={HOME_NAVIGATION.DRAFTHOME} />;
      })}
    </>
  );

  const scheduledStump = React.useMemo(() => {
    let data: {
      header: string;
      data: Conversation[];
    }[] = [];
    if (state.data.length) {
      data = formatConversationDataByTime(state.data) || [];
    }
    return data;
  }, [state.data]);

  const _getConversation = React.useCallback(async (pageNumber: number) => {
    try {
      const res_conversation = await conversationController.getListDraft(pageNumber);
      if (res_conversation.status === 1) {
        setState(preState => ({
          ...preState,
          data: [...preState.data, ...res_conversation.data[1]],
          maxPage: Math.ceil(res_conversation.data[0].count / NUMBER_BREAK_PAGE) || 1,
          isLoading: false,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  useEmitter(
    EDeviceEmitter.DELETE_CONVERSATION,
    (deleteId: number) => {
      setState(preState => ({ ...preState, data: preState.data.filter(draft => draft.id !== deleteId) }));
    },
    [state.data],
  );

  const getPageOne = async () => {
    try {
      const res_conversation = await conversationController.getListDraft(1);
      if (res_conversation.status === 1) {
        const data = [...res_conversation.data[1]];

        setState(preState => ({
          ...preState,
          currentPage: 1,
          data,
          maxPage: Math.ceil(res_conversation.data[0].count / NUMBER_BREAK_PAGE) || 1,
          isLoading: false,
          loadingMore: false,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    _getConversation(state.currentPage);
  }, [state.currentPage]);

  useEffect(() => {
    dispatch(getNumberConversation());
    getPageOne();
  }, [dispatch]);

  const renderFooter = () => <FooterLoadMore loadingMore={state.loadingMore} />;

  const _loadMore = async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  };

  useEmitter(EDeviceEmitter.FETCH_DATA_DRAFT, () => {
    getPageOne();
  });

  if (state.isLoading) {
    return (
      <ContainerStyled style={commonStyles.containerView}>
        <ScrollView style={[commonStyles.containerFlatlist, commonStyles.pd_horizontal_24]}>
          <SkeletonComponent size={Math.ceil(Dimensions.get('window').height / 120)} />
        </ScrollView>
      </ContainerStyled>
    );
  }

  return (
    <ContainerStyled style={commonStyles.containerView}>
      {scheduledStump?.length ? (
        <FlatList
          style={commonStyles.containerFlatlist}
          contentContainerStyle={contentContainerStyle}
          data={scheduledStump}
          extraData={scheduledStump}
          renderItem={renderStumpList}
          onEndReached={_loadMore}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.header}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <TextMessageStyled>You have no drafts.</TextMessageStyled>
      )}
    </ContainerStyled>
  );
};

export default React.memo(DraftHomeStumpComponent);
