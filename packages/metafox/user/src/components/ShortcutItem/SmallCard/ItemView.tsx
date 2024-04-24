import { RouteLink, useGlobal } from '@metafox/framework';
import {
  ItemMedia,
  ItemSummary,
  ItemText,
  ItemTitle,
  ItemView,
  UserAvatar
} from '@metafox/ui';
import React from 'react';

export default function ShortcutItem({ item, identity, wrapAs, wrapProps }) {
  const { i18n } = useGlobal();

  if (!item || item.sort_type === 0) return null;

  const to = item.link ?? `/${item.resource_name}/${item.id}`;
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
      component={RouteLink}
      color="inherit"
      to={to}
    >
      <ItemMedia>
        <UserAvatar
          size={32}
          user={itemAvatar}
          variant={item?.module_name === 'group' ? 'rounded' : 'circular'}
        />
      </ItemMedia>
      <ItemText>
        <ItemTitle color="text.primary">{item.full_name}</ItemTitle>
        <ItemSummary color="text.secondary">
          <span>
            {item.resource_name
              ? i18n.formatMessage({ id: item.resource_name })
              : ''}
          </span>
        </ItemSummary>
      </ItemText>
    </ItemView>
  );
}
