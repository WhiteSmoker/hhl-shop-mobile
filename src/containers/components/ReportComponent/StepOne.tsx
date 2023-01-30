import { REPORT_STATUS } from '@/constants';
import { Colors } from '@/theme/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextComponent } from '../TextComponent';
import { styles } from './styles';

const ListReport = [
  {
    name: 'Spam',
    type: REPORT_STATUS.SPAM,
  },
  {
    name: 'Inappropriate',
    type: REPORT_STATUS.INAPPROPRIATE,
  },
  {
    name: 'Harassment',
    type: REPORT_STATUS.TROUBLE,
  },
  {
    name: 'Other',
    type: REPORT_STATUS.DIFFERENT,
  },
];
interface Props {
  nextStep(step: { name: string; type: number }): void;
  reportStump(stumpId: number, type: number, description: string): void;
  stumpId: number;
}
const StepOne = (props: Props) => {
  const _nextStep = (step: { name: string; type: number }) => async () => {
    if (step.type === REPORT_STATUS.DIFFERENT) {
      props.nextStep(step);
    } else {
      props.reportStump(props.stumpId, step.type, '');
    }
  };
  const RenderReportItem = () => {
    return (
      <>
        {ListReport.map(report => {
          return (
            <TouchableOpacity style={styles.reportItem} key={report.type} onPress={_nextStep(report)}>
              <TextComponent style={styles.textReportItem}>{report.name}</TextComponent>
              <Icon name="chevron-forward-outline" size={scale(25)} color={Colors.Gray} />
            </TouchableOpacity>
          );
        })}
      </>
    );
  };
  return (
    <View>
      <TextComponent style={styles.textBoldStepOne_1} numberOfLines={2}>
        Please select a problem
      </TextComponent>
      <TextComponent style={styles.textGreyStepOne} numberOfLines={2}>
        {`Tell us what's happening with this stump.`}
      </TextComponent>
      {RenderReportItem()}
    </View>
  );
};
export default React.memo(StepOne);
