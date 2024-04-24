/**
 * @type: formElement
 * name: form.element.CountryCityCode
 * chunkName: formExtras
 */
import { FormFieldProps } from '@metafox/form';
import { useGlobal, useSuggestions } from '@metafox/framework';
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField
} from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { camelCase, debounce } from 'lodash';
import React from 'react';

type ItemShape = {
  label: string;
  value: string;
};

const CountryCityCodeField = ({
  config,
  name,
  disabled: forceDisabled,
  formik
}: FormFieldProps) => {
  const {
    variant = 'outlined',
    label,
    size = 'medium',
    margin = 'normal',
    disabled,
    placeholder,
    required,
    fullWidth = true,
    search_endpoint,
    search_params
  } = config;
  const { values } = useFormikContext();
  const { compactData, i18n } = useGlobal();
  const [field, meta, { setValue, setTouched }] = useField(
    name || 'autoComplete'
  );

  const [optionValue, setOptionValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  const haveError: boolean = !!(
    meta.error &&
    (meta.touched || formik.submitCount)
  );

  const filterParams = React.useMemo(() => {
    return compactData(search_params, values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_params, values]);

  const [data, handleChanged] = useSuggestions<ItemShape>({
    apiUrl: search_endpoint,
    initialParams: filterParams
  });

  const debounced = () => {
    const change = () => {
      handleChanged(inputValue);
    };

    return debounce(change, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  React.useEffect(() => {
    debounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  React.useEffect(() => {
    if (typeof field.value === 'object' && !Array.isArray(field.value)) {
      setOptionValue(field.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  React.useEffect(() => {
    setInputValue(optionValue?.label || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionValue?.value]);

  const handleBlur = e => {
    field.onBlur(e);
    setTouched(true);
  };

  return (
    <FormControl
      variant={variant as any}
      margin={margin}
      fullWidth={fullWidth}
      required={required}
      size={size}
      data-testid={camelCase(`field ${name}`)}
      error={haveError}
    >
      <Autocomplete
        autoHighlight
        openOnFocus
        onBlur={handleBlur}
        onChange={(evt, newValue) => {
          setValue(newValue || null);
          setTouched(true);
        }}
        disabled={disabled || forceDisabled || formik.isSubmitting}
        value={optionValue || field.value}
        placeholder={placeholder}
        getOptionLabel={option => option.label}
        options={data.items}
        noOptionsText={i18n.formatMessage({ id: 'no_options' })}
        loading={data.loading}
        loadingText={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        }
        inputValue={inputValue || ''}
        renderInput={params => (
          <TextField
            onClick={() => {
              handleChanged('');
            }}
            onFocus={() => {
              handleChanged('');
            }}
            {...params}
            label={label}
            onChange={e => {
              const values = e.target?.value || '';
              setInputValue(values);
            }}
            error={haveError}
            InputProps={{
              ...params.InputProps
            }}
            inputProps={{
              ...params.inputProps,
              'data-testid': camelCase(`field ${name}`)
            }}
          />
        )}
      />
      {haveError && <FormHelperText>{meta?.error}</FormHelperText>}
    </FormControl>
  );
};

export default CountryCityCodeField;
