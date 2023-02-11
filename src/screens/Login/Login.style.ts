import { Platform, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { StyledProps } from './Login.prop';

import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';
import { scale } from '@/theme/scale';

export const TextInputStyled = styled.TextInput`
  background: ${Colors.Light_grey3};
  font-style: normal;
  font-weight: 500;
  line-height: ${scale(20)}px
  align-items: center;
  color: ${Colors.dark};
  width: 100%;
  padding: ${scale(16)}px;
  border-color: ${Colors.Light_grey3};
  border-width: ${scale(1)}px;
  border-radius: ${scale(6)}px;
  align-self: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  font-size: ${scale(15)}px;
`;

export const TextErrorStyled = styled.Text`
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.Error_Color};
  margin-top: ${scale(6)}px;
`;

export const ViewForgotPasswordStyled = styled.View`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 16)}px;
  margin-bottom: ${(props: StyledProps) => scale(props.marginTop || 16)}px;
  width: 90%;
  align-self: center;
  align-items: flex-end;
`;

export const TextOrStyled = styled.Text<StyledProps>`
  margin-vertical: ${(props: StyledProps) => scale(props.marginTop || scale(0))}px;
  color: ${(props: StyledProps) => props.color || Colors.Light_grey3};
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  text-align: ${(props: StyledProps) => props.textAlign || 'center'};
  text-decoration-color:${(props: StyledProps) => props.color || Colors.White};
  text-decoration-line: ${(props: StyledProps) => props.textDecorationLine || 'none'}};
`;

export const ViewBtnLoginStyled = styled.TouchableOpacity<StyledProps>`
  width: 100%;
  height: ${scale(54)}px;
  align-items: center;
  align-self: center;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  background-color: ${(props: StyledProps) => props.backgroundColor || '#1da1f2'};
  justify-content: center;
  flex-direction: row;
  border-radius: ${scale(6)}px;
`;

export const TextLoginStyled = styled.Text`
  color: ${Colors.white};
  font-size: ${scale(15)}px;
  line-height: ${scale(16)}px;
  font-family: Lexend-Bold;
  text-transform: capitalize;
  padding: ${scale(12)}px;
`;

export const ViewLoginSocialStyled = styled.View`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  width: 100%;
  align-self: center;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const ViewSigninStyled = styled.TouchableOpacity`
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 6)}px;
  margin-bottom: ${(props: StyledProps) => scale(props.marginBottom || 32)}px;
  width: 90%;
  align-self: center;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const ViewBtnSocial = styled.View<StyledProps>`
  width: ${scale(47)}px;
  height: ${scale(47)}px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: StyledProps) => props.backgroundColor || Colors.Light_grey3};
  border-radius: ${scale(47)}px;
  margin-horizontal: ${scale(7)}px;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(spacing.s),
    backgroundColor: Colors.Soft_Blue,
  },
  formContainer: {
    borderRadius: scale(5),
    padding: scale(spacing.s),
    width: '100%',
  },
  submitButton: {
    marginTop: scale(spacing.m),
  },
  viewLogo: {
    marginVertical: scale(60),
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  underlineView: {
    marginTop: scale(4),
    height: scale(60),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orView: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background2,
  },
  shadow: {
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: Platform.OS === 'ios' ? 12 : 12,
    elevation: Platform.OS === 'ios' ? 2 : 3,
    zIndex: 1,
    borderRadius: scale(10),
  },
  view_icon_apple: {
    marginLeft: scale(6),
    width: scale(49),
    height: scale(49),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Light_grey3,
    borderRadius: scale(54),
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,

    elevation: 3,
  },

  CheckBoxContainer: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginLeft: 0,
  },
  CheckBoxText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: scale(14),
    lineHeight: scale(16),
    color: Colors.Black,
  },
});
