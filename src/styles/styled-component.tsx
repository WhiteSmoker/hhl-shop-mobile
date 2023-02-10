import { ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

import { Colors } from '@/theme/colors';

export const ContainerStyled = styled.SafeAreaView`
  flex: 1;
  background: ${Colors.Light_grey};
`;

export const ContainerScrollStyled = styled.ScrollView`
  flex: 1;
  background: ${Colors.Very_Light_Gray};
`;

export const CenterViewStyled = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const indicateHostStyle: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 2,
  borderColor: Colors.Light_green,
  borderWidth: scale(2),
  borderRadius: scale(200),
};

export const ViewIndicateHost = styled.View<{ width: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
`;
