import DismissKeyboard from '@/containers/components/DismissKeyboard';

import { commonStyles, ContainerStyled } from '@/styles/common';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { IProps } from './propState';
import { TextContentStyled, ViewIconStyled, ViewWrapStyled } from './styles';
import { RECORD_NAVIGATION } from '@/constants';
import { recordSlice } from '@/stores/reducers';
import { scale } from 'react-native-size-scaling';
import { Colors } from '@/theme/colors';
import { IconPlus, IconSchedule } from '@/assets/icons/Icon';

const SecondStep = (props: IProps) => {
  const dispatch = useDispatch();

  const _navigate = (stumpNow: boolean) => () => {
    dispatch(
      recordSlice.actions.setConfig({
        stumpNow,
        postId: props.route.params?.postId,
        matchId: props.route.params?.matchId,
        sportId: props.route.params?.sportId,
        leagueId: props.route.params?.leagueId,
        teamId: props.route.params?.teamId,
        marketId: props.route.params?.marketId,
      }),
    );
    props.navigation.push(RECORD_NAVIGATION.THIRD_STEP);
  };

  return (
    <DismissKeyboard>
      <ContainerStyled>
        <ViewWrapStyled>
          <View style={commonStyles.containerView}>
            <ViewIconStyled onPress={_navigate(true)} backgroundColor={Colors.Lime_Green}>
              <IconPlus />
            </ViewIconStyled>
            <TextContentStyled>STUMP NOW</TextContentStyled>
          </View>
          <View style={[commonStyles.containerView, { marginTop: scale(90) }]}>
            <ViewIconStyled onPress={_navigate(false)} backgroundColor={Colors.Background3}>
              <IconSchedule width={scale(42)} height={scale(48)} />
            </ViewIconStyled>
            <TextContentStyled>SCHEDULE A STUMP</TextContentStyled>
          </View>
        </ViewWrapStyled>
      </ContainerStyled>
    </DismissKeyboard>
  );
};

export default React.memo(SecondStep);
