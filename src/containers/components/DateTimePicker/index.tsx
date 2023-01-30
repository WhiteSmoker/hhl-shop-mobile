import { IconCalendar } from '@/assets/icons/Icon';
import { Colors } from '@/theme/colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Alert, Appearance, Modal, Platform, StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';
import { IProps, IState } from './propState';
import styles from './styles';

const DateTimePickerComponent = (props: IProps) => {
  const [state, setState] = useState<IState>({
    showModalDateTime: false,
    currentDate: props.value,
  });

  const colorText: StyleProp<TextStyle> = { color: !props.value ? Colors.Black : Colors.Gray };

  const _toggleModalDateTime = () =>
    setState(prevState => ({
      ...prevState,
      showModalDateTime: !prevState.showModalDateTime,
      currentDate: props.value,
    }));

  const _onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    //check select past time
    if (selectedDate && props.mode === 'time' && new Date(selectedDate).getTime() < new Date().getTime()) {
      Alert.alert('', 'You should select future time.');
      return;
    }
    if (selectedDate) {
      setState(prevState => ({
        ...prevState,
        currentDate: selectedDate,
        showModalDateTime: Platform.OS === 'android' ? (props.mode === 'time' ? false : true) : true,
      }));
      if (Platform.OS === 'android' && _event.type !== 'dismissed') {
        if (props.onChangeDate) {
          props.onChangeDate(selectedDate, props.mode);
        }
      }
    } else {
      setState(prevState => ({
        ...prevState,
        showModalDateTime: false,
      }));
    }
  };

  const _chooseDate = () => {
    if (props.onChangeDate) {
      props.onChangeDate(state.currentDate, props.mode);
    }
    if (props.mode === 'time') {
      setState(prevState => ({ ...prevState, showModalDateTime: false }));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, props.containerStyle]}
        onPress={_toggleModalDateTime}
        disabled={props.disabled}>
        <IconCalendar width={scale(14)} height={scale(14)} fill={Colors.Dark_Gray1} />
        <Text style={[colorText, { flex: 1, marginLeft: scale(8), textTransform: 'uppercase' }]}>
          {format(new Date(state.currentDate), 'eee, MMMM dd yyyy, hh:mm a') || props.label}
        </Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' ? (
        <Modal animationType="fade" transparent={true} visible={state.showModalDateTime}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeder}>
                <TouchableOpacity onPress={_toggleModalDateTime}>
                  <TextComponent style={styles.btnCancel}>Cancel</TextComponent>
                </TouchableOpacity>
                <TouchableOpacity onPress={_chooseDate}>
                  <TextComponent style={styles.btnSelect}>Select</TextComponent>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                {...props}
                display="spinner"
                value={state.currentDate}
                onChange={_onChange}
                style={{
                  backgroundColor: Appearance.getColorScheme() === 'dark' ? Colors.Black : Colors.White,
                }}
                minimumDate={new Date()}
              />
            </View>
          </View>
        </Modal>
      ) : null}
      {Platform.OS === 'android'
        ? state.showModalDateTime && (
            <DateTimePicker {...props} value={state.currentDate} onChange={_onChange} minimumDate={new Date()} />
          )
        : null}
    </>
  );
};

export default React.memo(DateTimePickerComponent);
