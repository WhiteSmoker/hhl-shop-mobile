import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PRODUCT_NAVIGATION } from '@/constants';
import { ProductDetailPage, ProductPage, ProductSizeSelectPage } from '@/screens';

export type ProductStackParam = {
  [PRODUCT_NAVIGATION.ALLPRODUCT]: undefined;
  [PRODUCT_NAVIGATION.DETAILPRODUCT]: { _id: string };
  [PRODUCT_NAVIGATION.SIZEPRODUCT]: undefined;
};
const Stack = createNativeStackNavigator<ProductStackParam>();

const ProductNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={PRODUCT_NAVIGATION.ALLPRODUCT} screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen
        name={PRODUCT_NAVIGATION.ALLPRODUCT}
        component={ProductPage}
        options={({ route, navigation }) => ({
          header: () => null,
          // (
          //   <RootHeader
          //     showArrow={true}
          //     hideRight={false}
          //     route={route}
          //     navigation={navigation}
          //     screen={HOME_NAVIGATION.NEW_FEED}
          //   />
          // ),
        })}
      />
      <Stack.Screen name={PRODUCT_NAVIGATION.DETAILPRODUCT} component={ProductDetailPage} />
      <Stack.Screen name={PRODUCT_NAVIGATION.SIZEPRODUCT} component={ProductSizeSelectPage} />
    </Stack.Navigator>
  );
};

export default React.memo(ProductNavigator);
