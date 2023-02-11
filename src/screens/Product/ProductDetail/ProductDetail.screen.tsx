import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';

import { IProduct } from '../Product.prop';
import { IProductDetailProps } from './ProductDetail.prop';
import { ButtonAddToCart, styles, ViewColorProduct, ViewSizeProduct } from './ProductDetail.style';

import { PRODUCT_NAVIGATION } from '@/constants';
import { SIZE } from '@/constants/size';
import { globalLoading } from '@/containers/actions/emitter.action';
import { productController } from '@/controllers/product.controller';
import { TRootState } from '@/stores';
import { setCartItems } from '@/stores/reducers';
import { commonStyles, ContainerStyled } from '@/styles';
import { Colors } from '@/theme/colors';

interface IChooseInfo {
  color: string;
  size: string;
}

export const ProductDetailPage: React.FC<IProductDetailProps> = props => {
  const { navigation, route } = props;

  const dispatch = useDispatch();

  const [product, setProduct] = React.useState<IProduct>();
  const [chooseInfo, setChooseInfo] = React.useState<IChooseInfo>({
    color: '',
    size: '',
  });

  const { cartItems } = useSelector((state: TRootState) => state.cartState);

  const getProducts = async () => {
    globalLoading(true);
    try {
      const productRes: any = await productController.getProduct(route?.params?._id as string);
      setProduct(productRes.product);
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
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?._id]);

  const dataColor = React.useMemo(
    () =>
      product?.quantity
        ?.filter((value, order, self) => order === self.findIndex(t => t.color === value.color))
        .map(e => e.color),
    [product?.quantity],
  );

  const dataSize = React.useMemo(
    () => product?.quantity.filter(value => value.color.includes(chooseInfo.color)).map(e => e.size),
    [chooseInfo.color],
  );

  React.useEffect(() => {
    setChooseInfo({
      ...chooseInfo,
      color: dataColor?.[0] || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataColor]);

  React.useEffect(() => {
    setChooseInfo({
      ...chooseInfo,
      size: dataSize?.[0] || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSize]);

  const handleChooseColor = (color: string) => () => {
    setChooseInfo({
      ...chooseInfo,
      color: color,
    });
  };
  const handleChooseSize = (size: string) => () => {
    setChooseInfo({
      ...chooseInfo,
      size: size,
    });
  };

  const handleAddToCart = () => {
    let payload: any = [
      {
        id: product?._id,
        name: product?.name,
        image: product?.image.url,
        price: product?.price,
        color: chooseInfo?.color,
        size: chooseInfo?.size,
        amount: product?.amount,
        quantity: 1,
      },
    ];

    const cartItemsFilter = cartItems?.filter(
      (e: any) => e.id === payload[0].id && e.color === payload[0].color && e.size === payload[0].size,
    );
    const cartItemsIndex = cartItems?.findIndex(
      (e: any) => e.id === payload[0].id && e.color === payload[0].color && e.size === payload[0].size,
    );

    if (cartItemsFilter && cartItemsFilter.length > 0) {
      payload[0].quantity = cartItemsFilter[0].quantity + 1;
      payload = cartItems?.concat(payload).filter((_: any, index: number) => index !== cartItemsIndex);
    } else {
      payload = cartItems?.concat(payload);
    }
    dispatch(setCartItems(payload));
  };

  const _navigateSizeSelectHTML = () => {
    navigation.navigate(PRODUCT_NAVIGATION.SIZEPRODUCT);
  };

  return (
    <ContainerStyled>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <FastImage style={styles.productImage} source={{ uri: product?.image.url }} resizeMode="cover" />

        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_20, commonStyles.text_capitalize]}>{product?.name}</Text>
          <Text style={[commonStyles.font_20, commonStyles.text_bold]}>{product?.price.toLocaleString()} VND</Text>
        </View>

        <View style={[styles.productInfoContainer, commonStyles.shadow]}>
          <View>
            <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Màu sắc: {chooseInfo.color}</Text>
            <View style={[commonStyles.flexRow, commonStyles.align_i_center]}>
              {dataColor?.map(color => (
                <View
                  key={color}
                  style={
                    chooseInfo.color === color
                      ? [styles.colorChoose, commonStyles.mt_4]
                      : [commonStyles.mt_4, commonStyles.mr_6]
                  }>
                  <ViewColorProduct backgroundColor={color.toLowerCase()} onPress={handleChooseColor(color)} />
                </View>
              ))}
            </View>
          </View>

          <View style={commonStyles.mt_10}>
            <View style={[commonStyles.flexRow, commonStyles.justify_between]}>
              <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Kích cỡ: {chooseInfo.size}</Text>
              <TouchableOpacity
                onPress={_navigateSizeSelectHTML}
                style={[commonStyles.flexRow, commonStyles.align_i_center]}>
                <Icon name="ruler-horizontal" size={18} />
                <Text style={[commonStyles.font_14]}>Bảng kích cỡ</Text>
              </TouchableOpacity>
            </View>
            <View style={[commonStyles.flexRow, commonStyles.align_i_center]}>
              {SIZE.map(size => (
                <View
                  key={size}
                  style={
                    chooseInfo.size === size
                      ? [styles.colorChoose, commonStyles.mt_4]
                      : [commonStyles.mt_4, commonStyles.mr_6]
                  }>
                  <ViewSizeProduct
                    backgroundColor={
                      chooseInfo.size === size
                        ? Colors.Soft_Blue
                        : dataSize?.includes(size)
                        ? Colors.White
                        : Colors.Timberwolf
                    }
                    onPress={handleChooseSize(size)}
                    disabled={!dataSize?.includes(size)}>
                    <Text style={[commonStyles.font_14, chooseInfo.size === size && commonStyles.textWhite]}>
                      {size}
                    </Text>
                  </ViewSizeProduct>
                </View>
              ))}
            </View>
          </View>

          <View style={commonStyles.mt_10}>
            <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Số lượng còn: {product?.amount}</Text>
          </View>

          <View style={commonStyles.mt_10}>
            <Text style={[commonStyles.font_16, commonStyles.text_bold]}>Mô tả:</Text>
            <Text style={[commonStyles.font_14, commonStyles.mt_4]}>{product?.description}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={commonStyles.flexRow}>
        <ButtonAddToCart
          backgroundColor={product?.amount === 0 ? Colors.Timberwolf : Colors.Soft_Blue}
          disabled={product?.amount === 0}
          onPress={handleAddToCart}>
          <Text style={[commonStyles.font_16, commonStyles.textWhite]}>Thêm vào giỏ hàng</Text>
        </ButtonAddToCart>
      </View>
    </ContainerStyled>
  );
};
