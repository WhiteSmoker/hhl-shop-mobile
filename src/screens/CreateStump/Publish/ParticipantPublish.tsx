import { ImageComponent } from '@/containers/components/ImageComponent';
import { TextComponent } from '@/containers/components/TextComponent';
import { conversationController } from '@/controllers/conversation.controller';
import { Participant } from '@/stores';
import { commonStyles, indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { sortParticipantByHostHelper } from '@/utils/array';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { ViewParticipantStyled } from './styles';
type Props = {
  conversationId: number;
};
const ParticipantPublish = (props: Props) => {
  const [data, setData] = useState<Participant[]>([]);
  useEffect(() => {
    if (props.conversationId) {
      getParticipant();
    }
  }, [props.conversationId]);

  const getParticipant = async () => {
    const res_get_detail = await conversationController.getDetailConversation(props.conversationId);
    if (res_get_detail.status === 1) {
      setData(res_get_detail.data[0].participants.filter(p => !!p.active && !!p.isAccepted) || []);
    }
  };

  return (
    <ViewParticipantStyled>
      {data && data.length > 0
        ? sortParticipantByHostHelper(data || []).map(participant => {
            return (
              <View key={participant.id} style={[commonStyles.pd_right_6, styles.participantView]}>
                <ViewIndicateHost width={scale(60)}>
                  <ImageComponent
                    uri={participant.user?.avatar || ''}
                    width={scale(60)}
                    height={scale(60)}
                    borderRadius={scale(60)}
                    style={styles.marginImage}
                  />
                  {participant.isHost && <View style={indicateHostStyle} />}
                </ViewIndicateHost>
                <TextComponent style={styles.participantTextName} numberOfLines={1}>
                  {participant.userId ? participant.user?.displayName : participant.inviteValue?.split('@')[0]}
                </TextComponent>
              </View>
            );
          })
        : null}
    </ViewParticipantStyled>
  );
};

const styles = StyleSheet.create({
  participantView: { justifyContent: 'center', alignItems: 'center', width: scale(80) },
  participantTextName: { textAlign: 'center', fontSize: scale(11), lineHeight: scale(22) },
  marginImage: { marginRight: scale(10) },
});

export default React.memo(ParticipantPublish);
