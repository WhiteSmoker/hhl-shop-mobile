import { Colors } from '@/theme/colors';
import { Appearance, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';

export const TextInputTouchIconStyled = styled.Image`
  background-color: ${Colors.White};
  padding: ${scale(9)}px;
  width: ${scale(14)}px;
  height: ${scale(14)}px;
`;

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.Alto,
    borderWidth: scale(1),
    borderRadius: scale(4),
    backgroundColor: Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(36),
    paddingHorizontal: scale(12),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: Appearance.getColorScheme() === 'dark' ? Colors.Black : Colors.White,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  modalHeder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingTop: scale(15),
  },
  btnCancel: {
    color: Colors.Red,
  },
  btnSelect: {
    color: Colors.San_Marino,
  },
});

export default styles;
