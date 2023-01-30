import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const ViewListEmail = styled.View`
  background-color: ${Colors.Light_Gray};
  width: 95%;
  align-self: center;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: ${scale(12)}px;
  padding: ${scale(6)}px;
  margin-top: ${scale(4)}px;
`;

export const InputStyled = styled.TextInput<StyleProps>`
  font-style: normal;
  font-weight: 500;
  font-size: ${scale(14)}px;
  text-align: center;
  align-items: center;
  color: ${Colors.dark};
  width: ${props => `${props.width || 100}%`};
  padding: ${scale(3)}px;
`;
export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Light_Gray,
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: scale(12),
    paddingLeft: scale(6),
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
});
