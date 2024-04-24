import { useGlobal, useResourceMenu } from '@metafox/framework';
import {
  ItemActionMenu,
  ItemMedia,
  ItemText,
  ItemTitle,
  LineIcon,
  ItemView,
  UserAvatar
} from '@metafox/ui';
import { styled, Typography } from '@mui/material';
import React from 'react';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(13),
  color: theme.palette.grey[500],
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  '& .ico': {
    paddingLeft: theme.spacing(0.5),
    color: theme.palette.text.secondary
  }
}));

export default function ShortcutItem({
  item,
  identity,
  wrapAs,
  handleAction,
  wrapProps
}) {
  const menu = useResourceMenu('user', 'shortcut', 'itemActionMenu');
  const { i18n, getSetting } = useGlobal();

  const typeList = getSetting('user.shortcut.sort_type') || {};

  if (!item) return null;

  const itemAvatar = {
    full_name: item.full_name,
    avatar: item.avatar
  };

  return (
    <ItemView
      wrapAs={wrapAs}
      wrapProps={wrapProps}
      testid={`${item.resource_name}`}
      data-eid={identity}
      style={{ overflow: 'visible' }}
    >
      <ItemMedia>
        <UserAvatar
          user={itemAvatar}
          size={32}
          variant={item?.module_name === 'group' ? 'rounded' : 'circular'}
        />
      </ItemMedia>
      <ItemText>
        <ItemTitle>{item.full_name}</ItemTitle>
        <ItemActionMenu
          disablePortal
          items={menu.items}
          identity={identity}
          handleAction={handleAction}
          placement="bottom-start"
          control={
            <TypographyStyled variant="body1">
              {typeList[item?.sort_type]
                ? i18n.formatMessage({ id: typeList[item?.sort_type] })
                : null}
              <LineIcon icon="ico-caret-down" />
            </TypographyStyled>
          }
        />
      </ItemText>
    </ItemView>
  );
}
