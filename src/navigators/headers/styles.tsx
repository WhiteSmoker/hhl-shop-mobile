import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const HeaderTitleStyled = styled.Text`
  font-style: normal;
  font-family: Lexend-Bold;
  font-size: ${scale(18)}px;
  line-height: ${scale(20)}px;
  text-transform: capitalize;
  color: ${Colors.white};
`;

export const TextRightStyled = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(12)}px;
  line-height: ${scale(20)}px;
  text-transform: capitalize;
  color: ${Colors.white};
`;
