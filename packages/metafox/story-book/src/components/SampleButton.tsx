/**
 * @type: ui
 * name: story-book.sample.button
 */

import { LineIcon } from '@metafox/ui';
import { Box, Button } from '@mui/material';
import React from 'react';
import PropForm from './PropsForm';

export default function Base() {
  return (
    <PropForm
      config={{
        variant: ['contained', 'outlined', 'text'],
        size: ['medium', 'small', 'large', 'smaller', 'smallest'],
        disabled: [false],
        startIcon: [false],
        endIcon: [false]
      }}
    >
      {({ startIcon, endIcon, ...prop }) => (
        <>
          <Box marginY={2}>
            <Button
              color="default"
              {...prop}
              startIcon={startIcon ? <LineIcon icon="ico-plus" /> : null}
              endIcon={endIcon ? <LineIcon icon="ico-caret-down" /> : null}
            >
              Color Default
            </Button>
          </Box>
          <Box marginY={2}>
            <Button
              color="primary"
              startIcon={startIcon ? <LineIcon icon="ico-plus" /> : null}
              endIcon={endIcon ? <LineIcon icon="ico-caret-down" /> : null}
              {...prop}
            >
              Primary Button
            </Button>
          </Box>
          <Box marginY={2}>
            <Button
              color="error"
              startIcon={startIcon ? <LineIcon icon="ico-plus" /> : null}
              endIcon={endIcon ? <LineIcon icon="ico-caret-down" /> : null}
              {...prop}
            >
              Error Button
            </Button>
          </Box>
        </>
      )}
    </PropForm>
  );
}
