import { Colors } from '@/theme/colors';
import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import styled from 'styled-components/native';
import { StyleProps, StyleTimerProps } from './propState';

export const TextTitleStyled = styled.Text`
  color: ${Colors.dark};
  font-size: ${scale(14)}px;
  line-height: ${scale(16)}px;
  margin-top: ${scale(Platform.OS === 'ios' ? 16 : 0)}px;
`;
export const ViewStyled = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${scale(0)}px;
  padding-bottom: ${scale(10)}px;
`;

export const WrapViewStyled = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: ${scale(216)}px;
  height: ${scale(256)}px;
  margin-top: ${scale(10)}px;
`;

export const ViewParticipantStyled = styled.View`
  align-items: center;
`;

export const ViewStatusStyled = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${scale(10)}px;
  height: ${scale(20)}px;
`;

export const NameStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.Light_Gray};
  font-size: ${scale(11)}px;
  font-family: Lexend-Bold;
  line-height: ${scale(16)}px;
  width: ${(props: StyleProps) => scale(props.width || 50)}px;
  text-align: center;
`;

export const BigTextStyled = styled.Text<StyleProps>`
  color: ${(props: StyleProps) => props.color || Colors.Light_Gray};
  font-size: ${scale(14)}px;
  font-family: Lexend-Bold;
  line-height: ${scale(16)}px;
  text-align: center;
`;

export const ViewEmpty = styled.View`
  height: ${scale(48 + 16)}px;
  background-color: transparent;
`;

export const ViewFunctionStyled = styled.View`
  justify-content: space-between;
  align-items: center;
  margin-top: ${scale(16)}px;
  width: 100%;
`;

export const ViewAudioStyled = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${scale(195)}px;
  margin-vertical: ${scale(16)}px;
  height: ${scale(36)}px;
`;

export const TouchStartStyled = styled.TouchableOpacity`
  padding-vertical: ${scale(16)}px;
  margin-bottom: ${scale(16)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${scale(8)}px;
  background-color: ${Colors.Background};
  width: ${scale(195)}px;
  height: ${scale(48)}px;
`;

export const OfflineLayout = styled.View<StyleProps>`
  position: absolute;
  background-color: ${Colors.Dark_70};
  width: ${(props: StyleProps) => scale(props.width || 100)}px;
  height: ${(props: StyleProps) => scale(props.width || 100)}px;
  z-index: 1;
`;

export const TextInputStyled = styled.TextInput<StyleProps>`
  margin-top: ${scale(8)}px;
  font-style: normal;
  font-weight: normal;
  font-size: ${scale(14)}px;
  line-height: ${scale(20)}px;
  color: ${Colors.Emperor};height
  border-radius: ${scale(5)}px;
  height: ${(props: StyleProps) => scale(props.height || 150)}px;
  padding: 0 ${scale(8)}px;
  text-align-vertical: top;
`;

export const ViewTimerStyled = styled.View<StyleTimerProps>`
  border-width: ${scale(4)}px;
  border-color: ${(props: StyleTimerProps) => props.color || Colors.Background};
  border-radius: ${scale(10)}px;
  margin-horizontal: ${scale(20)}px;
  padding-horizontal: ${scale(32)}px;
  padding-vertical: ${scale(12)}px;
  margin-top: ${scale(16)}px;
  justify-content: center;
  align-items: center;
`;
export const TextTimerStyled = styled.Text`
  color: ${Colors.blackOriginal};
  font-size: ${scale(34)}px;
  text-transform: uppercase;
`;

export const TextRecordingStyled = styled.Text`
  color: ${Colors.blackOriginal};
  font-size: ${scale(10)}px;
  font-family: Lexend-Bold;
  text-transform: uppercase;
`;

export const styles = StyleSheet.create({
  btnResume: {
    width: '45%',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: scale(1),
    paddingVertical: scale(14),
    backgroundColor: Colors.Background,
    marginVertical: scale(8),
    borderRadius: scale(6),
    marginRight: scale(16),
  },
  btnSchedule: {
    width: '45%',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: scale(1),
    paddingVertical: scale(14),
    backgroundColor: Colors.LightGray,
    marginVertical: scale(8),
    borderRadius: scale(6),
    marginRight: scale(16),
  },
  btnCancel: {
    width: '45%',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: scale(1),
    paddingVertical: scale(14),
    backgroundColor: 'transparent',
    marginVertical: scale(8),
    borderRadius: scale(6),
    marginRight: scale(16),
  },
  viewResume: {
    width: '100%',
    backgroundColor: Colors.Very_Light_Gray,
    justifyContent: 'center',
    alignItems: 'flex-end',
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: 12,
    elevation: Platform.OS === 'ios' ? 2 : 3,
    zIndex: 1,
    borderTopRightRadius: scale(10),
    borderTopLeftRadius: scale(10),
  },
  absoluteClock: {
    position: 'absolute',
    zIndex: 1,
    right: scale(25),
  },
  aniViewSchedule: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSchedule: {
    width: '95%',
    backgroundColor: Colors.Very_Light_Gray,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.8,
    shadowRadius: Platform.OS === 'ios' ? 12 : 15,
    elevation: Platform.OS === 'ios' ? 2 : 4,
    borderRadius: scale(16),
    padding: scale(8),
  },
  bigText: { fontSize: scale(26), lineHeight: scale(38), marginRight: scale(16) },
  shadowInput: {
    backgroundColor: Colors.White,
    shadowColor: '#00000033',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderRadius: scale(6),
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.5,
    shadowRadius: 12,
    elevation: Platform.OS === 'ios' ? 2 : 5,
    width: '100%',
    alignSelf: 'center',
    marginBottom: scale(15),
    marginTop: scale(12),
    zIndex: 1,
  },
  tickOnline: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(15),
    backgroundColor: Colors.Background3,
    marginLeft: scale(3),
  },
});
