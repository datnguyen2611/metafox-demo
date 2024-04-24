import { getImageSrc } from '@metafox/utils';
import clsx from 'clsx';
import React from 'react';
import { BgStatusItemShape } from '../../types';
import { Box, Grid } from '@mui/material';

type ClassesKey = 'itemRoot' | 'itemLabel' | 'itemBg';

export type BgStatusItemProps = {
  item: BgStatusItemShape;
  classes: Record<ClassesKey, string>;
  onClick: () => void;
  isHide?: boolean;
  onClickLoadMore?: () => void;
  labelLoadmore?: string;
  selected?: boolean;
};

export default function BgStatusItem({
  item,
  classes,
  isHide,
  onClick,
  labelLoadmore,
  onClickLoadMore,
  selected
}: BgStatusItemProps) {
  if (isHide) return null;

  const imgSrc = getImageSrc(item.image, '200');

  return (
    <Grid item md={2.4} sm={4} xs={6}>
      <div
        data-testid="itemBackgroundStatus"
        className={classes.itemRoot}
        onClick={!onClickLoadMore ? onClick : undefined}
      >
        <div
          className={clsx(classes.itemBg, {
            [classes.selected]: selected
          })}
          style={{
            backgroundImage: `url("${imgSrc}")`
          }}
        ></div>
        {onClickLoadMore ? (
          <Box
            onClick={onClickLoadMore}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#fff',
              fontSize: '24px'
            }}
          >
            {labelLoadmore}
          </Box>
        ) : null}
      </div>
    </Grid>
  );
}
