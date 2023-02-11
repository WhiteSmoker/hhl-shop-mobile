import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  productNameContainer: {
    alignSelf: 'center',
    width: '100%',
    marginTop: scale(10),
    padding: scale(10),
    backgroundColor: Colors.White,
  },
  productImage: {
    width: '100%',
    height: scale(400),
  },
  productInfoContainer: {
    alignSelf: 'center',
    width: '100%',
    marginTop: scale(10),
    padding: scale(10),
    backgroundColor: Colors.White,
  },
  colorChoose: {
    borderWidth: scale(1.5),
    borderColor: Colors.Soft_Blue,
    padding: scale(4),
    marginRight: scale(6),
    borderRadius: scale(8),
  },
  addToCartButton: {
    width: '100%',
    height: scale(50),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Soft_Blue,
  },
});

export const ViewColorProduct = styled.TouchableOpacity`
  width: ${scale(30)}px;
  height: ${scale(30)}px;
  border-width: ${scale(1)}px;
  border-radius: ${scale(8)}px;
  border-color: ${Colors.Timberwolf};
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor};
`;

export const ViewSizeProduct = styled.TouchableOpacity`
  width: ${scale(30)}px;
  height: ${scale(30)}px;
  border-width: ${scale(1)}px;
  border-radius: ${scale(8)}px;
  border-color: ${Colors.Timberwolf};
  align-items: center;
  justify-content: center;
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor};
`;

export const ButtonAddToCart = styled.TouchableOpacity`
  width: 100%;
  height: ${scale(50)}px;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor};
`;
