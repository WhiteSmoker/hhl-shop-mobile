import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import useKeyboard from '@/hooks/useKeyboard';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, View } from 'react-native';
import DismissKeyboard from '../DismissKeyboard/index';
import HeaderReport from './HeaderReport';
import StepOne from './StepOne';
import StepSuccess from './StepSuccess';
import StepTwo from './StepTwo';
import { styles } from './styles';
import useReportComponent from './useReportComponent';

const ReportComponent = () => {
  const [bgModal, setBgModal] = useState('transparent');
  const slideYAnim = React.useRef(new Animated.Value(300)).current;
  const { state, nextStepTwo, backPrevStep, reportStumpApi, clearState } = useReportComponent();
  const { status: keyboardStatus } = useKeyboard();
  const [reportStumpId, setReportStumpId] = useState(0);

  useEmitter(EDeviceEmitter.MODAL_REPORT, (stumpId: number) => {
    setReportStumpId(stumpId);
  });

  const _closeModal = useCallback(async () => {
    await _aniOffSlideY();
    setReportStumpId(0);
  }, []);

  const onShow = async () => {
    setBgModal('rgba(0,0,0,0.2)');
    await _aniSlideY();
  };

  useEffect(() => {
    if (!reportStumpId) {
      clearState();
    }
  }, [reportStumpId]);

  const _aniSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  const _aniOffSlideY = () => {
    return new Promise<boolean>(resolve => {
      Animated.timing(slideYAnim, {
        toValue: Dimensions.get('window').height,
        useNativeDriver: true,
        duration: 150,
      }).start(endCallback => {
        if (endCallback.finished) {
          resolve(true);
        }
      });
    });
  };

  return (
    <Modal visible={!!reportStumpId} animationType="none" transparent={true} onShow={onShow}>
      <DismissKeyboard>
        <View style={[styles.modalContainer, { backgroundColor: bgModal }]}>
          <Animated.View style={[styles.sign, { transform: [{ translateY: slideYAnim }] }]} />

          <Animated.View
            style={[
              styles.modalView,
              { height: keyboardStatus ? '80%' : '55%' },
              { transform: [{ translateY: slideYAnim }] },
            ]}>
            <HeaderReport
              hasStepTwo={!!state.stepTwo && !state.stepSuccess}
              onBack={backPrevStep}
              onClose={_closeModal}
            />
            {state.stepSuccess ? (
              <StepSuccess />
            ) : (
              <View style={styles.body}>
                {!state.stepTwo ? (
                  <StepOne nextStep={nextStepTwo} reportStump={reportStumpApi} stumpId={reportStumpId} />
                ) : (
                  <StepTwo stepTwo={state.stepTwo} stumpId={reportStumpId} reportStump={reportStumpApi} />
                )}
              </View>
            )}
          </Animated.View>
        </View>
      </DismissKeyboard>
    </Modal>
  );
};

export default ReportComponent;
