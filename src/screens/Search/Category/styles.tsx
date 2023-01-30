import { Colors } from '@/theme/colors';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const ContainerStyled = styled.SafeAreaView`
  flex: 1;
  background: ${Colors.Very_Light_Gray};
`;

export const ContainerScrollStyled = styled.ScrollView`
  flex: 1;
  background: ${Colors.Very_Light_Gray};
`;
export const TextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  background-color: ${Colors.White};
  color: ${Colors.Emperor};
  border-radius: ${scale(5)}px;
  height: ${scale(44)}px;
  padding-right: ${scale(12)}px;
  flex: 1;
`;

export const ViewHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 6px;
`;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : scale(24),
  },
  viewSearchHeader: {
    width: '100%',
    backgroundColor: Colors.Primary_Color,
    padding: scale(16),
    marginBottom: scale(16),
  },
  containerStyled: {
    width: '95%',
    alignSelf: 'center',
    overflow: 'scroll',
  },
  listBtnSort: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  btnSort: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#fff',
  },
  btnSortActive: {
    borderColor: Colors.Background,
  },
  titleButtonActive: {
    color: Colors.Background,
  },
  item: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemHighLevel: {
    display: 'flex',
    flexDirection: 'row',
  },
  listItemStyled: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(6),
    borderTopRightRadius: scale(6),
    borderBottomColor: '#E6E7E9',
    borderBottomWidth: 1,
  },
  searchList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomLeftRadius: scale(6),
    borderBottomRightRadius: scale(6),
    padding: scale(16),
    backgroundColor: '#fff',
    paddingLeft: 0,
  },
  number: {
    color: Colors.Primary_Color,
  },
  sportIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
  },
});
