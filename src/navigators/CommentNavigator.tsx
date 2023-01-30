import { COMMENT_NAVIGATION, ROOT_ROUTES } from '@/constants';
import { AllComment } from '@/screens/AllComment';
import { CommentLikes } from '@/screens/AllComment/CommentLikes';
import { commonSlice } from '@/stores/reducers';
import { IComment } from '@/stores/types/comment.type';
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TitleHeader from './headers/TitleHeader';

export type CommentStackParam = {
  ALL_COMMENT: { stumpId: number; screen: string; commentId?: number; mentionedComment?: IComment };
  COMMENT_LIKES: {
    screen: string;
    commentId: number;
    stumpId?: number;
    title?: string;
    type?: 'reactions' | 'sharings';
  };
  [COMMENT_NAVIGATION.ALL_COMMENT]: undefined;
  [COMMENT_NAVIGATION.EMPTY]: undefined;
};
const Stack = createNativeStackNavigator<CommentStackParam>();

const EmptyView = () => null;

const CommentNavigator = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      dispatch(commonSlice.actions.setTabActive(ROOT_ROUTES.COMMENT));
    }
  }, [isFocused, dispatch]);
  return (
    <Stack.Navigator
      initialRouteName={COMMENT_NAVIGATION.ALL_COMMENT}
      screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name={COMMENT_NAVIGATION.EMPTY} component={EmptyView} />
      <Stack.Screen
        name={COMMENT_NAVIGATION.ALL_COMMENT}
        component={AllComment}
        options={() => ({
          header: () => null,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name={COMMENT_NAVIGATION.COMMENT_LIKES}
        component={CommentLikes}
        options={({ route, navigation }: any) => ({
          header: () => (
            <TitleHeader
              title={route?.params?.title || 'Likes'}
              screen={route?.params?.screen}
              navigation={navigation}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
export default React.memo(CommentNavigator);
