import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const ViewStyled = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-bottom: ${scale(10)}px;
`;

export const SkipViewTextStyled = styled.TouchableOpacity`
  display: flex;
  align-items: flex-end;
  margin-top: ${scale(32)}px;
`;
export const SkipTextStyled = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  color: ${Colors.Black};
`;
export const ProfileImageViewStyled = styled.TouchableOpacity`
  margin-top: ${scale(41)}px;
  width: ${scale(217.76)}px;
  height: ${scale(217.76)}px;
  border-radius: ${scale(217.76)}px;
  background: ${Colors.Silver2};
  align-self: center;
  justify-content: center;
  flex-direction: row;
`;
export const ProfileImageViewContentStyled = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
export const ProfileImageStyled = styled.Image<any>`
  width: ${(props: any) => scale(props.sizeImage || 217.76)}px;
  height: ${(props: any) => scale(props.sizeImage || 217.76)}px;
  border-radius: ${(props: any) => scale(props.sizeImage || 217.76)}px;
`;
export const TextStyled = styled.Text`
  margin-top: ${scale(32.24)}px;
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${Colors.Black};
`;
export const TouchRegisterStyled = styled.TouchableOpacity<any>`
  margin-top: ${(props: any) => scale(props.marginTop || 32)}px;
  background: ${Colors.Pure_Orange};
  border-radius: ${scale(5)}px;
  width: 60%;
  align-self: center;
`;

export const TouchRegisterTextStyled = styled.Text<any>`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  text-align: center;
  padding-vertical: ${scale(12)}px;
  color: ${(props: any) => props.color || Colors.White};
`;
