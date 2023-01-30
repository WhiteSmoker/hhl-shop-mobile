import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CHAT_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { TRoomType } from '@/stores/types/chat.type';
import { AllConversation } from '@/screens/Chat/AllConversation';
import { InRoomChat } from '@/screens/Chat/InRoomChat';
import { useIsFocused } from '@react-navigation/native';
import { commonSlice } from '@/stores/reducers';
import { useDispatch } from 'react-redux';

export type ChatStackParam = {
  [CHAT_NAVIGATION.ALL_CONVERSATION]: { type: TRoomType; title: string; screen?: string };
  [CHAT_NAVIGATION.IN_ROOM_CHAT]: { roomId: number; screen: string; type: TRoomType };
  [CHAT_NAVIGATION.REQUEST_CHAT]: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParam>();

const ChatNavigation = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      dispatch(commonSlice.actions.setTabActive(ROOT_ROUTES.CHAT));
    }
  }, [isFocused, dispatch]);
  return (
    <Stack.Navigator
      initialRouteName={CHAT_NAVIGATION.ALL_CONVERSATION}
      screenOptions={{ animation: 'slide_from_right', headerShown: false }}>
      <Stack.Screen name={CHAT_NAVIGATION.ALL_CONVERSATION} component={AllConversation} />
      <Stack.Screen name={CHAT_NAVIGATION.IN_ROOM_CHAT} component={InRoomChat} />
    </Stack.Navigator>
  );
};
export default React.memo(ChatNavigation);
