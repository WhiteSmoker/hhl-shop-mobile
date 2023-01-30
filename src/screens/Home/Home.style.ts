import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { scale } from '@/theme/scale';
import { Colors } from '@/theme/colors';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(spacing.s),
    backgroundColor: Colors.Light_grey4,
  },
  imgPost: {
    width: 83,
    height: 83,
    borderWidth: 2,
    borderColor: Colors.Background,
    borderStyle: 'solid',
    borderRadius: 100,
    marginRight: scale(12),
  },
  titlePost: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Colors.Secondary_Color,
    marginBottom: scale(6),
  },
  descriptionPost: {
    fontSize: scale(12),
    lineHeight: scale(18),
    maxWidth: '100%',
    width: '100%',
    color: Colors.Body_3,
    marginBottom: scale(6),
  },
  textData: {
    fontSize: scale(12),
    lineHeight: scale(20),
    color: Colors.Body_3,
  },
  content: {
    flex: 1,
    marginRight: scale(6),
  },
  listTag: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: scale(6),
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
  titleButton: {
    color: Colors.Secondary_Color,
    fontSize: 14,
  },
  titleButtonActive: {
    color: Colors.Background,
  },
  containerFeedStyled: {
    width: '95%',
    alignSelf: 'center',
  },
  listBtnSort: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
});
export const ViewPost = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  background: #fff;
  border-radius: ${scale(6)}px;
  padding: ${scale(12)}px;
  width: 100%;
  margin-bottom: ${scale(16)}px;
`;
export const ViewHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const TextLink = styled.Text`
  font-size: ${scale(12)}px;
  line-height: ${scale(15)}px;
  color: ${Colors.Background};
  margin-right: ${scale(6)}px;
`;

export const ViewWrapStyled = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: ${scale(40)}px;
`;

export const TextMessageStyled = styled.Text`
  text-align: center;
  color: ${Colors.DarkGray};
`;
