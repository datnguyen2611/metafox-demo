import { useGlobal, MFOX_LOCALE } from '@metafox/framework';
import { FriendItemProps } from '@metafox/friend/types';
import {
  ItemMedia,
  ItemSummary,
  ItemText,
  ItemTitle,
  ItemView,
  UserAvatar,
  UserName
} from '@metafox/ui';
import { Box, Typography } from '@mui/material';
import * as React from 'react';

export default function FriendItem({
  item,
  user,
  identity,
  handleAction,
  state,
  wrapAs,
  wrapProps,
  actions
}: FriendItemProps) {
  const { usePreference, moment } = useGlobal();
  const { userLanguage } = usePreference();

  if (!item) return null;

  const { link: to, birthday, age } = item;

  const day_phrase = age
    ? moment(birthday).format('LL')
    : new Date(birthday).toLocaleDateString(userLanguage || MFOX_LOCALE, {
        month: 'long',
        day: 'numeric'
      });

  return (
    <ItemView
      wrapAs={wrapAs}
      wrapProps={wrapProps}
      testid={`${item.resource_name}`}
      data-eid={identity}
    >
      <ItemMedia>
        <UserAvatar user={item} size={80} />
      </ItemMedia>
      <ItemText>
        <ItemTitle>
          <UserName to={to} user={item} color={'inherit'} />
        </ItemTitle>
        <Box>
          {birthday && (
            <ItemSummary>
              <Typography variant="body2" color="text.secondary">
                {day_phrase}
              </Typography>
            </ItemSummary>
          )}
        </Box>
      </ItemText>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {item?.new_age_phrase}
        </Typography>
      </Box>
    </ItemView>
  );
}

FriendItem.displayName = 'FriendItemViewMainCard';
