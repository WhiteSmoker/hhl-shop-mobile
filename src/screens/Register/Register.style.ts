import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  imgLogo: {
    marginTop: 0,
    width: Dimensions.get('window').width - scale(150),
    height: Dimensions.get('window').width - scale(150),
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(spacing.xl),
    backgroundColor: Colors.Background2,
  },
  pickerWrap: {
    borderColor: Colors.borderColor2,
    borderWidth: scale(1),
    borderRadius: scale(5),
    backgroundColor: Colors.white,
    // paddingHorizontal: scale(13),
    width: '100%',
    maxWidth: 500,
    marginBottom: scale(15),
    height: scale(40),
    paddingLeft: scale(10),
  },
  viewLogo: {
    marginTop: scale(40),
    alignSelf: 'center',
  },
});
export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  padding-bottom: ${scale(10)}px;
`;

export const ViewTextInputStyled = styled.View<any>`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props: any) => scale(props.marginTop)}px;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(44)}px`};
`;

export const TextInputStyled = styled.TextInput`
  background: ${Colors.White};
  border-width: ${scale(2)}px;
  border-color: ${Colors.manatee};
  border-radius: ${scale(5)}px;
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding-horizontal: ${scale(12)}px;
  padding-vertical: ${scale(12)}px;
  flex: 1;
  height: ${Platform.OS === 'ios' ? 'auto' : `${scale(44)}px`};
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

export const TextErrorStyled = styled.Text`
  font-size: ${scale(12)}px;
  line-height: ${scale(14)}px;
  font-style: italic;
  color: ${Colors.Pure_Orange};
  margin-left: 5%;
  padding-top: ${scale(3)}px;
`;

export default styles;
