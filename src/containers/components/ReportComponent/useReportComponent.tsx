import { useCallback, useState } from 'react';
import { stumpController } from '@/controllers/stump.controller';
interface IState {
  stepTwo?: { name: string; type: number };
  stepSuccess: boolean;
  loading: boolean;
}
const useReportComponent = () => {
  const [state, setState] = useState<IState>({
    stepTwo: undefined,
    stepSuccess: false,
    loading: false,
  });

  const nextStepTwo = useCallback((step: { name: string; type: number }) => {
    setState(prevState => ({ ...prevState, stepTwo: step }));
  }, []);

  const clearState = () => {
    setState(prevState => ({ ...prevState, stepTwo: undefined, stepSuccess: false, loading: false }));
  };

  const backPrevStep = useCallback(() => {
    setState(prevState => ({ ...prevState, stepTwo: undefined }));
  }, []);

  const reportStumpApi = useCallback(async (stumpId: number, type: number, description: string) => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      await stumpController.reportStump(stumpId, type, description);
      setState(prevState => ({ ...prevState, loading: false, stepSuccess: true }));
    } catch (error: any) {
      console.log(error);
      setState(prevState => ({ ...prevState, loading: false }));
    }
  }, []);

  return { state, nextStepTwo, backPrevStep, reportStumpApi, clearState };
};

export default useReportComponent;
