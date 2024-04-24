/**
 * @type: formElement
 * name: form.element.Location
 * chunkName: formElement
 */
import {
  BasicPlaceItem,
  useSearchPlaces,
  CORE_GOOGLE_GOOGLE_MAP_API_KEY
} from '@metafox/framework';
import { ClickOutsideListener, LineIcon } from '@metafox/ui';
import {
  Box,
  Collapse,
  Paper,
  Popper,
  Skeleton,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { useField } from 'formik';
import { camelCase, isString } from 'lodash';
import React from 'react';
import { FormFieldProps } from '@metafox/form';
import useStyles from './styles';

const Text = styled(TextField, {
  name: 'Text'
})(({ theme }) => ({
  '& input::placeholder': {
    color: theme.palette.text.hint
  }
}));

function LocationField({
  config,
  disabled: forceDisabled,
  required: forceRequired,
  name,
  formik
}: FormFieldProps) {
  const [field, meta, { setValue, setTouched }] = useField(name ?? 'location');
  const {
    label,
    labelProps,
    placeholder,
    variant,
    disabled,
    margin = 'normal',
    fullWidth,
    required,
    description,
    autoFocus,
    hideMap = false,
    requiredMap = false
  } = config;

  const popperRef = React.useRef();
  const inputRef = React.useRef<any>();
  const classes = useStyles();
  const mapRef = React.useRef<HTMLDivElement>();
  const [
    items,
    query = '',
    setQuery,
    ,
    setCenter,
    getPlaceDetail,
    { loading, error }
  ] = useSearchPlaces(mapRef, {
    lat: field.value?.lat,
    lng: field.value?.lng,
    address: field.value?.address
  });

  const handleChange = React.useCallback(
    (value: string) => {
      setQuery(value);

      if (!requiredMap) {
        setValue({ address: value });
      }

      if (value === '') setValue(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [open, setOpen] = React.useState<boolean>(false);

  const handleDetailPlace = (currentValue, newValue) => {
    const { address_components } = newValue;

    const shortName = address_components[0];

    setValue({ ...currentValue, short_name: shortName.short_name });
  };

  const handleSelect = (loc: BasicPlaceItem) => {
    const postionComma = loc.address.search(',');
    const currentValue = {
      address:
        loc.address.slice(0, postionComma) === loc.name
          ? `${loc.address}`
          : `${loc.name}, ${loc.address}`,
      lat: loc.lat,
      lng: loc.lng
    };

    setValue(currentValue);
    setCenter(loc);
    setQuery(currentValue.address);

    getPlaceDetail(loc, value => handleDetailPlace(currentValue, value));
  };

  const handleFocus = e => {
    setOpen(true);
  };

  const handleBlur = e => {
    if (!meta?.touched) {
      setTouched(true);
    }

    setTimeout(() => {
      setOpen(false);
      field.onBlur(e);
    }, 200);
  };

  const onClickAway = React.useCallback(() => {
    setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const haveError = Boolean(meta.error && (meta.touched || formik.submitCount));
  const hasKeyMap = CORE_GOOGLE_GOOGLE_MAP_API_KEY;

  return (
    <div className={classes.root}>
      <ClickOutsideListener excludeRef={popperRef} onClickAway={onClickAway}>
        <Box>
          <Text
            label={label}
            autoComplete="off"
            required={forceRequired || required}
            inputRef={inputRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={evt => handleChange(evt.target.value)}
            value={query}
            disabled={config.disabled || disabled}
            autoFocus={autoFocus}
            variant={variant as any}
            error={haveError}
            inputProps={{ 'data-testid': camelCase(`field ${name}`) }}
            InputLabelProps={labelProps}
            placeholder={placeholder}
            margin={margin}
            fullWidth={fullWidth}
            helperText={
              haveError && isString(meta.error) ? meta.error : description
            }
          />
          {hasKeyMap ? (
            <div
              className={hideMap ? classes.hideMap : classes.map}
              ref={mapRef}
            />
          ) : null}
        </Box>
      </ClickOutsideListener>
      {hasKeyMap ? (
        <Popper
          open={open}
          anchorEl={inputRef.current}
          disablePortal
          placement="bottom-start"
          className={classes.popper}
        >
          <Paper className={classes.paper}>
            <Collapse in={open}>
              {loading ? (
                <Box>
                  <Skeleton animation="wave" height={30} width="50%" />
                  <Skeleton animation="wave" height={30} width="30%" />
                  <Skeleton animation="wave" height={30} width="40%" />
                </Box>
              ) : (
                items.map(item => {
                  return (
                    <div
                      key={item.lat}
                      className={classes.suggestItem}
                      onClick={() => handleSelect(item)}
                    >
                      <LineIcon
                        icon={'ico-checkin'}
                        className={classes.suggestIcon}
                      />
                      <Box>
                        <Typography color="text.primary">
                          {item.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {item.address}
                        </Typography>
                      </Box>
                    </div>
                  );
                })
              )}
              {error && <div>{error}</div>}
            </Collapse>
          </Paper>
        </Popper>
      ) : null}
    </div>
  );
}

export default LocationField;
