import React from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-scaling';
import IconFont from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { IProduct } from '../Product/Product.prop';
import { styles } from '../Product/ProductDetail/ProductDetail.style';

import { globalLoading } from '@/containers/actions/emitter.action';
import { productController } from '@/controllers/product.controller';
import { commonStyles, ContainerStyled } from '@/styles';

export const HomePage: React.FC = props => {
  const [products, setProducts] = React.useState<IProduct[]>();

  const getProducts = async (keyword?: string, categoryId?: string) => {
    globalLoading(true);
    try {
      const listProduct: any = await productController.getProducts(keyword, categoryId);
      setProducts(listProduct.result.products);
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading(false);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, []);

  return (
    <ContainerStyled>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            commonStyles.font_20,
            commonStyles.text_bold,
            commonStyles.mg_bottom_14,
            commonStyles.mt_14,
            commonStyles.text_softBlue,
            commonStyles.selfCenter,
          ]}>
          Sản phẩm mới
        </Text>

        <FastImage style={styles.productImage} source={{ uri: products?.[0].image.url }} resizeMode="cover" />

        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_20, commonStyles.text_capitalize]}>{products?.[0].name}</Text>
          <Text style={[commonStyles.font_20, commonStyles.text_bold]}>{products?.[0].price.toLocaleString()} VND</Text>
        </View>

        <FastImage style={styles.productImage} source={{ uri: products?.[1].image.url }} resizeMode="cover" />

        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_20, commonStyles.text_capitalize]}>{products?.[1].name}</Text>
          <Text style={[commonStyles.font_20, commonStyles.text_bold]}>{products?.[1].price.toLocaleString()} VND</Text>
        </View>

        <FastImage style={styles.productImage} source={{ uri: products?.[2].image.url }} resizeMode="cover" />

        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_20, commonStyles.text_capitalize]}>{products?.[2].name}</Text>
          <Text style={[commonStyles.font_20, commonStyles.text_bold]}>{products?.[2].price.toLocaleString()} VND</Text>
        </View>
        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter, commonStyles.text_bold]}>
            Tại sao bạn nên mua hàng tại HHL Shop ?
          </Text>
        </View>

        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter, commonStyles.text_bold]}>
            Giao hàng miễn phí
          </Text>
          <View style={[commonStyles.selfCenter, commonStyles.mt_10, commonStyles.mg_bottom_10]}>
            <Icon name="truck-delivery-outline" size={scale(35)} />
          </View>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter]}>
            Tất cả các đơn hàng , hóa đơn có giá trị hơn 1tr đều được miễn phí giao hàng
          </Text>
        </View>
        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter, commonStyles.text_bold]}>
            Quy trình thanh toán dễ dàng
          </Text>
          <View style={[commonStyles.selfCenter, commonStyles.mt_10, commonStyles.mg_bottom_10]}>
            <Icon name="credit-card" size={scale(35)} />
          </View>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter]}>
            Tất cả các khoản thanh toán được xử lý ngay lập tức , chúng tôi luôn mang lại sự hài lòng nhất đối với khách
            hàng.
          </Text>
        </View>
        <View style={[styles.productNameContainer, commonStyles.shadow]}>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter, commonStyles.text_bold]}>
            Đảm bảo quyền lợi khách hàng
          </Text>
          <View style={[commonStyles.selfCenter, commonStyles.mt_10, commonStyles.mg_bottom_10]}>
            <Icon name="shield" size={scale(35)} />
          </View>
          <Text style={[commonStyles.font_14, commonStyles.selfCenter]}>
            Hoàn trả lại tiền nếu như sản phẩm không đúng mẫu , như quảng cáo
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </ContainerStyled>
  );
};
