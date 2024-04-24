/**
 * @type: block
 * name: story-book.block.SampleBlock
 */
import { createBlock, useGlobal } from '@metafox/framework';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import { Box, MenuItem, Select } from '@mui/material';
import React from 'react';

const options = [
  { label: 'text-field', value: 'text-field' },
  { label: 'button', value: 'button' },
  { label: 'icon-button', value: 'icon-button' },
  { label: 'form', value: 'form' },
  { label: 'hover card', value: 'popup' }
];

function Base({ blockProps, title }) {
  const { usePageParams, navigate, jsxBackend } = useGlobal();
  const { tab } = usePageParams();

  const content = {
    component: `story-book.sample.${tab ?? 'text-field'}`,
    props: {}
  };

  const handleChange = evt => {
    navigate(`/story-book/sample/${evt.target.value}`);
  };

  return (
    <Block>
      <BlockHeader title={title} />
      <BlockContent>
        <Box>
          <Select
            required
            onChange={handleChange}
            label="Component"
            placeholder="Component"
            value={tab ?? 'text-field'}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {jsxBackend.render(content)}
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: Base
});
