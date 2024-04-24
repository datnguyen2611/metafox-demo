/**
 * @type: formElement
 * name: form.element.ViewMore
 * chunkName: formBasic
 */

import { FormFieldProps } from '@metafox/form';
import { useGlobal } from '@metafox/framework';
import { Link, FormControl } from '@mui/material';
import { useField } from 'formik';
import React from 'react';

export default function ViewMore({ config, name }: FormFieldProps) {
  const [field, , { setValue }] = useField(name ?? 'ViewMoreField');

  const { i18n } = useGlobal();

  const {
    moreText = 'view_more',
    lessText = 'view_less',
    sxFieldWrapper,
    margin,
    fullWidth
  } = config;

  return (
    <FormControl sx={sxFieldWrapper} margin={margin} fullWidth={fullWidth}>
      <Link
        color="primary"
        component="span"
        onClick={() => setValue(Number(!field.value))}
        style={{ cursor: 'pointer' }}
        variant="body2"
      >
        {i18n.formatMessage({ id: field.value ? lessText : moreText })}
      </Link>
    </FormControl>
  );
}
