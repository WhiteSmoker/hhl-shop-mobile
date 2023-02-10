import React from 'react';
import { WebView } from 'react-native-webview';

export const ProductSizeSelectPage: React.FC = props => {
  return <WebView source={{ uri: 'https://www.uniqlo.com/vn/vi/size/458186_size.html' }} />;
};
