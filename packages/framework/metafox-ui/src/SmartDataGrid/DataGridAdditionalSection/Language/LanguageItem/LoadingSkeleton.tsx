/**
 * @type: skeleton
 * name: language.itemView.recommendCard.skeleton
 */
import { ImageSkeleton, ItemMedia, ItemText, ItemView } from '@metafox/ui';
import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function LoadingSkeleton({ wrapAs, wrapProps }) {
  return (
    <ItemView testid="skeleton" wrapAs={wrapAs} wrapProps={wrapProps}>
      <Box sx={{ width: '100%' }}>
        <Box>
          <ItemMedia>
            <ImageSkeleton ratio="169" />
          </ItemMedia>
        </Box>
        <ItemText>
          <Skeleton height={'24px'} width={'100%'} />
          <Skeleton height={'20px'} width={'60%'} />
        </ItemText>
      </Box>
    </ItemView>
  );
}
