/**
 * @type: formElement
 * name: form.element.CustomField
 * chunkName: formExtras
 */
import {
  FormControl,
  Box,
  styled,
  TextField,
  Tooltip,
  Button
} from '@mui/material';
import { useField } from 'formik';
import { camelCase } from 'lodash';
import React from 'react';
import { FormFieldProps } from '@metafox/form';
import { LineIcon } from '@metafox/ui';
import { useGlobal } from '@metafox/framework';
import ErrorMessage from '../ErrorMessage';

enum TypeStatus {
  Create = 'create',
  Remove = 'remove',
  Edit = 'update'
}

const StyledIconClose = styled('div', {
  name: 'AnswerItem',
  slot: 'IconClose',
  shouldForwardProp: prop => prop !== 'enable'
})<{ enable: boolean }>(({ theme, enable }) => ({
  cursor: enable ? 'pointer' : 'default',
  pointerEvents: enable ? 'auto' : 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  margin: theme.spacing(0, 0.5),
  '& .ico': {
    fontSize: theme.mixins.pxToRem(16),
    color: theme.palette.text.hint
  }
}));

const BtnMoreAnswer = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.mixins.pxToRem(13),
  color: theme.palette.primary.main,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(0.5),
  width: 'fit-content',
  '&:hover': {
    textDecoration: 'underline'
  }
}));

const CustomField = ({
  config,
  disabled: forceDisabled,
  name,
  formik
}: FormFieldProps) => {
  const {
    margin,
    disabled,
    fullWidth,
    hiddenLabel,
    required,
    variant,
    size,
    style,
    minLength,
    sxFieldWrapper
  } = config;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, { setValue, setTouched }] = useField(
    name ?? 'DropdownField'
  );

  const { i18n } = useGlobal();

  React.useEffect(() => {
    if (!field.value) {
      setValue([{ label: '', status: TypeStatus.Create }]);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleAddAnswer = () => {
    const newValue = [...field.value, { label: '', status: TypeStatus.Create }];

    setValue(newValue);
  };

  const onChangeTextField = (e, index) => {
    const newArr = [...field.value];
    newArr[index].label = e.target.value;

    if (field.value[index].status !== TypeStatus.Create)
      newArr[index].status = TypeStatus.Edit;

    setValue(newArr);
  };

  const handleRemove = index => {
    const newArr = [...field.value];

    if (field.value[index].status === TypeStatus.Create) {
      newArr.splice(index, 1);
    } else {
      newArr[index].status = TypeStatus.Remove;
    }

    setValue(newArr);
  };

  return (
    <FormControl
      margin={margin ?? 'none'}
      disabled={disabled}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      required={required}
      style={style}
      size={size}
      variant={variant as any}
      data-testid={camelCase(`field ${name}`)}
      sx={sxFieldWrapper}
    >
      <Box ml={2}>
        {field.value &&
          field.value
            .filter(option => option?.status !== TypeStatus.Remove)
            .map((option, index) => (
              <Box key={index} pt={2}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    value={option.label}
                    variant="outlined"
                    onChange={e => onChangeTextField(e, index)}
                    error={meta?.error?.length && meta.error[index]}
                    disabled={formik.isSubmitting}
                  />

                  <StyledIconClose
                    onClick={() => handleRemove(index)}
                    enable={field.value.length > minLength}
                  >
                    <Tooltip
                      title={i18n.formatMessage({ id: 'remove' })}
                      placement="top"
                    >
                      <LineIcon icon="ico-close" />
                    </Tooltip>
                  </StyledIconClose>
                </Box>
                {meta.error && (
                  <Box ml={1}>
                    <ErrorMessage error={meta.error[index]?.label} />
                  </Box>
                )}
              </Box>
            ))}
        <BtnMoreAnswer
          onClick={handleAddAnswer}
          variant="text"
          color="primary"
          size="small"
          disabled={formik.isSubmitting}
        >
          {i18n.formatMessage({ id: 'add_options' })}
        </BtnMoreAnswer>
      </Box>
    </FormControl>
  );
};

export default CustomField;
