import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import React, { useImperativeHandle } from 'react';
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native';
import { TextComponent } from '../TextComponent';
import { IButtonSheet, IButtonSheetProps, IButtonSheetRef } from './propState';
import { styles } from './styles';

export const ButtonSheet = React.memo(
  React.forwardRef<IButtonSheetRef, IButtonSheetProps>(({ buttons }, ref) => {
    const [openModal, setOpenModal] = React.useState(false);
    const [stateButtons, setStateButtons] = React.useState<IButtonSheet[]>(buttons || []);
    const aniModal = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      setStateButtons(buttons || []);
    }, [buttons]);

    const closeModal = React.useCallback(() => {
      Animated.timing(aniModal, {
        useNativeDriver: false,
        duration: 300,
        toValue: 0,
      }).start(cb => {
        setOpenModal(false);
      });
    }, [aniModal]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpenModal(true);
          Animated.timing(aniModal, {
            useNativeDriver: false,
            duration: 300,
            toValue: 1,
          }).start();
        },
        close: () => {
          closeModal();
        },
        setButtons: (btns: IButtonSheet[]) => {
          setStateButtons(btns);
        },
      }),
      [aniModal, closeModal],
    );

    const RenderButtons = React.useMemo(() => {
      return (
        <View style={styles.viewButtons}>
          {stateButtons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={{ ...styles.btnStyle, borderBottomWidth: index === stateButtons.length - 1 ? 0 : 1 }}
              onPress={btn.onPress}>
              <TextComponent style={{ ...styles.textButton, color: btn.color }}>{btn.label}</TextComponent>
            </TouchableOpacity>
          ))}
        </View>
      );
    }, [stateButtons]);

    return (
      <Modal visible={openModal} animationType="fade" transparent={true}>
        <TouchableOpacity onPress={closeModal} activeOpacity={1} style={commonStyles.flex_1}>
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
              justifyContent: 'flex-end',
            }}>
            {RenderButtons}
            <TouchableOpacity style={styles.viewCancelStyle} onPress={closeModal}>
              <TextComponent style={styles.textButton}>Cancel</TextComponent>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }),
);
ButtonSheet.displayName = 'ButtonSheet';
