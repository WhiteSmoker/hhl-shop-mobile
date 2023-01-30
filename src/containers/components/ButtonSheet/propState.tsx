export interface IButtonSheet {
  label: string;
  color: string;
  onPress: () => void;
}
export interface IButtonSheetProps {
  buttons?: { label: string; color: string; onPress: () => void }[];
}
export interface IButtonSheetRef {
  open: () => void;
  close: () => void;
  setButtons: (btns: IButtonSheet[]) => void;
}
