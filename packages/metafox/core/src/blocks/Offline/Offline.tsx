/**
 * @type: block
 * name: core.block.offline
 * bundle: web
 * experiment: true
 */

import { createBlock, useGlobal } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent } from '@metafox/layout';
import { Image } from '@metafox/ui';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

function Offline() {
  const { getSetting, assetUrl, useTheme } = useGlobal();
  const message = getSetting('core.offline_message');
  const srcBg = assetUrl('core.maintenance');
  const theme = useTheme();

  return (
    <Block>
      <BlockContent>
        <Box
          sx={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.background.paper,
            padding: 3
          }}
        >
          {message ? (
            <HtmlViewer html={message} />
          ) : (
            <>
              <Typography paragraph component="h1" variant="h4">
                Website is currently down for maintenance.
              </Typography>
              <Divider />
              <Typography paragraph variant="body1" sx={{ pt: 2 }}>
                [offline message here]
              </Typography>
            </>
          )}
          {srcBg ? (
            <Box
              mt={10}
              sx={{
                width: 'auto',
                display: 'flex',
                marginTop: '80px',
                '& img': {
                  maxHeight: '100%',
                  background: 'transparent'
                }
              }}
            >
              <Image src={srcBg} />
            </Box>
          ) : null}
        </Box>
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: Offline,
  overrides: {
    title: 'Offline'
  }
});
