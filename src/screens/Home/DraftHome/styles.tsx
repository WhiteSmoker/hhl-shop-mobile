import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyledProps } from './propState';

export const TextTitleStyled = styled.Text<StyledProps>`
  font-size: ${scale(17)}px;
  line-height: ${scale(18)}px;
  color: ${Colors.Black};
  font-family: Lexend-Bold;
  margin-top: ${(props: StyledProps) => scale(props.marginTop || 0)}px;
  margin-bottom: ${scale(10)}px;
`;

export const TextMessageStyled = styled.Text`
  text-align: center;
  color: ${Colors.Black};
  font-size: ${scale(16)}px;
`;

const styles = StyleSheet.create({
  headerCenter: {
    fontSize: scale(18),
    color: Colors.white,
  },
  bottomNavigation: {
    height: scale(63),
    borderStyle: 'solid',
    paddingLeft: scale(5),
  },
  fullTabLabelStyle: {
    fontSize: scale(13),
    color: Colors.manatee,
  },
  w_70: {
    width: scale(70),
    flex: 0,
    marginRight: scale(10),
  },
  text_right: {
    textAlign: 'right',
  },
  text_center: {
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'column',
  },
  itemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(5),
    paddingHorizontal: scale(10),
  },
  itemTitleText: {
    fontSize: scale(15),
    color: Colors.primaryColor,
    flex: 1,
    flexWrap: 'wrap',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRowColumnFirst: {
    flexDirection: 'column',
  },
  itemRowColumn: {
    flexDirection: 'column',
    paddingRight: scale(30),
  },
  itemRowHeader: {
    fontSize: scale(13),
    paddingVertical: scale(5),
  },
  itemRowDetail: {
    fontSize: scale(11),
    color: Colors.borderColor2,
    textAlign: 'center',
    padding: 0,
  },
  divider: {
    backgroundColor: Colors.borderColor,
    height: scale(1),
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: scale(15),
  },
  btnTouch: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: scale(16), color: Colors.manatee },
});

export default styles;
