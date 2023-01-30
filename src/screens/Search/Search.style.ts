import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const TextInputStyled = styled.TextInput`
  font-style: normal;
  font-family: Lexend-Regular;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  background-color: ${Colors.White};
  color: ${Colors.Emperor};
  border-radius: ${scale(5)}px;
  height: ${scale(44)}px;
  padding-right: ${scale(12)}px;
  flex: 1;
`;

export const TextRecentTitleStyled = styled.Text`
  font-size: ${scale(17)}px;
  font-family: Lexend-Bold;
  margin-bottom: ${scale(10)}px;
`;

export const ViewHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.Background};
  border-radius: ${scale(6)}px;
`;

export const ViewSkeleton = styled.View`
  padding-horizontal: ${scale(24)}px;
`;

export const TextRecentStyled = styled.Text`
  font-size: ${scale(17)}px;
  line-height: ${scale(22)}px;
`;

export const ViewRecentStyled = styled.TouchableOpacity`
  padding-vertical: ${scale(13)}px;
  border-bottom-width: ${scale(1)}px;
  border-bottom-color: ${Colors.Light_grayish_green};
`;

export const ViewSearchStyled = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
  background: ${Colors.White};
  padding-horizontal: ${scale(24)}px;
  margin-bottom: ${scale(15)}px;
  padding-horizontal: ${scale(12)}px;
  padding-vertical: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
  width: 90%;
  border-radius: ${scale(8)}px;
`;

export const SearchTextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  flex: 1;
  padding-vertical: ${scale(3)}px;
`;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
});
