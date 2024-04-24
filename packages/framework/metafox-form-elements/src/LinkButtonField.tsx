/**
 * @type: formElement
 * name: form.element.LinkButton
 * chunkName: formBasic
 */
import { Link, useGlobal } from '@metafox/framework';
import { FormControl } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { camelCase } from 'lodash';
import React from 'react';
import { FormFieldProps } from '@metafox/form';

function LinkButtonField({
  config,
  name,
  formik
}: FormFieldProps<{ target: string }>) {
  const { navigate } = useGlobal();
  const {
    type = 'button',
    disabled,
    controlProps = {},
    color = 'primary',
    margin,
    label,
    size,
    link,
    fullWidth = false,
    className,
    target,
    variant
  } = config;

  const handleClick = React.useCallback(() => {
    navigate(link);
  }, [link, navigate]);

  return (
    <FormControl
      margin={margin}
      fullWidth={fullWidth}
      {...controlProps}
      data-testid={camelCase(`field ${name}`)}
    >
      <MuiButton
        component={Link}
        fullWidth={fullWidth}
        variant={variant as any}
        color={color}
        to={link}
        size={size}
        target={target}
        type={type}
        className={className}
        disabled={disabled ?? formik.isSubmitting}
        role="link"
        data-testid={camelCase(`button ${name}`)}
        onClick={handleClick}
      >
        {label}
      </MuiButton>
    </FormControl>
  );
}

export default LinkButtonField;
