import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

import { ICartItems, ICartProps } from './Cart.prop';
import { styles, ViewColorCart, ViewSizeCart } from './Cart.style';

import { CART_NAVIGATION, PRODUCT_NAVIGATION } from '@/constants';
import { TRootState } from '@/stores';
import { setCartItems } from '@/stores/reducers';
import { commonStyles, ContainerStyled } from '@/styles';
import { Colors } from '@/theme/colors';

const RenderProduct = ({
  item,
  index,
  handleMinusPlusItem,
  _navigateProduct,
}: {
  item: ICartItems;
  index: number;
  handleMinusPlusItem: (item: ICartItems, type: 'plus' | 'minus') => void;
  _navigateProduct: (id: string) => void;
}) => {
  return (
    <TouchableOpacity style={[styles.cartContainer, commonStyles.shadow]} onPress={() => _navigateProduct(item.id)}>
      <FastImage style={styles.cartImage} source={{ uri: item.image }} resizeMode="cover" />
      <View style={[commonStyles.m_l_10]}>
        <Text style={[commonStyles.font_16, commonStyles.text_bold]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[commonStyles.flexRow]}>
          <View>
            <Text style={[commonStyles.font_14, commonStyles.mt_6]}>Màu sắc: {item.color}</Text>
            <ViewColorCart backgroundColor={item.color.toLowerCase()} />
          </View>

          <View>
            <Text style={[commonStyles.font_14, commonStyles.mt_6, commonStyles.m_l_10]}>Kích cỡ: {item.size}</Text>
            <ViewSizeCart backgroundColor={Colors.Soft_Blue}>
              <Text style={[commonStyles.font_14, commonStyles.textWhite]}>{item.size}</Text>
            </ViewSizeCart>
          </View>
        </View>

        <Text style={[commonStyles.font_18, commonStyles.text_bold, commonStyles.mt_6]}>
          {item?.price.toLocaleString()} VND
        </Text>

        <View style={[commonStyles.flexRow, commonStyles.align_i_center, commonStyles.mt_6]}>
          <TouchableOpacity style={styles.cartAmountMinus} onPress={() => handleMinusPlusItem(item, 'minus')}>
            <Icon name="minus" size={15} />
          </TouchableOpacity>
          <Text style={[styles.cartAmount, commonStyles.font_14, commonStyles.text_bold]}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.cartAmountPlus}
            onPress={() => handleMinusPlusItem(item, 'plus')}
            disabled={item.quantity === item.amount}>
            <Icon name="plus" size={15} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const CartPage: React.FC<ICartProps> = props => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: TRootState) => state.cartState);

  let cart = cloneDeep(cartItems?.filter(item => item.quantity !== 0));

  const products = React.useMemo(
    () =>
      cart?.map(product => {
        return { subTotal: product.quantity * product.price, subItem: product.quantity };
      }),
    [cart],
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

  const totalItem = React.useMemo(
    () =>
      products
        ?.map(pro => pro.subItem)
        .reduce((pre, cur) => {
          return Number(pre) + Number(cur);
        }, 0),
    [products],
  );

  const handleMinusPlusItem = (product: ICartItems, type: 'plus' | 'minus') => {
    const cartItemsIndex = cart?.findIndex(
      e => e.id === product.id && e.color === product.color && e.size === product.size,
    );

    if (cart) {
      if (type === 'plus') {
        cart[cartItemsIndex!].quantity = cart[cartItemsIndex!].quantity + 1;
      } else {
        cart[cartItemsIndex!].quantity = cart[cartItemsIndex!].quantity - 1;
      }
    }
    dispatch(setCartItems(cart));
  };

  const _navigateProduct = (id: string) => {
    navigation.navigate(PRODUCT_NAVIGATION.DETAILPRODUCT, { _id: id });
  };

  const _navigatePayment = () => {
    navigation.push(CART_NAVIGATION.PAYMENTCART);
  };

  return (
    <ContainerStyled>
      <Animated.FlatList
        data={cart}
        renderItem={({ item, index }) =>
          RenderProduct({
            item,
            index,
            handleMinusPlusItem: (product, type) => handleMinusPlusItem(product, type),
            _navigateProduct: id => _navigateProduct(id),
          })
        }
        keyExtractor={(item: ICartItems, index: number) => item.id + index}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.cartPaymentContainer, commonStyles.flexRow]}>
        <View>
          <Text style={[commonStyles.font_14]}>Tổng thanh toán:</Text>
          <Text style={[commonStyles.font_14, commonStyles.text_bold, commonStyles.text_softBlue]}>
            {totalPrice?.toLocaleString()} VND
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.cartPayment, totalItem === 0 && styles.cartPaymentDisable]}
          onPress={_navigatePayment}
          disabled={totalItem === 0}>
          <Text style={[commonStyles.font_14, commonStyles.text_bold, commonStyles.textWhite]}>
            Mua hàng ({totalItem})
          </Text>
        </TouchableOpacity>
      </View>
    </ContainerStyled>
  );
};
