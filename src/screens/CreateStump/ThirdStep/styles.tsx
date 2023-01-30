import { Colors } from '@/theme/colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const TextTitleStyled = styled.Text`
  color: ${Colors.blackOriginal};
  font-size: ${scale(17)}px;
  line-height: ${scale(22)}px;
  margin-bottom: ${scale(5)}px;
  margin-top: ${scale(5)}px;
  font-family: Lexend-Bold;
  padding-horizontal: 2.5%;
`;

export const SmallTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.blackOriginal};
  font-size: ${scale(13)}px;
  line-height: ${scale(18)}px;
  font-weight: normal;
  padding-vertical: ${scale(10)}px;
  text-align: center;
  margin-left: ${(props: StyleProps) => scale(props.marginLeft || 0)}px;
`;
export const NomarlTextStyled = styled.Text`
  color: ${Colors.White};
  font-size: ${scale(12)}px;
  line-height: ${scale(14)}px;
  font-weight: normal;
  padding-vertical: ${scale(10)}px;
`;
export const TextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.Gray};
  font-size: ${scale(13)}px;
  line-height: ${scale(18)}px;
`;

export const ImageStyled = styled(FastImage)<StyleProps>`
  width: ${scale(64)}px;
  height: ${scale(64)}px;
  border-radius: ${scale(64)}px;
`;

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(16)}px;
  padding-bottom: ${scale(10)}px;
  justify-content: space-between;
`;

export const InviteViewStyled = styled.View<StyleProps>`
  background-color: ${Colors.Light_Gray};
  border-radius: ${scale(12)}px;
  width: 85%;
  align-self: center;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: ${(props: StyleProps) => scale(props.marginTop || 0)}px;
`;

export const TextInputStyled = styled.TextInput<StyleProps>`
  margin-top: ${scale(8)}px;
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.Emperor};
  border-radius: ${scale(5)}px;
  height: ${(props: StyleProps) => scale(props.height || 140)}px;
  padding: 0 ${scale(8)}px;
  text-align-vertical: top;
`;

export const CreateTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Lime_Green};
  border-radius: ${scale(10)}px;
  width: 40%;
  align-self: center;
  align-items: center;
  margin-vertical: ${scale(16)}px;
`;
export const ViewSearchStyled = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.White};
  padding-vertical: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
`;
export const SearchTextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  flex: 1;
  padding: ${scale(3)}px;
`;

export const SubViewStyled = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.Light_Gray};
  border-radius: ${scale(22)}px;
  padding-horizontal: ${scale(8)}px;
`;

export const ViewIconStyled = styled.TouchableOpacity`
  border-radius: ${scale(44)}px;
  justify-content: center;
  align-items: center;
  border-color: ${Colors.Pure_Orange};
  border-width: ${scale(1)}px;
  padding: ${scale(3)}px;
  margin-left: ${scale(6)}px;
`;
export const ViewListEmail = styled.View`
  background-color: ${Colors.Light_Gray};
  width: 85%;
  align-self: center;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: ${scale(12)}px;
  padding: ${scale(6)}px;
  margin-top: ${scale(10)}px;
`;

export const ViewListPhone = styled.View`
  background-color: ${Colors.Light_Gray};
  width: 95%;
  align-self: center;
  border-radius: ${scale(12)}px;
  margin-top: ${scale(10)}px;
`;

export const TextMessageStyled = styled.Text`
  text-align: center;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.DarkGray};
`;

export const TextOrStyled = styled.Text`
  margin-vertical: ${scale(12)}px;
  color: ${Colors.DarkGray};
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  text-align: center;
`;

const styles = StyleSheet.create({
  containerPhone: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.Light_Gray,
    borderRadius: scale(12),
  },
  containerInput: {
    fontStyle: 'normal',
    fontSize: scale(14),
    alignItems: 'center',
    color: Colors.dark,
    width: '100%',
    padding: scale(0),
    backgroundColor: Colors.Light_Gray,
  },
  containerCodeText: {
    width: scale(50),
    fontSize: scale(14),
    padding: 0,
    backgroundColor: Colors.Light_Gray,
    marginLeft: scale(-15),
  },
  container: {
    backgroundColor: Colors.Light_Gray,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: scale(12),
    paddingLeft: scale(6),
  },
  containerFlag: {
    width: scale(50),
    marginLeft: scale(3),
  },
  tag: {
    marginVertical: scale(10),
  },
  tagView: {
    backgroundColor: Colors.Alto,
    borderRadius: scale(100),
    paddingVertical: scale(6),
    paddingHorizontal: scale(14),
    marginRight: scale(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
  textTag: {
    color: Colors.blackOriginal,
    fontStyle: 'normal',
    fontSize: scale(14),
    lineHeight: scale(16),
    marginRight: scale(9),
  },
  inputContainer: {
    borderRadius: 0,
  },
  input: {
    backgroundColor: Colors.Light_Gray,
    fontSize: scale(14),
    color: Colors.dark,
    textAlign: 'center',
  },
  viewPhoneInput: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
  },
  touchArrow: {
    position: 'absolute',
    right: scale(6),
    height: '100%',
    justifyContent: 'center',
  },
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
  textContainerStyle: {
    backgroundColor: Colors.Light_Gray,
    borderRadius: scale(12),
  },
  countryPickerButtonStyle: {
    backgroundColor: Colors.Light_Gray,
  },
  flagButtonStyle: {
    padding: 0,
    margin: 0,
    width: scale(60),
  },
  shadowInput: {
    backgroundColor: Colors.White,
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderRadius: scale(10),
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: 12,
    elevation: Platform.OS === 'ios' ? 2 : 5,
    width: '95%',
    alignSelf: 'center',
    marginBottom: scale(6),
    marginTop: scale(6),
    zIndex: 1,
  },
  viewNoFriend: {
    width: Dimensions.get('window').width,
  },
  viewFriendVertical: {
    alignItems: 'center',
    paddingVertical: scale(8),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_Gray,
  },
  viewContact: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background2,
    padding: scale(8),
    borderRadius: scale(100),
    marginBottom: scale(3),
  },
});

export default styles;
