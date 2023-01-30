import { Colors } from '@/theme/colors';
import { ifNotchIphone } from '@/theme/scale';
import React, { useImperativeHandle } from 'react';
import { Animated, Dimensions, Modal, PanResponder, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { styles } from './index.style';

const MAX_HEIGHT = Dimensions.get('window').height;
const MEDIUM_HEIGHT = Dimensions.get('window').height * 0.25;

interface IDragModalProps {
  children: any;
  scrollY: Animated.Value;
  callback?: (currentHeight: string) => void;
}
export interface IDragModalRef {
  onFocus: () => void;
  hide: () => void;
  show: () => void;
}

export const DragModal = React.memo(
  React.forwardRef<IDragModalRef, IDragModalProps>(({ children, scrollY, callback }, ref) => {
    const [show, setShow] = React.useState(false);
    const scrollVertical = React.useRef(new Animated.Value(MAX_HEIGHT)).current;
    const currentHeight = React.useRef('MEDIUM_HEIGHT');
    const isTranslatingToTop = React.useRef(false);
    const offModal = () => {
      setShow(false);
    };

    const aniSpring = (toValue: number, newHeight: string) => {
      Animated.spring(scrollVertical, {
        toValue,
        bounciness: 1,
        useNativeDriver: true,
      }).start(cb => {
        console.log('end');
        currentHeight.current = newHeight;
        callback(newHeight);
        isTranslatingToTop.current = false;
        if (newHeight === 'MIN_HEIGHT') {
          offModal();
        }
      });
    };

    React.useEffect(() => {
      scrollY.addListener(({ value }) => {
        if (value > scale(100) && value < scale(110) && !isTranslatingToTop.current) {
          isTranslatingToTop.current = true;
          aniSpring(0, 'MAX_HEIGHT');
        }
      });
      return () => {
        scrollY.removeAllListeners();
      };
    }, [scrollY]);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, gestureState) => {
        const { dy } = gestureState;
        if (dy < 0) {
          return;
        }

        if (dy < 0 && currentHeight.current === 'MAX_HEIGHT') {
          return;
        }
        if (dy <= -(MAX_HEIGHT * 0.33) && currentHeight.current === 'MEDIUM_HEIGHT') {
          return;
        }
        scrollVertical.setOffset(gestureState.dy);
      },
      onPanResponderRelease: (_e, gestureState) => {
        const { dy, vy } = gestureState;
        switch (currentHeight.current) {
          case 'MEDIUM_HEIGHT':
            if (dy > 0) {
              if (dy > MAX_HEIGHT / 4) {
                aniSpring(MAX_HEIGHT, 'MIN_HEIGHT');
              } else {
                aniSpring(MEDIUM_HEIGHT, 'MEDIUM_HEIGHT');
              }
            } else {
              aniSpring(0, 'MAX_HEIGHT');
            }

            break;
          case 'MAX_HEIGHT':
            if (dy > 0) {
              if (vy > 0.25 && dy > scale(75)) {
                aniSpring(MAX_HEIGHT, 'MIN_HEIGHT');
                break;
              }

              if (dy >= MEDIUM_HEIGHT) {
                aniSpring(MAX_HEIGHT, 'MIN_HEIGHT');
                break;
              }
              if (dy > scale(100)) {
                aniSpring(MEDIUM_HEIGHT, 'MEDIUM_HEIGHT');
                break;
              }
              aniSpring(0, 'MAX_HEIGHT');
            }
            break;
          default:
            break;
        }

        scrollVertical.flattenOffset();
      },
    });

    useImperativeHandle(ref, () => {
      return {
        show: () => {
          setShow(true);
          aniSpring(MEDIUM_HEIGHT, 'MEDIUM_HEIGHT');
        },
        hide: () => {
          setShow(false);
        },
        onFocus: () => {
          aniSpring(0, 'MAX_HEIGHT');
        },
      };
    });

    return (
      <Modal animationType="fade" visible={show} transparent={true}>
        <TouchableOpacity onPress={offModal} style={{ backgroundColor: Colors.greyOpacity, flex: 1 }} />
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: ifNotchIphone(scale(44), scale(24)),
            flex: 1,
            zIndex: 1,
            transform: [{ translateY: scrollVertical }],
          }}>
          <View style={styles.containerDragModal}>
            <View {...panResponder.panHandlers}>
              <TouchableOpacity activeOpacity={1} style={styles.w100}>
                <View style={styles.handleBar} />
              </TouchableOpacity>
            </View>
            {children}
          </View>
        </Animated.View>
      </Modal>
    );
  }),
);
