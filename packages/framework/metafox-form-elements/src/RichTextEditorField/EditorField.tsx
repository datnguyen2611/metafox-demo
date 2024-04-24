import { InputNotched } from '@metafox/ui';
import { FormControl, InputLabel, Theme, Box } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { alpha } from '@mui/system/colorManipulator';
import clsx from 'clsx';
import { useField } from 'formik';
import { camelCase } from 'lodash';
import React from 'react';
import { FormFieldProps } from '@metafox/form';
import ErrorMessage from '../ErrorMessage';
import './react-draft-wysiwyg.css';
import EditorLexical from './Editor';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formLabel: {
      paddingLeft: '4px !important'
    },
    'formLabel-outlined': {
      backgroundColor: theme.palette.background.paper,
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
      marginLeft: theme.spacing(-0.5)
    },
    RDW: {
      position: 'relative',
      padding: '16px 12px',
      '& #mui-rte-toolbar': {},
      '& #mui-rte-editor': {},
      '& .rdw-option-wrapper.rdw-option-active': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
        boxShadow: 'none',
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        '&:hover': {
          boxShadow: 'none'
        }
      },
      '& .rdw-dropdown-optionwrapper': {
        background:
          theme.palette.mode === 'light'
            ? '#fff'
            : theme.palette.background.paper,
        '& .rdw-dropdownoption-highlighted': {
          background:
            theme.palette.mode === 'light'
              ? '#f1f1f1'
              : theme.palette.background.default
        }
      },
      '& .rdw-link-modal, & .rdw-image-modal': {
        background:
          theme.palette.mode === 'light'
            ? '#fff'
            : theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === 'light'
            ? '3px 3px 5px #bfbdbd'
            : `3px 3px 5px ${theme.palette.background.paper}`
      },
      '& .rdw-image-alignment-options-popup': {
        color: '#050505',
        background:
          theme.palette.mode === 'light'
            ? '#fff'
            : theme.palette.background.paper
      },
      '& .public-DraftEditorPlaceholder-root': {
        color: theme.palette.text.hint,
        opacity: 0.5
      }
    },
    'RDW-outlined': {
      '&:hover': {
        '& > fieldset': {
          borderColor: theme.palette.text.primary
        }
      }
    },
    'RDW-outlined-focused': {
      '& > fieldset': {
        borderColor: `${theme.palette.primary.main} !important`,
        border: '2px solid'
      },
      '& > label': {
        color: theme.palette.primary.main
      }
    },
    'RDW-filled': {},
    'RDW-standard': {
      padding: theme.spacing(1, 0, 0, 0),
      borderWidth: '0 0 1px 0'
    },
    'RDW-error': {
      '& > fieldset': {
        borderColor: `${theme.palette.error.main} !important`
      },
      '& > label': {
        color: theme.palette.error.main
      }
    },
    hidePlaceholder: {
      '& .public-DraftEditorPlaceholder-root': {
        display: 'none'
      }
    },
    hiddenToolbar: {
      display: 'none !important'
    }
  })
);

const RichTextEditorField = ({
  config,
  name,
  disabled: forceDisabled,
  required: forceRequired,
  formik
}: FormFieldProps) => {
  const {
    label,
    variant,
    color,
    required,
    fullWidth = true,
    disabled,
    placeholder,
    margin = 'normal'
  } = config;

  const classes = useStyles();
  const [focused, setFocused] = React.useState<boolean>(false);
  const [clicked, setClicked] = React.useState<boolean>(false);
  const [field, meta, { setValue, setTouched }] = useField(
    name ?? 'RichTextEditorField'
  );

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setFocused(false);

    if (clicked) {
      setTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  const handleClick = React.useCallback(() => {
    setClicked(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const haveError: boolean = !!(
    meta.error &&
    (meta.touched || formik.submitCount)
  );

  const onChange = value => {
    setValue(value);
  };

  const isDisabled = disabled || forceDisabled || formik.isSubmitting;

  return (
    <FormControl
      margin={margin}
      required={required}
      disabled={isDisabled}
      fullWidth={fullWidth}
      data-testid={camelCase(`field ${name}`)}
    >
      <Box
        sx={{ position: 'relative' }}
        className={clsx(
          classes.RDW,
          classes[`RDW-${variant}`],
          focused && classes[`RDW-${variant}-focused`],
          haveError && classes['RDW-error']
        )}
      >
        <InputLabel
          required={required || forceRequired}
          shrink
          variant={variant as any}
          data-testid={camelCase(`input ${name}`)}
          className={clsx(
            classes.formLabel,
            classes[`formLabel-${variant}`],
            focused && classes[`formLabel-${variant}-focused`]
          )}
          disabled={isDisabled}
          color={color}
        >
          {label}
        </InputLabel>
        <EditorLexical
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onClick={handleClick}
          value={field.value}
          editorConfig={{
            editable: !isDisabled
          }}
        />
        <InputNotched children={label} variant={variant} hoverState={focused} />
      </Box>
      {haveError ? <ErrorMessage error={meta.error} /> : null}
    </FormControl>
  );
};

export default RichTextEditorField;
