/**
 * @type: ui
 * name: core.ui.login_languages
 */
import { MFOX_LOCALE, useGlobal } from '@metafox/framework';
import { detectBrowserLanguage } from '@metafox/utils';
import { MenuItem, Select, styled } from '@mui/material';
import React from 'react';

const name = 'LoginLanguages';

const RootStyled = styled('div', { name, slot: 'root' })(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'flex-end',
  '& .MuiSvgIcon-root': {
    color: theme.palette.default.contrastText
  },
  '& .MuiInput-input': {
    color: theme.palette.default.contrastText
  },
  '& .MuiInput-input:focus': {
    backgroundColor: 'transparent'
  }
}));

const MenuItemStyled = styled(MenuItem, { name })(({ theme }) => ({
  color: theme.palette.text.primary
}));

export default function LoginLanguages({ sx, menuProps }) {
  const { usePreference, getSetting, preferenceBackend, navigate } =
    useGlobal();

  const supports = getSetting<object>('localize.languages');

  const { userLanguage } = usePreference();

  if (!supports || Object.keys(supports).length < 2) return null;

  const value = userLanguage || detectBrowserLanguage(supports) || MFOX_LOCALE;

  const onChange = (evt: any) => {
    preferenceBackend.setAndRemember('userLanguage', evt.target.value);
    navigate(0);
  };

  return (
    <RootStyled sx={sx}>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={value}
        onChange={onChange}
        autoWidth
        variant="standard"
        disableUnderline
        MenuProps={menuProps}
      >
        {Object.keys(supports).map(langCode => (
          <MenuItemStyled key={langCode} value={langCode}>
            {supports[langCode]}
          </MenuItemStyled>
        ))}
      </Select>
    </RootStyled>
  );
}
