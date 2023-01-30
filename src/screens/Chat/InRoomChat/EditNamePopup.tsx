import DismissKeyboard from '@/containers/components/DismissKeyboard';
import { ITextFieldRef, TextField } from '@/containers/components/TextField';
import { chatController } from '@/controllers/chat.controller';
import { chatSlice } from '@/stores/reducers';
import { IEditNamePopupProps, IEditNamePopupRef } from '@/stores/types/chat.type';
import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React, { useImperativeHandle } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

export const EditNamePopup = React.memo(
  React.forwardRef<IEditNamePopupRef, IEditNamePopupProps>(({ roomId, name }, ref) => {
    const dispatch = useDispatch();
    const [isShow, setShow] = React.useState(false);
    const [isEmptyText, setEmptyText] = React.useState(!!name);
    const textFieldRef = React.useRef<ITextFieldRef>();
    const aniModal = React.useRef(new Animated.Value(0)).current;
    const closeModal = React.useCallback(() => {
      Animated.timing(aniModal, {
        useNativeDriver: false,
        duration: 300,
        toValue: 0,
      }).start(cb => {
        setShow(false);
      });
    }, [aniModal]);

    React.useEffect(() => {
      if (isShow) {
        Animated.timing(aniModal, {
          useNativeDriver: false,
          duration: 300,
          toValue: 1,
        }).start();
      }
    }, [aniModal, isShow]);

    const edit = React.useCallback(async () => {
      try {
        await chatController.editRoom(roomId, textFieldRef.current?.getValue() || '');
        dispatch(chatSlice.actions.changeNameRoom({ roomId, name: textFieldRef.current?.getValue() || '' }));
        closeModal();
      } catch (error) {
        console.log(error);
      }
    }, [closeModal, dispatch, roomId]);

    const handleChange = React.useCallback((text: string) => {
      setEmptyText(!text);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setShow(true);
        },
        close: () => {
          closeModal();
        },
        isShow: () => isShow,
      }),
      [closeModal, isShow],
    );

    return (
      <Modal visible={isShow} animationType="fade" transparent={true}>
        <View style={commonStyles.flex_1}>
          <DismissKeyboard>
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: aniModal.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['transparent', Colors.greyOpacity, Colors.greyOpacity],
                }),
                transform: [
                  {
                    translateY: aniModal.interpolate({
                      inputRange: [0, 0.1, 1],
                      outputRange: [2000, 100, 0],
                    }),
                  },
                ],
                opacity: aniModal.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.8, 1],
                }),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.content}>
                <TextEdit fontSize={scale(15)} paddingBottom={scale(16)} fontWeight={'bold'}>
                  Edit group name
                </TextEdit>

                <TextField
                  ref={textFieldRef as any}
                  defaultValue={name || ''}
                  // label={'Group name'}
                  onChangeText={handleChange}
                />
                <ViewBtnGroup>
                  <TouchableOpacity style={styles.btnCancel} onPress={closeModal} activeOpacity={0.8}>
                    <TextEdit>Cancel</TextEdit>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.btnEdit, opacity: isEmptyText ? 0.5 : 1 }}
                    onPress={edit}
                    activeOpacity={0.8}
                    disabled={isEmptyText}>
                    <TextEdit color={'white'}>Save</TextEdit>
                  </TouchableOpacity>
                </ViewBtnGroup>
              </View>
            </Animated.View>
          </DismissKeyboard>
        </View>
      </Modal>
    );
  }),
);
EditNamePopup.displayName = 'ChatScreen/EditNamePopup';
interface StyleProps {
  color?: string;
  fontSize?: number;
  paddingBottom?: number;
  fontWeight?: string;
}
const TextEdit = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || 'black'};
  font-size: ${(props: StyleProps) => props.fontSize || scale(12)}px;
  padding-bottom: ${(props: StyleProps) => props.paddingBottom || 0}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'normal'};
`;
const ViewBtnGroup = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;
const styles = StyleSheet.create({
  btnEdit: {
    marginTop: scale(10),
    marginLeft: scale(8),
    paddingVertical: scale(6),
    borderRadius: scale(6),
    backgroundColor: Colors.Soft_Blue,
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: scale(48),
  },
  btnCancel: {
    marginTop: scale(10),
    marginLeft: scale(8),
    paddingVertical: scale(5),
    borderRadius: scale(6),
    backgroundColor: Colors.Very_Light_Gray,
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: scale(48),
    borderWidth: scale(1),
    borderColor: Colors.dark,
  },
  content: {
    backgroundColor: 'white',
    width: '80%',
    paddingTop: scale(8),
    paddingBottom: scale(8),
    paddingHorizontal: scale(10),
  },
});
