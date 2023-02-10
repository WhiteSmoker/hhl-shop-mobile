import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { ICartItems } from '../Cart.prop';
import { ICartPaymentProps } from './CartPayment.props';
import { styles, TextErrorStyled, TextInputStyled } from './CartPayment.style';

import { IconTickRadio, IconUntickRadio } from '@/assets/icons/Icon';
import { APP_NAVIGATION, CART_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { orderController } from '@/controllers/order.conytroller';
import { useAuth } from '@/hooks/useAuth';
import { TRootState } from '@/stores';
import { setCartItems } from '@/stores/reducers';
import { commonStyles, ContainerStyled } from '@/styles';

const schema = Yup.object().shape({
  customerName: Yup.string().required('Vui lòng nhập Họ và Tên'),
  address: Yup.string().required('Vui lòng nhập Địa chỉ'),
  phoneNumber: Yup.string().required('Vui lòng nhập Số điện thoại'),
});

const RenderProduct = ({ item, index }: { item: ICartItems; index: number }) => {
  return (
    <View style={[styles.paymentContainer]}>
      <FastImage style={styles.cartPaymentImage} source={{ uri: item.image }} resizeMode="cover" />
      <View style={[commonStyles.m_l_10]}>
        <Text style={[commonStyles.font_16, commonStyles.text_bold]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[commonStyles.flexRow]}>
          <Text style={[commonStyles.font_14, commonStyles.mt_6]}>Màu sắc: {item.color}</Text>
          <Text style={[commonStyles.font_14, commonStyles.mt_6, commonStyles.m_l_10]}>Kích cỡ: {item.size}</Text>
        </View>
        <Text style={[commonStyles.font_14, commonStyles.mt_6]}>Số lượng: {item.quantity}</Text>
      </View>
    </View>
  );
};

export const CartPaymentPage: React.FC<ICartPaymentProps> = props => {
  const { navigation } = props;
  const userInfo = useAuth();
  const dispatch = useDispatch();

  const [paymentType, setPaymentType] = React.useState<'cod' | 'card'>('cod');

  const { cartItems } = useSelector((state: TRootState) => state.cartState);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<{ customerName: string; address: string; phoneNumber: string }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const products = React.useMemo(
    () =>
      cartItems?.map(product => {
        return { subTotal: product.quantity * product.price, subItem: product.quantity };
      }),
    [cartItems],
  );

  const totalPrice = React.useMemo(
    () =>
      products
        ?.map(pro => pro.subTotal)
        .reduce((pre, cur) => {
          return Number(pre) + Number(cur);
        }, 0),
    [products],
  );

  const handlePayment = async (info: { customerName: string; address: string; phoneNumber: string }) => {
    globalLoading(true);
    try {
      const payload = {
        ...info,
        customerId: userInfo._id,
        products: cartItems?.map(item => {
          return {
            _id: item.id,
            color: item.color,
            size: item.size,
            amount: item.quantity,
          };
        }),
      };
      const res: any = await orderController.createOrder(payload);
      if (res.success) {
        Toast.show({
          type: 'info',
          text1: 'Bạn đã đặt hàng thành công!',
          text2: '',
        });
        dispatch(setCartItems([]));
        navigation.navigate(CART_NAVIGATION.ITEMSCART);
      }
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

  const handleSelectPayment = (payment: 'cod' | 'card') => () => {
    setPaymentType(payment);
  };

  return (
    <ContainerStyled>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.paymentInput, commonStyles.shadow]}>
          <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Thông tin thanh toán</Text>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputStyled
                autoCapitalize="none"
                keyboardType={'default'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Họ và Tên"
              />
            )}
            name="customerName"
            defaultValue={userInfo?.fullName || ''}
          />
          {errors.customerName && <TextErrorStyled>{errors.customerName?.message ?? ' '}</TextErrorStyled>}

          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputStyled
                keyboardType={'default'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Địa chỉ"
              />
            )}
            name="address"
            defaultValue={userInfo?.address || ''}
          />
          {errors.address && <TextErrorStyled>{errors.address?.message ?? ' '}</TextErrorStyled>}

          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputStyled
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Số điện thoại"
              />
            )}
            name="phoneNumber"
            defaultValue={userInfo?.phoneNumber || ''}
          />
          {errors.phoneNumber && <TextErrorStyled>{errors.phoneNumber?.message ?? ' '}</TextErrorStyled>}
        </View>

        <View style={[styles.paymentInput, commonStyles.shadow]}>
          <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Thông tin sản phẩm</Text>
          <Animated.FlatList
            data={cartItems}
            renderItem={({ item, index }) => RenderProduct({ item, index })}
            keyExtractor={(item: ICartItems, index: number) => item.id + index}
            horizontal={false}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[styles.paymentInput, commonStyles.shadow]}>
          <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Phương thức thanh toán </Text>
          <TouchableOpacity
            style={[commonStyles.flexRow, commonStyles.align_i_center, styles.paymentChoose]}
            onPress={handleSelectPayment('cod')}>
            {paymentType === 'cod' ? <IconTickRadio /> : <IconUntickRadio />}
            <View style={[commonStyles.flexRow, commonStyles.align_i_center, commonStyles.m_l_10]}>
              <Icon name="money" size={20} />
              <Text style={[commonStyles.font_14, commonStyles.m_l_10]}>Thanh toán khi giao hàng</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonStyles.flexRow, commonStyles.align_i_center, styles.paymentChoose]}
            onPress={handleSelectPayment('card')}>
            {paymentType === 'card' ? <IconTickRadio /> : <IconUntickRadio />}
            <View style={[commonStyles.flexRow, commonStyles.align_i_center, commonStyles.m_l_10]}>
              <Icon name="credit-card" size={20} />
              <Text style={[commonStyles.font_14, commonStyles.m_l_10]}>Thẻ tín dụng ghi nợ</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.paymentInput, commonStyles.shadow]}>
          <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Chi tiết thanh toán</Text>
          <View style={[commonStyles.flexRow, commonStyles.justify_between, commonStyles.mt_6]}>
            <Text style={[commonStyles.font_14]}>Tổng tiền hàng</Text>
            <Text style={[commonStyles.font_14]}>{totalPrice?.toLocaleString()} VND</Text>
          </View>
          <View style={[commonStyles.flexRow, commonStyles.justify_between, commonStyles.mt_6]}>
            <Text style={[commonStyles.font_14]}>Tổng tiền phí vận chuyển</Text>
            <Text style={[commonStyles.font_14]}>0 VND</Text>
          </View>
          <View style={[commonStyles.flexRow, commonStyles.justify_between, commonStyles.mt_6]}>
            <Text style={[commonStyles.font_16]}>Tổng thanh toán</Text>
            <Text style={[commonStyles.font_16, commonStyles.text_bold, commonStyles.text_softBlue]}>
              {totalPrice?.toLocaleString()} VND
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={[styles.cartPaymentContainer, commonStyles.flexRow]}>
        <View>
          <Text style={[commonStyles.font_14]}>Tổng thanh toán:</Text>
          <Text style={[commonStyles.font_16, commonStyles.text_bold, commonStyles.text_softBlue]}>
            {totalPrice?.toLocaleString()} VND
          </Text>
        </View>
        <TouchableOpacity style={styles.paymentButton} onPress={handleSubmit(handlePayment)}>
          <Text style={[commonStyles.font_14, commonStyles.text_bold, commonStyles.textWhite]}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </ContainerStyled>
  );
};
