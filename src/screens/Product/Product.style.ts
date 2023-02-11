import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
  },
  searchContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${Colors.White}`,
    paddingHorizontal: scale(5),
    marginVertical: scale(Platform.OS === 'ios' ? 30 : 10),
    borderRadius: scale(9),
  },
  searchInput: {
    flex: 1,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.dark,
  },
  categoryContainer: {
    width: '95%',
    alignSelf: 'center',
    paddingBottom: scale(10),
  },
  categoryButton: {
    borderWidth: scale(2),
    borderColor: Colors.Timberwolf,
    borderRadius: scale(20),
    marginRight: scale(10),
    padding: scale(6),
  },
  categoryChoose: {
    backgroundColor: Colors.Soft_Blue,
    borderColor: Colors.Soft_Blue,
    color: Colors.White,
  },
  categotyTypo: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Lexend-Bold',
    textTransform: 'capitalize',
  },
  productContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  productItem: {
    width: '48%',
    borderWidth: scale(1),
    borderColor: Colors.Timberwolf,
    backgroundColor: Colors.White,
    borderRadius: scale(10),
    paddingBottom: scale(20),
    marginHorizontal: scale(4),
    marginBottom: scale(8),
  },
  productImage: {
    width: '100%',
    height: scale(200),
    borderRadius: scale(10),
    marginBottom: scale(12),
  },
  productColorSize: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
  },
});

export const ViewColorProduct = styled.View`
  width: ${scale(10)}px;
  height: ${scale(10)}px;
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor || Colors.Timberwolf};
  border-width: ${scale(0.5)}px;
  border-color: ${Colors.Soft_Blue};
  margin-right: ${scale(2)}px;
`;

export const TetxSizeProduct = styled.Text`
  font-size: ${scale(10)}px;
  font-family: Lexend-Regular;
  margin-left: ${scale(4)}px;
`;
