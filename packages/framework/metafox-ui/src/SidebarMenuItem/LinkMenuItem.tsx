/**
 * @type: ui
 * name: menuItem.as.sidebarLink
 * chunkName: menuItemAs
 */
import { RouteLink } from '@metafox/framework';
import { ControlMenuItemProps, LineIcon } from '@metafox/ui';
import clsx from 'clsx';
import React from 'react';
import { MenuItem, ListItemIcon, styled } from '@mui/material';

const MenuItemIcon = styled(ListItemIcon, {
  name: 'SidebarAppMenu',
  slot: 'menuItemIcon',
  overridesResolver(props, styles) {
    return [styles.menuItemIcon];
  }
})(({ theme }) => ({}));

const ItemIcon = styled(LineIcon, {
  name: 'SidebarAppMenu',
  slot: 'activeMenuItem',
  shouldForwardProp: prop => prop !== 'activeMenuItem',
  overridesResolver(props, styles) {
    return [props.activeMenuItem && styles.activeMenuItem];
  }
})<{ activeMenuItem: boolean }>(({ theme, activeMenuItem }) => ({}));

const MenuItemText = styled('div', {
  name: 'SidebarAppMenu',
  slot: 'menuItemText',
  shouldForwardProp: prop => prop !== 'activeMenuItem',
  overridesResolver(props, styles) {
    return [styles.menuItemText, props.activeMenuItem && styles.activeMenuItem];
  }
})<{ activeMenuItem: boolean }>(({ theme, activeMenuItem }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: activeMenuItem
    ? theme.palette.primary.main
    : theme.palette.text.primary,
  fontSize: theme.mixins.pxToRem(15),
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  display: '-webkit-box',
  overflow: 'hidden',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': '1'
}));

export default function SidebarLinkMenuItem({
  item,
  active,
  classes,
  variant
}: ControlMenuItemProps) {
  const { label, to, icon, onClick, testid } = item;

  return (
    <MenuItem<any>
      role="menuitem"
      className={clsx(classes.menuItem, active && classes.activeMenuItem)}
      component={RouteLink}
      to={to}
      onClick={onClick}
      selected={active}
      data-testid={testid || label || icon}
      variant={variant}
    >
      {icon ? (
        <MenuItemIcon>
          <ItemIcon icon={icon} activeMenuItem={active} />
        </MenuItemIcon>
      ) : null}
      <MenuItemText activeMenuItem={active}>
        <span>{label}</span>
      </MenuItemText>
    </MenuItem>
  );
}
