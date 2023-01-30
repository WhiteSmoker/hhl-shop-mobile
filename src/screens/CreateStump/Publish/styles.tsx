import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps } from './propState';

export const styles = StyleSheet.create({
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
  viewButton: {
    width: '70%',
    marginTop: scale(30),
    marginBottom: scale(16),
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  viewButtonEdit: {
    backgroundColor: Colors.Background,
    width: '35%',
    borderRadius: scale(16),
    marginTop: scale(30),
    marginBottom: scale(16),
    alignItems: 'center',
    alignSelf: 'center',
  },
});
export const TextTitleStyled = styled.Text<StyleProps>`
  color: ${Colors.dark};
  font-size: ${scale(17)}px;
  font-weight: ${(props: StyleProps) => props.fontWeight || 'bold'};
  line-height: ${scale(22)}px;
  padding-top: ${scale(12)}px;
  padding-bottom: ${scale(2)}px;
`;

export const SmallTextStyled = styled.Text`
  color: ${Colors.Dark_Gray1};
  font-size: ${scale(14)}px;
  line-height: ${scale(22)}px;
  font-weight: normal;
  margin-right: ${scale(6)}px;
  margin-top: ${scale(4)}px;
`;
export const NomarlTextStyled = styled.Text`
  color: ${Colors.White};
  font-size: ${scale(15)}px;
  line-height: ${scale(15)}px;
  font-weight: normal;
  text-transform: uppercase;
  padding-vertical: ${scale(11)}px;
`;

export const ImageStyled = styled(FastImage)`
  width: ${scale(60)}px;
  height: ${scale(60)}px;
  margin-right: ${scale(10)}px;
  border-radius: ${scale(60)}px;
`;

export const ViewStyled = styled.View`
  flex: 1;
  padding-horizontal: ${scale(24)}px;
  justify-content: space-between;
`;

export const ViewTextInputStyled = styled.View`
  background-color: ${Colors.White};
  border-radius: ${scale(6)}px;
  padding-horizontal: ${scale(12)}px;
`;

export const TextInputStyled = styled.TextInput`
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  color: ${Colors.Emperor};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
`;

export const CreateTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Background};
  border-radius: ${scale(16)}px;
  width: 45%;
  align-items: center;
`;

export const PublishTouchStyled = styled.TouchableOpacity<StyleProps>`
  background-color: ${(props: StyleProps) => props.backgroundColor || Colors.Background};
  border-radius: ${scale(16)}px;
  width: 45%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const ViewParticipantStyled = styled.View`
  flex-direction: row;
  margin-top: ${scale(10)}px;
`;

export const ViewPublishStyled = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${scale(24)}px;
`;
export const ViewTwitterStyled = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const TextErrorStyled = styled.Text`
  font-size: ${scale(12)}px;
  line-height: ${scale(14)}px;
  font-style: italic;
  color: ${Colors.Pure_Orange};
  padding-top: ${scale(6)}px;
`;

export const ViewInputTag = styled.View`
  width: 100%;
  align-self: center;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: ${scale(20)}px;
  padding-horizontal: ${scale(12)}px;
`;

export const ViewDateTime = styled.View`
  flex-direction: row;
  align-items: center;
`;
