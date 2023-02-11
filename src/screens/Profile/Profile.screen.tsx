import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { IProfileProps, IUserOrder } from './Profile.prop';
import { styles } from './Profile.style';

import { ORDER_STATUS, ROOT_ROUTES } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { orderController } from '@/controllers/order.conytroller';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/stores';
import { logOut } from '@/stores/thunks/auth.thunk';
import { commonStyles, ContainerStyled } from '@/styles';

export const ProfilePage: React.FC<IProfileProps> = props => {
  const userInfo = useAuth();
  const dispatch = useAppDispatch();

  const [order, setOrder] = React.useState<IUserOrder[]>();

  const getOrder = async () => {
    globalLoading(true);
    try {
      const res: any = await orderController.getOrderByUserId(userInfo?._id);
      setOrder(res.result.orders);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '',
        text2: error.message,
      });
    } finally {
      globalLoading(false);
    }
  };

  React.useEffect(() => {
    getOrder();
  }, []);

  const placedOrder = React.useMemo(() => order?.filter(e => e.status === ORDER_STATUS.PLACED), [order]);
  const deliveredOrder = React.useMemo(() => order?.filter(e => e.status === ORDER_STATUS.DELIVERED), [order]);
  const canceledOrder = React.useMemo(() => order?.filter(e => e.status === ORDER_STATUS.CANCELED), [order]);

  const _logOut = async () => {
    dispatch(logOut({ onEnd: () => props.navigation.push(ROOT_ROUTES.AUTH_NAVIGATION) }));
  };

  return (
    <ContainerStyled>
      <KeyboardAwareScrollView>
        <View style={[styles.profileContainer, commonStyles.shadow, commonStyles.pd_vertical_10]}>
          <Text style={[commonStyles.font_16, commonStyles.border_bottom]}>Đơn mua</Text>
          <View style={[commonStyles.justify_around, commonStyles.flexRow, commonStyles.mt_6]}>
            <TouchableOpacity style={[commonStyles.align_i_center]}>
              <Icon name="package-variant-closed" size={35} />
              <Text style={[commonStyles.font_14]}>Đã đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.align_i_center]}>
              <Icon name="truck-delivery-outline" size={35} />
              <Text style={[commonStyles.font_14]}>Đã giao</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.align_i_center]}>
              <Icon name="archive-cancel-outline" size={35} />
              <Text style={[commonStyles.font_14]}>Đã huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.profileContainer, commonStyles.shadow]}>
          <TouchableOpacity
            style={[
              commonStyles.border_bottom,
              commonStyles.border_top,
              commonStyles.flexRow,
              commonStyles.align_i_center,
            ]}>
            <Icon name="cards-heart-outline" size={scale(25)} />
            <Text style={[commonStyles.font_14, commonStyles.mg_bottom_14, commonStyles.mt_14, commonStyles.m_l_10]}>
              Đã thích
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyles.border_bottom,
              commonStyles.border_top,
              commonStyles.flexRow,
              commonStyles.align_i_center,
            ]}>
            <Icon name="clock-time-five-outline" size={scale(25)} />
            <Text style={[commonStyles.font_14, commonStyles.mg_bottom_14, commonStyles.mt_14, commonStyles.m_l_10]}>
              Đã xem gần đây
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyles.border_bottom,
              commonStyles.border_top,
              commonStyles.flexRow,
              commonStyles.align_i_center,
            ]}>
            <Icon name="face-man-profile" size={scale(25)} />
            <Text style={[commonStyles.font_14, commonStyles.mg_bottom_14, commonStyles.mt_14, commonStyles.m_l_10]}>
              Thiết lập tài khoản
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyles.border_bottom,
              commonStyles.border_top,
              commonStyles.flexRow,
              commonStyles.align_i_center,
            ]}>
            <Icon name="help-circle-outline" size={scale(25)} />
            <Text style={[commonStyles.font_14, commonStyles.mg_bottom_14, commonStyles.mt_14, commonStyles.m_l_10]}>
              Trung tâm trợ giúp
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.profileContainer, commonStyles.shadow]}>
          <TouchableOpacity
            style={[
              commonStyles.border_bottom,
              commonStyles.border_top,
              commonStyles.flexRow,
              commonStyles.align_i_center,
            ]}
            onPress={_logOut}>
            <Icon name="logout-variant" size={scale(25)} />
            <Text style={[commonStyles.font_14, commonStyles.mg_bottom_14, commonStyles.mt_14, commonStyles.m_l_10]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
