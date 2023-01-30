import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const ViewWrapStyled = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-top: ${scale(16)}px;
`;
export const TextMessageStyled = styled.Text`
  text-align: center;
  color: ${Colors.DarkGray};
`;
