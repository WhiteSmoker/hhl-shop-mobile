import React from 'react';
import { scale } from 'react-native-size-scaling';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { Item } = SkeletonPlaceholder;

interface Props {
  size: number;
}

const SkeletonCardComponent = (props: Props) => {
  return (
    <>
      {[...Array(props.size || 1).keys()].map((_, index) => (
        <SkeletonPlaceholder key={index}>
          <Item flexDirection="row" alignItems="center" marginTop={scale(15)}>
            <Item width={scale(90)} height={scale(90)} />
            <Item marginLeft={scale(20)}>
              <Item width={scale(120)} height={scale(22)} borderRadius={scale(3)} />
              <Item marginTop={scale(6)} width={scale(200)} height={scale(22)} borderRadius={scale(3)} />
              <Item marginTop={scale(6)} width={scale(160)} height={scale(22)} borderRadius={scale(3)} />
            </Item>
          </Item>
        </SkeletonPlaceholder>
      ))}
    </>
  );
};

export default React.memo(SkeletonCardComponent);
