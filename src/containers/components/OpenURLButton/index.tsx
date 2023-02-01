import { Colors } from '@/theme/colors';
import React from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { TextComponent } from '../TextComponent';
export const OpenURLButton = React.memo(({ url }: any) => {
  const handlePress = React.useCallback(async () => {
    try {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
      console.log(supported);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        throw new Error('Invalid URL specified.');
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [url]);

  return url ? (
    <Pressable onPress={handlePress}>
      <TextComponent style={styles.textUrl} numberOfLines={1}>
        {url}
      </TextComponent>
    </Pressable>
  ) : null;
});

const styles = StyleSheet.create({
  textUrl: { textDecorationLine: 'underline', color: Colors.Soft_Blue, fontSize: scale(13), lineHeight: scale(22) },
});
