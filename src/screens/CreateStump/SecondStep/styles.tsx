import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const ViewWrapStyled = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
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
export const TextJoinStyled = styled.Text`
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  color: ${Colors.White};
`;

export const SearchTextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
  flex: 1;
`;

const styles = StyleSheet.create({
  viewInput: {
    backgroundColor: Colors.Background,
    flexDirection: 'row',
    paddingBottom: scale(8),
    width: '100%',
  },
  viewJoin: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSearch: {
    flexDirection: 'row',
    backgroundColor: Colors.White,
    paddingHorizontal: scale(12),
    paddingVertical: scale(3),
    borderRadius: scale(8),
  },
});

export default styles;
