module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/', 'react-native-vector-icons'],
};
module.exports = {
  dependencies: {
    'react-native-video': {
      platforms: { android: { sourceDir: '../node_modules/react-native-video/android-exoplayer' } },
    },
  },
};
