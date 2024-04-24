/**
 * @type: formElement
 * name: form.element.ClearSearchForm
 * chunkName: formElement
 */

import { FormFieldProps } from '@metafox/form/types';
import {
  Box,
  FormControl,
  Button,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import { pick, omit, isEqual, camelCase, omitBy, isNil } from 'lodash';
import React from 'react';
import { useFormSchema } from '@metafox/form';
import { useGlobal } from '@metafox/framework';

const ButtonStyled = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.mixins.pxToRem(13),
  color: theme.palette.primary.main
}));

const filterData = x => isNil(x) || x === '';

export default function ClearSearchFormField({
  config: {
    excludeFields,
    label = 'reset',
    align = 'right',
    size = 'medium',
    margin,
    fullWidth,
    sxFieldWrapper,
    flexWidth
  },
  name,
  formik
}: FormFieldProps) {
  const { i18n } = useGlobal();
  const { value: valueDefault } = useFormSchema();
  const defaultRelatedValues = omit({ ...valueDefault }, excludeFields);
  const relatedValues = omit({ ...formik.values }, excludeFields);
  const excludeValues = pick({ ...formik.values }, excludeFields);
  const disableReset = isEqual(
    omitBy(defaultRelatedValues, filterData),
    omitBy(relatedValues, filterData)
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReset = React.useCallback(() => {
    if (disableReset) return;

    formik.resetForm({ values: { ...excludeValues, ...defaultRelatedValues } });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableReset, defaultRelatedValues, excludeValues]);

  return (
    <FormControl
      size={size}
      margin={margin}
      fullWidth={fullWidth}
      data-testid={camelCase(`field ${name}`)}
      sx={{
        minWidth: !isSmallScreen && flexWidth ? '275px' : 'auto',
        ...sxFieldWrapper
      }}
    >
      <Box sx={{ textAlign: align }} component="span">
        <ButtonStyled
          size={isSmallScreen ? 'medium' : size}
          color="primary"
          variant="text"
          onClick={handleReset}
          disabled={disableReset}
        >
          {label && i18n.formatMessage({ id: label })}
        </ButtonStyled>
      </Box>
    </FormControl>
  );
}
