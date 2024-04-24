/**
 * @type: ui
 * name: menuItem.as.language
 */
import { useGlobal, useResourceAction } from '@metafox/framework';
import { LineIcon } from '@metafox/ui';
import {
  Box,
  Radio,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem
} from '@mui/material';
import React from 'react';

export default function SelectLanguage({ item, closePopover }: any) {
  const { dialogBackend, getSetting, dispatch, useSession } = useGlobal();
  const languages = getSetting<Record<string, any>[]>('localize.languages');
  const languageOptions = Object.keys(languages).map(x => ({
    label: languages[x],
    value: x
  }));
  const { user } = useSession();
  const [open, setOpen] = React.useState<boolean>(false);

  const dataSource = useResourceAction('user', 'user', item?.value);

  if (!languageOptions?.length) return null;

  const handleClick = (value: string) => {
    if (user.language_id === value) return;

    closePopover && closePopover();
    dispatch({ type: 'core/changeLanguage', payload: { lang: value } });
  };

  const handleToggle = () => setOpen(open => !open);

  const presentDialogLanguage = () => {
    closePopover && closePopover();
    dialogBackend.present({
      component: 'core.dialog.RemoteForm',
      props: {
        dialogProps: {
          fullWidth: false,
          fullScreen: false
        },
        dataSource,
        pageParams: {
          id: user?.id
        }
      }
    });
  };

  if (languageOptions?.length > 3) {
    return (
      <MenuItem<any>
        disableRipple
        onClick={presentDialogLanguage}
        variant="contained"
        data-testid={item.testid || item.label || item.icon}
      >
        {item.icon ? (
          <ListItemIcon>
            <LineIcon icon={item.icon} />
          </ListItemIcon>
        ) : null}
        <ListItemText primary={item.label} />
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem<any>
        disableRipple
        onClick={handleToggle}
        variant="contained"
        data-testid={item.testid || item.label || item.icon}
      >
        {item.icon ? (
          <ListItemIcon>
            <LineIcon icon={item.icon} />
          </ListItemIcon>
        ) : null}
        <ListItemText primary={item.label} />
        <ListItemSecondaryAction>
          <LineIcon icon={open ? 'ico-angle-up' : 'ico-angle-down'} />
        </ListItemSecondaryAction>
      </MenuItem>
      {open ? (
        <Box>
          {languageOptions.map(x => (
            <MenuItem
              key={`k${x.value}`}
              disableRipple
              sx={{ padding: '0 0 0 40px' }}
              onClick={() => handleClick(x.value)}
            >
              <Radio size="small" checked={user.language_id === x.value} />
              {x.label}
            </MenuItem>
          ))}
        </Box>
      ) : null}
    </>
  );
}
