/**
 * @type: ui
 * name: story-book.sample.text-field
 */
import { createBlock } from '@metafox/framework';
import { TextField } from '@mui/material';
import React from 'react';
import PropForm from './PropsForm';

function Base({ blockProps, title }) {
  return (
    <PropForm
      config={{
        variant: ['outlined', 'filled'],
        margin: ['dense', 'normal', 'none'],
        disabled: [false, true],
        'inputProps.readOnly': [false, true],
        fullWidth: [true, false],
        required: [false, true]
      }}
    >
      {prop => (
        <>
          <TextField size="small" label={'Full name'} {...prop} />
          <TextField size="medium" label={'Full name'} {...prop} />
        </>
      )}
    </PropForm>
  );
}

export default createBlock({
  extendBlock: Base
});
