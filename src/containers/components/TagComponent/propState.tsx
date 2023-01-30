import { TextInputProps } from 'react-native';
export interface StyleProps {
  marginTop?: number;
  width?: number;
}

export interface TagProps extends TextInputProps {
  data: string[];
  controlName: 'email' | 'phoneNumber';
  removeElement: (controlName: 'email' | 'phoneNumber') => (index: number) => void;
  addElement: (controlName: 'email' | 'phoneNumber') => (text: string) => void;
  focus: (controlName: 'email' | 'phoneNumber') => () => void;
}
