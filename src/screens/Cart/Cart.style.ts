import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  cartContainer: {
    width: '100%',
    backgroundColor: Colors.White,
    flexDirection: 'row',
    marginTop: scale(10),
    padding: scale(10),
  },
  cartImage: {
    aspectRatio: 0.6,
    height: 150,
  },
  cartAmountMinus: {
    borderWidth: 1,
    borderColor: Colors.Timberwolf,
    padding: scale(8),
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
  },
  cartAmount: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.Timberwolf,
    paddingVertical: scale(8),
    paddingHorizontal: scale(18),
    lineHeight: scale(16.5),
  },
  cartAmountPlus: {
    borderWidth: 1,
    borderColor: Colors.Timberwolf,
    padding: scale(8),
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  cartPaymentContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: scale(10),
    backgroundColor: Colors.White,
  },
  cartPayment: {
    padding: scale(10),
    backgroundColor: Colors.Soft_Blue,
    marginLeft: scale(8),
    borderRadius: scale(8),
  },
  cartPaymentDisable: {
    backgroundColor: Colors.Timberwolf,
  },
});

export const ViewColorCart = styled.View`
  width: ${scale(30)}px;
  height: ${scale(30)}px;
  border-width: ${scale(1)}px;
  border-radius: ${scale(8)}px;
  border-color: ${Colors.Timberwolf};
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor};
`;

export const ViewSizeCart = styled.View`
  width: ${scale(30)}px;
  height: ${scale(30)}px;
  margin-left: ${scale(10)}px;
  border-width: ${scale(1)}px;
  border-radius: ${scale(8)}px;
  border-color: ${Colors.Timberwolf};
  align-items: center;
  justify-content: center;
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor};
`;
