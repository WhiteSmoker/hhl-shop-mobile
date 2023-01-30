import React, { useMemo, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { scale } from 'react-native-size-scaling';

const WIDTH_DROPDOWN = scale(111);

interface Props {
  data: string[];
  mode: 'center' | 'left' | 'right';
  offsetY?: number;
  offsetX?: number;
  widthDropdown?: number;
  widthAnchor?: number;
  renderAnchor: () => JSX.Element;
  selectedItem: string;
  onChangeItem: (item: string) => void;
}

export const DropdownCategory = ({
  data,
  selectedItem,
  renderAnchor,
  onChangeItem,
  widthDropdown = WIDTH_DROPDOWN,
  widthAnchor = scale(24),
  offsetY = 0,
  offsetX = 0,
  mode = 'center',
}: Props) => {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<{ px: number; py: number }>({ px: 0, py: 0 });
  const iconRef = useRef<TouchableOpacity>(null);
  const calc = useMemo(() => {
    if (mode === 'center') {
      return {
        marginLeft: layout.px - widthDropdown / 2 + offsetX + widthAnchor / 2,
        marginTop: layout.py + offsetY,
      };
    }
    if (mode === 'left') {
      return {
        marginLeft: layout.px + offsetX,
        marginTop: layout.py + offsetY,
      };
    }
    if (mode === 'right') {
      return {
        marginLeft: layout.px - widthDropdown - offsetX,
        marginTop: layout.py + offsetY,
      };
    }
    return {
      marginLeft: 0,
      marginTop: layout.py,
    };
  }, [layout.px, layout.py, mode, offsetX, offsetY, widthAnchor, widthDropdown]);

  const onPress = (item: string) => () => {
    onChangeItem(item);
  };

  return (
    <>
      <TouchableOpacity
        onLayout={e => {
          setTimeout(() => {
            iconRef?.current?.measure((_fx, _fy, _width, _height, px, py) => {
              console.log('X offset to page: ' + px);
              console.log('Y offset to page: ' + py);
              setLayout({ px, py });
            });
          }, 500);
        }}
        ref={iconRef}
        onPress={() => {
          setOpen(true);
        }}>
        {renderAnchor()}
      </TouchableOpacity>
      <Modal visible={open} transparent={true}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              setOpen(false);
            }}>
            <View style={styles.wrapper}>
              <View style={{ ...styles.wrapperDropdown, width: widthDropdown, ...calc }}>
                {data.map(f => {
                  return (
                    <View style={styles.wrapperItem} key={f}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ ...styles.touchableItem, borderColor: selectedItem === f ? '#95D987' : '#fff' }}
                        onPress={onPress(f)}>
                        <Text style={styles.text}>{f}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  wrapperDropdown: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    borderRadius: scale(6),
  },
  wrapperItem: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableItem: {
    backgroundColor: 'white',
    width: '100%',
    marginVertical: scale(2),
    paddingVertical: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: '#95D987',
    borderRadius: scale(6),
  },
  text: { fontSize: scale(14), lineHeight: scale(18), fontFamily: 'Lexend-Regular' },
});
