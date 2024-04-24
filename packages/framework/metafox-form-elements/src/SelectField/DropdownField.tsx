/**
 * @type: formElement
 * name: form.element.Dropdown
 * chunkName: formExtras
 */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useField } from 'formik';
import { camelCase } from 'lodash';
import React from 'react';
import { FormFieldProps } from '@metafox/form';

const DropdownField = ({
  config,
  disabled: forceDisabled,
  required: forceRequired,
  name,
  formik
}: FormFieldProps) => {
  const {
    label,
    margin,
    disabled,
    fullWidth,
    hiddenLabel,
    required,
    options: optionsProp = [],
    variant,
    size,
    style,
    sx,
    sxFieldWrapper,
    description,
    autoComplete = 'off',
    placement,
    className,
    relatedFieldName,
    optionRelatedMapping,
    sxOptions
  } = config;
  const [field, meta, { setValue, setTouched }] = useField(
    name ?? 'DropdownField'
  );
  const [fieldRelated] = useField(relatedFieldName ?? `${name}_child`);
  const [optionRelatedState, setOptionRelatedState] = React.useState([]);
  const options = relatedFieldName ? optionRelatedState : optionsProp;

  React.useEffect(() => {
    if (!relatedFieldName) return;

    if (optionRelatedMapping) {
      const optionRelated = optionRelatedMapping[fieldRelated?.value] || [];
      setOptionRelatedState(optionRelated);

      if (optionRelated.some(x => x.value === field.value)) {
        return;
      }

      const valueDefault = optionRelated.find(item => item?.is_default);

      setValue(valueDefault?.value);

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedFieldName, fieldRelated?.value]);

  const haveError: boolean = !!(
    meta.error &&
    (meta.touched || formik.submitCount)
  );

  if (!options.length) return null;

  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setValue(value);
  };

  const handleBlur = e => {
    field.onBlur(e);
    setTouched(true);
  };

  const placementMenuProps =
    placement === 'right'
      ? {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        }
      : {};

  return (
    <FormControl
      margin={margin ?? 'normal'}
      disabled={disabled}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      required={required || forceRequired}
      style={style}
      error={haveError}
      size={size}
      variant={variant as any}
      data-testid={camelCase(`field ${name}`)}
      sx={sxFieldWrapper}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        onBlur={handleBlur}
        value={field.value ?? ''}
        displayEmpty
        label={label}
        defaultValue={options[0]?.value}
        disabled={disabled || forceDisabled || formik.isSubmitting}
        onChange={handleChange}
        id={`select-${name}`}
        sx={sx}
        className={className}
        MenuProps={placementMenuProps}
        inputProps={{
          label,
          variant,
          size,
          fullWidth,
          error: haveError || undefined,
          autoComplete,
          required: required || forceRequired
        }}
        data-testid={camelCase(`input ${name}`)}
      >
        {options.map((option, key) => (
          <MenuItem value={option.value} key={key} sx={sxOptions}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {description && <FormHelperText children={description} />}
      {haveError && <FormHelperText>{meta?.error}</FormHelperText>}
    </FormControl>
  );
};

export default DropdownField;
