import { IconSuccess } from '@/assets/icons/Icon';
import { providerController } from '@/controllers';
import { apiURL } from '@/networking';
import { commonSlice } from '@/stores/reducers';
import { ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';

import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import Share from 'react-native-share';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { IProps } from './propState';
import {
  BannerTextStyled,
  CreateTouchStyled,
  NomarlTextStyled,
  styles,
  ViewIconSuccessStyled,
  ViewStyled,
  ViewSuccessContainerStyled,
} from './styles';

const PublishSuccessComponent = (props: IProps) => {
  const dispatch = useDispatch();
  const valueAnim = React.useRef(new Animated.Value(1)).current;

  const startAnim = () => {
    Animated.loop(
      Animated.timing(valueAnim, {
        toValue: scale(248) / scale(125),
        useNativeDriver: true,
        duration: 1000,
      }),
      {
        iterations: -1,
      },
    ).start();
  };

  useEffect(() => {
    startAnim();
  }, []);

  const _navigate = () => {
    dispatch(commonSlice.actions.setPlayStump({ ...props.route?.params?.newStump, maximum: true }));
  };

  const _share = async () => {
    try {
      const newStump = props.route?.params?.newStump;
      const linkTrial = `${apiURL}/stump/socialSharing?url=${'stump://app/consume/' + newStump?.id}&audioUrl=${
        newStump?.file[0]?.filePath
      }&stumpId=${newStump.id}&description=${newStump?.description}&author=${
        newStump?.participants[0]?.user?.displayName
      }`;
      const res_short = await providerController.getShortLinkHelper(linkTrial);
      const shareOptions = {
        title: res_short?.shortLink ?? '',
        url: res_short?.shortLink ?? '',
      };
      await Share.open(shareOptions);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <ContainerStyled>
      <ViewStyled>
        <ViewSuccessContainerStyled>
          <Animated.View
            style={[styles.animateSuccessView, { transform: [{ scaleX: valueAnim }, { scaleY: valueAnim }] }]}
          />
          <ViewIconSuccessStyled>
            <IconSuccess width={scale(125)} height={scale(125)} fill={Colors.Background3} />
          </ViewIconSuccessStyled>
        </ViewSuccessContainerStyled>
        <BannerTextStyled>Published Successfully!</BannerTextStyled>
        <CreateTouchStyled onPress={_navigate}>
          <Icon name="eye-outline" size={scale(22)} color={Colors.dark} />
          <NomarlTextStyled marginLeft={6}>View</NomarlTextStyled>
        </CreateTouchStyled>
        <CreateTouchStyled onPress={_share}>
          <Icon name="share-social-outline" size={scale(22)} color={Colors.dark} />
          <NomarlTextStyled marginLeft={6}>Share</NomarlTextStyled>
        </CreateTouchStyled>
      </ViewStyled>
    </ContainerStyled>
  );
};

export default React.memo(PublishSuccessComponent);
