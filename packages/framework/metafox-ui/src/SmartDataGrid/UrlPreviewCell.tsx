/**
 * @type: ui
 * name: dataGrid.cell.UrlPreviewCell
 */

import { styled, Box } from '@mui/material';
import { get } from 'lodash';
import React from 'react';
import { Image, LineIcon } from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';

const Wrapper = styled(Box, {
  name: 'WrapperMedia'
})(({ theme, maxWidth, maxHeight }) => ({
  display: 'block',
  '& img': {
    maxHeight,
    maxWidth
  }
}));

export default function BasicCell({ row, colDef }) {
  const {
    field,
    width = 'auto',
    height = 150,
    maxWidth = 120,
    maxHeight = 80
  } = colDef || {};
  const previewData = get(row, field, null);

  if (!previewData) return null;

  const { url, file_type, file_name, image } = previewData || {};
  const isImage = file_type?.match('image/*');

  const imageSrc = getImageSrc(image, colDef?.sizePrefers || 'origin');

  let style = {};

  if ((width || height) && imageSrc) {
    style = {
      width,
      height
    };
  }

  return (
    <Box>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Wrapper
          color={'text.primary'}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
        >
          {isImage ? (
            <Image src={imageSrc || url} style={style} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LineIcon sx={{ mr: 0.5 }} icon="ico-paperclip-alt" />
              {file_name}
            </Box>
          )}
        </Wrapper>
      </a>
    </Box>
  );
}
