/**
 * @type: ui
 * name: appbar.item.viewSite
 * bundle: admincp
 */
import { LineIcon, MenuItemViewProps as Props } from '@metafox/ui';
import { Tooltip } from '@mui/material';
import { useGlobal } from '@metafox/framework';
import React from 'react';

export default function AsDivider({ item, classes }: Props) {
  let url = process.env.MFOX_SITE_URL;
  const { i18n } = useGlobal();

  if (!url) {
    url = '/';
  }

  return (
    <a
      className={classes.menuItemViewSite}
      href={url}
      target="_blank"
      data-testid={item.testid || item.name}
      rel="noreferrer"
    >
      <span className={classes.smallMenuButton}>
        <Tooltip title={i18n.formatMessage({ id: item?.label }) || ''}>
          <LineIcon icon={item?.icon} component="i" />
        </Tooltip>
      </span>
    </a>
  );
}
