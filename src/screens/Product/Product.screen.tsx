import React from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';

import { ICategory, IProduct, IProductProps } from './Product.prop';
import { styles, TetxSizeProduct, ViewColorProduct } from './Product.style';

import { IconSearch } from '@/assets/icons/Icon';
import { PRODUCT_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { categoryController } from '@/controllers/category.controller';
import { productController } from '@/controllers/product.controller';
import { commonStyles, ContainerStyled } from '@/styles';

const ReanderHeaderCategory = ({
  categoryId,
  handleChangeCategory,
}: {
  categoryId: string;
  handleChangeCategory: (category: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.categoryButton, categoryId === '' && styles.categoryChoose]}
      onPress={() => handleChangeCategory('')}>
      <Text style={[styles.categotyTypo, categoryId === '' && styles.categoryChoose]}>Tất cả</Text>
    </TouchableOpacity>
  );
};

const RenderCategory = ({
  item,
  index,
  categoryId,
  handleChangeCategory,
}: {
  item: ICategory;
  index: number;
  categoryId: string;
  handleChangeCategory: (category: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.categoryButton, categoryId === item._id && styles.categoryChoose]}
      onPress={() => handleChangeCategory(item._id)}>
      <Text style={[styles.categotyTypo, categoryId === item._id && styles.categoryChoose]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const RenderProduct = ({
  item,
  index,
  handlePress,
}: {
  item: IProduct;
  index: number;
  handlePress: (_id: string) => void;
}) => {
  const dataColor = item.quantity
    ?.filter((value, order, self) => order === self.findIndex(t => t.color === value.color))
    .map(e => e.color.toLowerCase());

  const dataSize = item.quantity
    ?.filter((value, order, self) => order === self.findIndex(t => t.size === value.size))
    .map(e => e.size.toUpperCase());

  return (
    <TouchableOpacity style={[styles.productItem, commonStyles.shadow]} onPress={() => handlePress(item._id)}>
      <FastImage style={styles.productImage} source={{ uri: item.image.url }} resizeMode="cover" />
      <View style={commonStyles.pd_4}>
        <View style={styles.productColorSize}>
          <View style={commonStyles.flexRow}>
            {dataColor.map(color => (
              <ViewColorProduct key={color} backgroundColor={color} />
            ))}
          </View>
          <View style={commonStyles.flexRow}>
            {dataSize.map(size => (
              <TetxSizeProduct key={size}>{size}</TetxSizeProduct>
            ))}
          </View>
        </View>
        <Text style={[commonStyles.font_14, commonStyles.text_capitalize, commonStyles.mg_bottom_10]}>{item.name}</Text>
        <Text style={[commonStyles.font_16, commonStyles.mg_bottom_10]}>{item.price.toLocaleString()} VND</Text>
        {item.amount === 0 && <Text style={commonStyles.font_14}>Hết hàng</Text>}
      </View>
    </TouchableOpacity>
  );
};

export const ProductPage: React.FC<IProductProps> = props => {
  const { navigation } = props;

  const [inputSearch, setInputSearch] = React.useState({
    keyword: '',
    categoryId: '',
  });
  const [categories, setCategories] = React.useState<ICategory[]>();
  const [products, setProducts] = React.useState<IProduct[]>();

  const transtaleYValue = React.useRef(new Animated.Value(scale(1000))).current;
  const transtaleXValueExit = React.useRef(new Animated.Value(scale(300))).current;
  const opacityValueExit = React.useRef(new Animated.Value(1)).current;

  const getCategories = async () => {
    globalLoading(true);
    try {
      const listCategory: any = await categoryController.getCategories();
      setCategories(listCategory.result.categories);
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

  const getProducts = async (keyword?: string, categoryId?: string) => {
    globalLoading(true);
    try {
      const listProduct: any = await productController.getProducts(keyword, categoryId);
      setProducts(listProduct.result.products);
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
    getCategories();
    getProducts();
  }, []);

  const handlePressProduct = (_id: string) => {
    navigation.push(PRODUCT_NAVIGATION.DETAILPRODUCT, { _id: _id });
  };

  const handleChageInput = (event: string) => {
    setInputSearch({ ...inputSearch, keyword: event });
  };

  const handleKeyPressInput = () => {
    getProducts(inputSearch.keyword, inputSearch.categoryId);
  };

  const handleChangeCategory = (category: string) => {
    setInputSearch({ ...inputSearch, categoryId: category });
    getProducts(inputSearch.keyword, category);
  };

  const focusHandler = () => {
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(0),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
  };

  const blurHandler = () => {
    Animated.parallel([
      Animated.spring(transtaleYValue, {
        toValue: scale(1000),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.spring(transtaleXValueExit, {
        toValue: scale(100),
        useNativeDriver: true,
        friction: 10,
        tension: 30,
      }),
      Animated.timing(opacityValueExit, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
  };

  return (
    <ContainerStyled>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <IconSearch />
          <TextInput
            style={styles.searchInput}
            value={inputSearch.keyword}
            placeholder="Search"
            onFocus={focusHandler}
            onBlur={blurHandler}
            onChangeText={handleChageInput}
            onSubmitEditing={handleKeyPressInput}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Animated.FlatList
            data={categories}
            renderItem={({ item, index }) =>
              RenderCategory({
                item,
                index,
                categoryId: inputSearch.categoryId,
                handleChangeCategory: category => handleChangeCategory(category),
              })
            }
            ListHeaderComponent={ReanderHeaderCategory({
              categoryId: inputSearch.categoryId,
              handleChangeCategory: category => handleChangeCategory(category),
            })}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.productContainer}>
          <Animated.FlatList
            data={products}
            renderItem={({ item, index }) =>
              RenderProduct({ item, index, handlePress: _id => handlePressProduct(_id) })
            }
            contentContainerStyle={{ paddingBottom: 250 }}
            numColumns={2}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View />
      </View>
    </ContainerStyled>
  );
};
