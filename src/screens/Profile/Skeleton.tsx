import React from 'react';
import { scale } from 'react-native-size-scaling';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { Item } = SkeletonPlaceholder;

const SkeletonProfile = () => {
  return (
    <>
      <SkeletonPlaceholder>
        <>
          <Item flexDirection="row" alignItems="center" marginTop={scale(24)}>
            <Item width={scale(100)} height={scale(100)} borderRadius={scale(100)} />
            <Item marginLeft={scale(20)}>
              <Item width={scale(120)} height={scale(34)} borderRadius={scale(6)} />
              <Item marginTop={scale(6)} width={scale(80)} height={scale(18)} borderRadius={scale(6)} />
              <Item marginTop={scale(9)} width={scale(100)} height={scale(35)} borderRadius={scale(6)} />
            </Item>
          </Item>
          <SkeletonPlaceholder>
            <>
              <Item marginTop={scale(24)} width={scale(300)} height={scale(60)} borderRadius={scale(6)} />
              <Item flexDirection="row" marginTop={scale(30)}>
                <Item width={scale(88)} height={scale(20)} borderRadius={scale(6)} />
                <Item width={scale(88)} height={scale(20)} borderRadius={scale(6)} marginLeft={scale(16)} />
              </Item>
              <Item marginTop={scale(28)} width={'100%'} height={scale(350)} />
            </>
          </SkeletonPlaceholder>
        </>
      </SkeletonPlaceholder>
    </>
  );
};

export default React.memo(SkeletonProfile);
