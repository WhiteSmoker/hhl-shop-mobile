import { CONVERSATION_STATUS } from '@/constants';
import { useAppSelector } from '@/stores';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { HeaderTitleStyled } from '../styles';
type IProps = {
  title?: string;
  showArrow?: boolean;
  hideRight?: boolean;
  navigation?: any;
  route?: any;
};
const RecordingHeader = (props: IProps) => {
  const { roomDetail } = useAppSelector(state => ({
    roomDetail: state.recordState.roomDetail,
  }));

  const RenderTitle = () => {
    if (
      roomDetail?.status === CONVERSATION_STATUS.SCHEDULED ||
      roomDetail?.status === CONVERSATION_STATUS.RESCHEDULED
    ) {
      return 'CONNECTED';
    }

    if (roomDetail?.status === CONVERSATION_STATUS.RECORDING) {
      return 'RECORDING';
    }

    if (roomDetail?.status === CONVERSATION_STATUS.PAUSED) {
      return 'PAUSED';
    }
    if (roomDetail?.status === CONVERSATION_STATUS.STARTING) {
      return 'STARTING';
    }
    if (roomDetail?.status === CONVERSATION_STATUS.UPLOADING) {
      return 'UPLOADING';
    }
    if (roomDetail?.status === CONVERSATION_STATUS.RESUMING) {
      return 'RESUMING';
    }

    return '';
  };

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              roomDetail?.status === CONVERSATION_STATUS.RECORDING ? Colors.Vivid_red : Colors.Background,
          },
        ]}>
        <View style={styles.itemHeader2} />

        <View style={styles.itemHeader}>
          <HeaderTitleStyled>{RenderTitle()}</HeaderTitleStyled>
        </View>
        <View style={[styles.itemHeader1]} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(90),
    backgroundColor: Colors.Background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
  itemHeader: {
    flex: 2,
    height: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeader2: {
    flex: 1,
    height: scale(90),
    justifyContent: 'center',
    // alignItems: 'center',
  },
  itemHeader1: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default React.memo(RecordingHeader);
