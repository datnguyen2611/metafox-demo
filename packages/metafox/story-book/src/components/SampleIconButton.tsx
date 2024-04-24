/**
 * @type: ui
 * name: story-book.sample.icon-button
 */

import { LineIcon } from '@metafox/ui';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import PropForm from './PropsForm';

export default function Base() {
  return (
    <PropForm
      config={{
        variant: ['contained', 'outlined-square', 'outlined', 'text'],
        size: ['medium', 'small', 'large', 'smaller', 'smallest'],
        disabled: [false]
      }}
    >
      {({ startIcon, endIcon, ...prop }) => (
        <>
          <Box marginY={2}>
            <IconButton color="default" {...prop}>
              <LineIcon icon="ico-plus" />
            </IconButton>
          </Box>
          <Box marginY={2}>
            <IconButton color="primary" {...prop}>
              <LineIcon icon="ico-plus" />
            </IconButton>
          </Box>
          <Box marginY={2}>
            <IconButton color="error" {...prop}>
              <LineIcon icon="ico-plus" />
            </IconButton>
          </Box>
        </>
      )}
    </PropForm>
  );
}
