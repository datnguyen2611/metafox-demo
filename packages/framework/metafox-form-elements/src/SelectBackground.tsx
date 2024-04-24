/**
 * @type: formElement
 * name: form.element.SelectBackground
 * chunkName: formBasic
 */
import { FormFieldProps } from '@metafox/form';
import {
  Box,
  FormControl,
  styled,
  TextFieldProps,
  Typography
} from '@mui/material';
import { useField } from 'formik';
import { camelCase } from 'lodash';
import React from 'react';

const Title = styled(Typography, {
  name: 'Title',
  shouldForwardProp: prop => prop !== 'styleGroup'
})<{ styleGroup?: string }>(({ theme, styleGroup }) => ({
  ...(styleGroup === 'question' && {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold
  }),
  ...(styleGroup === 'normal' && {})
}));

const Container = styled(Box, { slot: 'ContetnWrapper' })(({ theme }) => ({
  border: theme.mixins.border('secondary'),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius / 2
}));

const ContentWrapper = styled(Box, { slot: 'ContetnWrapper' })(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
}));

const ImageItem = styled(Box, {
  slot: 'ImageItem',
  shouldForwardProp: props => props !== 'active' && props !== 'disabled'
})<{ active?: boolean; disabled?: boolean }>(({ theme, active, disabled }) => ({
  height: '32px',
  width: '32px',
  borderRadius: theme.shape.borderRadius / 2,
  margin: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...(active && {
    '&:before': {
      content: '""',
      position: 'absolute',
      height: '36px',
      width: '36px',
      border: theme.mixins.border('primary'),
      borderWidth: '3px',
      ...(theme.palette.mode === 'dark' && {
        borderColor: '#fff'
      }),
      borderRadius: theme.shape.borderRadius / 2
    }
  }),
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer'
}));

const SelectBackgroundField = ({
  config,
  disabled: forceDisabled,
  required: forceRequired,
  name,
  formik
}: FormFieldProps<TextFieldProps>) => {
  const [field, , { setValue, setTouched }] = useField(
    name ?? 'SelectBackground'
  );

  const {
    label,
    margin = 'dense',
    variant,
    fullWidth,
    sxFieldWrapper,
    options
  } = config;

  const handleClick = item => {
    if (forceDisabled || formik.isSubmitting || !item) return;

    setValue(item.id);
  };

  const handleBlur = e => {
    field.onBlur(e);
    setTouched(true);
  };

  React.useEffect(() => {
    if (!field.value && options.length) {
      setValue(options[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormControl
      margin={margin}
      variant={variant}
      fullWidth={fullWidth}
      data-testid={camelCase(`field ${name}`)}
      sx={sxFieldWrapper}
      id={name}
      disabled={forceDisabled || formik.isSubmitting}
    >
      <Container onBlur={handleBlur}>
        <Title sx={{ mb: 2 }} variant={variant}>
          {label}
        </Title>
        <ContentWrapper>
          {options.map((item, key) => (
            <ImageItem
              disabled={forceDisabled || formik.isSubmitting}
              key={key}
              active={item.id === field.value}
              onClick={() => handleClick(item)}
              style={{ backgroundImage: `url(${item.label})` }}
            />
          ))}
        </ContentWrapper>
      </Container>
    </FormControl>
  );
};

export default SelectBackgroundField;
