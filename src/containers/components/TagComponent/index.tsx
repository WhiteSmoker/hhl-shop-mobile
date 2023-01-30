import { IconExit } from '@/assets/icons/Icon';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { TagProps } from './propState';
import { InputStyled, styles } from './styles';
import { userController } from '@/controllers/user.controller';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';

const TagComponent = ({ focus, ...props }: TagProps) => {
  const { control, setValue } = useForm<{ controlName: string }>();
  const userInfo = useAuth();

  const _removeElement = (index: number) => () => {
    props.removeElement(props.controlName)(index);
  };

  const _submitEditing = async () => {
    const text = control._formValues?.controlName?.trim().toLowerCase();
    const valid = /^[\w.]{1,}@[a-z0-9]{1,}(\.[a-z0-9]{1,}){1,10}$/gm.test(text);
    if (!text) {
      return;
    }
    if (props.data.includes(text)) {
      Alert.alert('', `Email already exists.`);
      setValue('controlName', text);
      return;
    }
    if (props.controlName === 'email' && text === userInfo?.email?.toLowerCase()) {
      Alert.alert('', `You can't invite yourself to Stump.`);
      setValue('controlName', text);
      return;
    }
    if (props.controlName === 'email' && !valid) {
      Alert.alert('', 'Please enter a valid email address.');
      setValue('controlName', text);
      return;
    }
    const res = await userController.checkBlockStatus(text);
    if (res.status === 2) {
      Alert.alert(res.data);
      return;
    }
    props.addElement(props.controlName)(text);
    setValue('controlName', '');
  };

  const _checkKeyPress = (event: any) => {
    if (event.nativeEvent.key === ' ') {
      _submitEditing();
    }
  };

  const _onFocus = () => {
    focus(props.controlName)();
  };
  return (
    <>
      {props.data.map((tag, index) => {
        return (
          <TouchableOpacity key={`${tag}-${index}`} style={styles.tag} onPress={_removeElement(index)}>
            <View style={styles.tagView}>
              <TextComponent style={styles.textTag}>{tag}</TextComponent>
              <IconExit width={scale(10)} height={scale(10)} fill={Colors.Black} />
            </View>
          </TouchableOpacity>
        );
      })}
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <InputStyled
            {...props}
            placeholder={props.data.length ? '' : props.placeholder}
            onFocus={_onFocus}
            onChangeText={onChange}
            value={value}
            onSubmitEditing={_submitEditing}
            onKeyPress={_checkKeyPress}
            width={props.data.length ? 70 : 100}
          />
        )}
        name="controlName"
      />
    </>
  );
};

export default React.memo(TagComponent);
