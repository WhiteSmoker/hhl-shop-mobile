import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { TextComponent } from '../TextComponent';
import { styles, TextInputStyled } from './styles';

interface Props {
  stepTwo: { name: string; type: number };
  reportStump(stumpId: number, type: number, description: string): void;
  stumpId: number;
}
const StepTwo = (props: Props) => {
  const { control } = useForm<{ description: string }>();
  const onSubmit = () => {
    const text = control?._formValues.description?.trim();
    if (text) {
      props.reportStump(props.stumpId, props.stepTwo.type, text);
    } else {
      Alert.alert('', 'Please enter something for your report.');
    }
  };
  return (
    <>
      <View>
        <TextComponent style={styles.textGreyStepOne} numberOfLines={2}>
          We will review your report. Thanks for letting us know.
        </TextComponent>
        <View style={styles.shadowInput}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputStyled
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={`Enter something …`}
              />
            )}
            name="description"
            defaultValue={''}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.buttonSubmit} onPress={onSubmit}>
        <TextComponent style={styles.textSubmitStepTwo}>Submit</TextComponent>
      </TouchableOpacity>
    </>
  );
};
export default React.memo(StepTwo);
