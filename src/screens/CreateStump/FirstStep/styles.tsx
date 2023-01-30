import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const ViewWrapStyled = styled.View`
  justify-content: center;
  align-items: center;
  align-self: center;
  flex: 1;
  padding-vertical: ${scale(10)}px;
`;

export const ViewIconStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Background2};
  width: ${scale(120)}px;
  height: ${scale(120)}px;
  border-radius: ${scale(10)}px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${scale(16)}px;
`;

export const TextContentStyled = styled.Text`
  font-size: ${scale(16)}px;
  line-height: ${scale(18)}px;
  font-family: Lexend-Bold;
  color: ${Colors.Black};
`;
