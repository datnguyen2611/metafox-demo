import { useGlobal, MFOX_LOCALE } from '@metafox/framework';
import { FriendItemProps } from '@metafox/friend/types';
import { ItemMedia, UserAvatar } from '@metafox/ui';
import { Box, styled } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import * as React from 'react';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  marginTop: `-${theme.spacing(2)}!important`,
  [`& .${tooltipClasses.arrow}`]: {
    display: 'none'
  }
}));

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
  const { i18n, usePreference, moment } = useGlobal();
  const { userLanguage } = usePreference();

  const { birthday, age } = item || {};

  const day_phrase = React.useMemo(() => {
    if (age) return moment(birthday).format('LL');

    if (moment(new Date(birthday))?.isValid())
      return new Date(birthday).toLocaleDateString(
        userLanguage || MFOX_LOCALE,
        {
          month: 'long',
          day: 'numeric'
        }
      );

    return new Date(moment(birthday, 'MM-DD')?.toString()).toLocaleDateString(
      userLanguage || MFOX_LOCALE,
      {
        month: 'long',
        day: 'numeric'
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, birthday, userLanguage]);

  if (!item) return null;

  return (
    <LightTooltip
      title={i18n.formatMessage(
        { id: 'user_birthday_is_date' },
        {
          full_name: item.full_name,
          value: birthday ? day_phrase : null
        }
      )}
      placement="bottom"
    >
      <Box p={1}>
        <ItemMedia>
          <UserAvatar user={item} size={80} hoverCard={false} />
        </ItemMedia>
      </Box>
    </LightTooltip>
  );
}

FriendItem.displayName = 'FriendItemViewMainCard';
