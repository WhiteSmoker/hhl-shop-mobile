import React from 'react';
import { Send } from 'react-native-gifted-chat';
import { styles } from './styles';
import { useDispatch } from 'react-redux';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { ISendTextProps } from '@/stores/types/chat.type';
import { chatSlice } from '@/stores/reducers';
import { IconSend } from '@/assets/icons/Icon';

export const SendText = React.memo(({ userGiftedChat, onSend, ...rest }: ISendTextProps) => {
  const dispatch = useDispatch();
  const onSendText = React.useCallback(
    ({ text }: { text: string }, should: boolean) => {
      const tempId = Date.now();
      const newMsgPending = {
        _id: tempId,
        tempId,
        text: text.trim(),
        createdAt: new Date().getTime(),
        thumbnail: '',
        user: userGiftedChat,
        pending: true,
      };
      dispatch(chatSlice.actions.appendMessagePending([newMsgPending]));
      if (onSend) {
        onSend([newMsgPending], true);
      }
    },
    [dispatch, onSend, userGiftedChat],
  );
  return rest.text ? (
    <Send {...rest} containerStyle={styles.sendContainerStyle} onSend={onSendText}>
      <IconSend width={scale(20)} height={scale(20)} fill={Colors.dark} />
    </Send>
  ) : null;
});
