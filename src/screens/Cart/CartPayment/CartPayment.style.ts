import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  paymentInput: {
    width: '100%',
    marginTop: scale(10),
    padding: scale(10),
    backgroundColor: Colors.White,
  },
  paymentContainer: {
    width: '100%',
    backgroundColor: Colors.White,
    flexDirection: 'row',
    marginTop: scale(10),
  },
  cartPaymentContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: scale(10),
    backgroundColor: Colors.White,
  },
  cartPaymentImage: {
    aspectRatio: 1,
    height: scale(70),
  },
  paymentChoose: {
    paddingVertical: scale(10),
  },
  paymentButton: {
    padding: scale(10),
    backgroundColor: Colors.Soft_Blue,
    marginLeft: scale(8),
    borderRadius: scale(8),
  },
});

export const TextErrorStyled = styled.Text`
  font-size: ${scale(14)}px;
  color: ${Colors.Error_Color};
  font-family: 'Lexend-Regular';
`;

export const TextInputStyled = styled.TextInput`
  background: ${Colors.White};
  font-style: normal;
  align-items: center;
  color: ${Colors.dark};
  width: 100%;
  padding: ${scale(10)}px;
  border-color: ${Colors.Soft_Blue};
  border-width: ${scale(1)}px;
  border-radius: ${scale(6)}px;
  align-self: center;
  margin-top: ${(props: { marginTop?: number }) => scale(props.marginTop || 5)}px;
  font-size: ${scale(14)}px;
  font-family: 'Lexend-Regular';
`;
