/**
 * @type: ui
 * name: appbar.item.adminUser
 * bundle: admincp
 */
import { useSession } from '@metafox/framework';
import { MenuItemViewProps as Props, UserAvatar } from '@metafox/ui';
import clsx from 'clsx';
import React from 'react';

export default function AsUserItem({ item, classes }: Props) {
  const { user } = useSession();

  let to = user.link;

  if (to.startsWith('/')) {
    to = `${process.env.MFOX_SITE_URL}${to}`;
  }

  return (
    <a
      role="button"
      target="_blank"
      rel="noopener noreferrer"
      data-testid={item.testid || item.name}
      href={to}
      className={classes.userAvatarButton}
    >
      <UserAvatar
        alt="User"
        user={user}
        className={classes.userAvatar}
        size={40}
        noLink
      />
      <div className={clsx(classes.userAvatarInfo, 'hidden')}>
        <div className={classes.userAvatarName}>{'Admin'}</div>
        <div className={classes.userAvatarRole}>{'Administrator'}</div>
      </div>
    </a>
  );
}
