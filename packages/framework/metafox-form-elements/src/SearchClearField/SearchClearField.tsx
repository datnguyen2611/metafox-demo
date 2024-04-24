/**
 * @type: formElement
 * name: form.element.ClearSearch
 * chunkName: formElement
 */

import { FormFieldProps } from '@metafox/form/types';
import { Box, Link } from '@mui/material';
import { pick, isEqual, omit, omitBy, debounce } from 'lodash';
import React from 'react';
import qs from 'query-string';
import { useNavigate } from 'react-router-dom';
import { useFormSchema } from '@metafox/form';
import { useGlobal } from '@metafox/framework';

export default function ClearSearchField({
  config: {
    excludeFields,
    component, // fix React warning.
    label = 'reset',
    align = 'right',
    ...restConfig
  },
  name,
  formik
}: FormFieldProps) {
  // this component only use sidebar search app. if want clear form please check ClearSearchForm element
  const { i18n } = useGlobal();
  const navigate = useNavigate();
  const { value: valueDefault } = useFormSchema();
  const defaultRelatedValues = omit({ ...valueDefault }, excludeFields);
  const relatedValues = omit({ ...formik.values }, excludeFields);
  const excludeValues = pick({ ...formik.values }, excludeFields);
  const disableReset = isEqual(
    defaultRelatedValues,
    omitBy(relatedValues, v => !v)
  );

  const handleReset = React.useCallback(() => {
    if (disableReset) return;

    navigate(
      {
        search: qs.stringify({
          ...defaultRelatedValues,
          ...excludeValues
        })
      },
      { replace: true }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRelatedValues, disableReset, excludeValues]);

  const debounceSearch = debounce(handleReset, 200);

  const onClick = () => {
    debounceSearch();
  };

  return (
    <Box sx={{ textAlign: align }} {...restConfig}>
      <Link
        color="primary"
        component="span"
        variant="body2"
        onClick={onClick}
        disabled={disableReset}
      >
        {label && i18n.formatMessage({ id: label })}
      </Link>
    </Box>
  );
}
