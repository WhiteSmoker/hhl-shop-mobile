import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const TextTitleStyled = styled.Text`
  color: ${Colors.blackOriginal};
  font-size: ${scale(17)}px;
  line-height: ${scale(22)}px;
  margin-bottom: ${scale(5)}px;
  margin-top: ${scale(10)}px;
  font-family: Lexend-Bold;
`;

export const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.blackOriginal};
  font-size: ${scale(13)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  padding-vertical: ${scale(10)}px;
  text-align: center;
`;
export const NomarlTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.White};
  font-size: ${scale(12)}px;
  line-height: ${scale(14)}px;
  font-weight: normal;
  padding-vertical: ${scale(10)}px;
  margin-left: ${(props: StyleProps) => scale(props.marginLeft || 0)}px;
`;

export const ImageStyled = styled(FastImage)<StyleProps>`
  width: ${scale(64)}px;
  height: ${scale(64)}px;
  border-radius: ${scale(64)}px;
`;

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-bottom: ${scale(10)}px;
  justify-content: space-between;
`;

export const TextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  background-color: ${Colors.White};
  color: ${Colors.Emperor};
  border-radius: ${scale(5)}px;
  height: ${scale(180)}px;
  text-align-vertical: top;
  padding-horizontal: ${scale(12)}px;
`;

export const CreateTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Lime_Green};
  border-radius: ${scale(10)}px;
  width: 40%;
  align-self: center;
  align-items: center;
  margin-top: ${scale(30)}px;
`;

export const DeleteTouchStyled = styled.TouchableOpacity`
  border-radius: ${scale(10)}px;
  width: 40%;
  align-self: center;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: ${scale(10)}px;
  border-width: ${scale(1)}px;
  border-color: ${Colors.Dark_Gray1};
  background-color: ${Colors.Very_Light_Gray};
`;

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(64),
    height: scale(64),
    borderWidth: scale(3),
    borderRadius: scale(64),
    borderColor: Colors.Background,
  },
});

export default styles;
