import React from 'react';
import { scale, width } from 'react-native-size-scaling';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { Item } = SkeletonPlaceholder;

interface Props {
  size?: number;
}

const SkeletonNotification = (props: Props) => {
  return (
    <>
      {[...Array(props.size || 1).keys()].map((_, index) => (
        <SkeletonPlaceholder key={index}>
          <Item flexDirection="row" alignItems="center" height={scale(95)}>
            <Item width={scale(60)} height={scale(60)} borderRadius={scale(60)} />
            <Item marginLeft={scale(10)}>
              <Item width={scale(width - 60)} height={scale(60)} borderRadius={scale(6)} />
            </Item>
          </Item>
        </SkeletonPlaceholder>
      ))}
    </>
  );
};

export default React.memo(SkeletonNotification);
