/**
 * @type: skeleton
 * name: app_store_product.itemView.mainCard.skeleton
 */
import { ImageSkeleton, ItemMedia, ItemText, ItemView } from '@metafox/ui';
import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function LoadingSkeleton({ wrapAs, wrapProps }) {
  return (
    <ItemView testid="skeleton" wrapAs={wrapAs} wrapProps={wrapProps}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Box>
            <ItemMedia>
              <ImageSkeleton ratio="11" />
            </ItemMedia>
          </Box>
          <ItemText>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton height={'24px'} width={'50%'} />
              <Skeleton height={'24px'} width={'20%'} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton height={'24px'} width={'20%'} />
              <Skeleton height={'24px'} width={'10%'} />
            </Box>
            <Skeleton height={'24px'} width={'100%'} />
          </ItemText>
        </Box>
        <Box mt={1}>
          <Skeleton height={'24px'} width={'100%'} />
        </Box>
      </Box>
    </ItemView>
  );
}
