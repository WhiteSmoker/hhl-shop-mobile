import { userController } from '@/controllers';
import { useAppSelector } from '@/stores';
import { IRoomChat } from '@/stores/types/chat.type';
import React from 'react';

export const useSearchChat = () => {
  const rooms = useAppSelector(rootState => rootState.chatState.rooms);

  const [state, setState] = React.useState<{ searchData?: IRoomChat[] }>({});

  const keySearch = React.useRef('');
  let timeoutSearch = React.useRef<number>().current;

  const onChangeText = React.useCallback(
    (text: string) => {
      keySearch.current = text.toLowerCase();
      if (timeoutSearch) {
        clearTimeout(timeoutSearch);
      }
      if (!text) {
        setState(prevState => ({ ...prevState, searchData: undefined }));
        return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutSearch = setTimeout(async () => {
        const res = await userController.searchByName(keySearch.current, 1);
        const users: IRoomChat[] = [...res.data.users].map(e => ({
          id: 0,
          members: [e],
          messages: [] as any,
          type: 'CHAT',
          status: 'ACTIVE',
          totalMessages: 0,
        }));
        const findGroupChat = rooms
          .filter(room => room.type === 'GROUP_CHAT')
          .filter(element => {
            const matchDisplayName = element.members
              .map(mem => mem.displayName + ' ')
              .toString()
              .toLowerCase()
              .includes(keySearch.current);

            const matchName = element.members
              .map(mem => mem.firstName + ' ' + mem.lastName + ' ')
              .toString()
              .toLowerCase()
              .includes(keySearch.current);

            return matchDisplayName || matchName;
          });

        if (res.status === 1) {
          setState(prevState => ({ ...prevState, searchData: [...findGroupChat, ...users] }));
        }
      }, 1000);
    },
    [rooms],
  );

  const clear = React.useCallback(() => {
    setState(prevState => ({ ...prevState, searchData: undefined }));
  }, []);

  return { ...state, onChangeText, clear };
};
