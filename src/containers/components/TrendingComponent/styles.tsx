import { spacing } from '@/theme';
import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  imgPostTrending: {
    width: 131,
    height: 131,
    borderRadius: scale(6),
    marginLeft: scale(12),
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
  content: {
    flex: 1,
    marginRight: scale(6),
  },
  viewNumber: {
    borderRadius: 100,
    width: 36,
    height: 36,
    backgroundColor: Colors.Background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  time: {
    fontSize: 10,
    color: Colors.Body_3,
    textAlign: 'right',
  },
  scoreNumber: {
    fontSize: 10,
    lineHeight: scale(18),
    color: Colors.Body_3,
    textAlign: 'right',
    paddingTop: scale(4),
  },
  teamIcon: {
    width: scale(18),
    height: scale(18),
  },
  scoreItem: {
    borderRightColor: Colors.Light_grey5,
    borderRightWidth: 1,
    borderStyle: 'solid',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    minWidth: 125,
  },
  scoreItemLast: {
    borderRightWidth: 0,
  },
  scoreName: {
    fontSize: 12,
    color: Colors.blackOriginal,
    marginLeft: scale(6),
  },
  borderTop: {
    borderTopColor: Colors.Light_grey6,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
});

export const ViewTrending = styled.View`
  margin-top: ${scale(16)}px;
  margin-bottom: ${scale(16)}px;
  // background-color: ${Colors.white};
`;

export const ViewContainerPostCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  background: #fff;
  border-radius: ${scale(6)}px;
  padding: ${scale(16)}px;
  width: 100%;
`;

export const ViewContainerScore = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  border-radius: ${scale(6)}px;
  padding-horizontal: ${scale(6)}px;
  padding-vertical: ${scale(16)}px;
  margin-right: -10px;
  margin-left: -10px;
  width: 100%;
`;
export const ViewHorizontal = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${scale(3)}px;
`;
