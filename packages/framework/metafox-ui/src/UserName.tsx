import { Link, LinkProps, IS_ADMINCP } from '@metafox/framework';
import * as React from 'react';
import { ItemUserShape } from '.';
import { Box } from '@mui/material';

type UserNameProps = {
  user: ItemUserShape;
  to?: string;
  className?: string;
  hoverCard?: any;
} & LinkProps;

const UserName = ({
  user,
  to,
  color = 'inherit',
  underline = 'hover',
  hoverCard: hoverCardProp,
  ...rest
}: UserNameProps) => {
  if (!user) return null;

  if (user?.is_deleted) {
    return <Box component="span">{user?.full_name || user?.title}</Box>;
  }

  const resource_name = user?.module_name || 'user';

  const hoverCardUrl =
    user?.id && resource_name ? `/${resource_name}/${user?.id}` : '';
  const hoverCard = hoverCardProp ?? hoverCardUrl;
  const toLink =
    to ||
    (IS_ADMINCP
      ? user?.url
      : user?.user_name
      ? `/${user?.user_name}`
      : `/${user?.resource_name}/${user?.id}`);

  return (
    <Link
      underline={underline}
      color={color}
      hoverCard={hoverCard}
      to={toLink}
      {...rest}
    >
      {user?.full_name || user?.title}
    </Link>
  );
};

export default UserName;
