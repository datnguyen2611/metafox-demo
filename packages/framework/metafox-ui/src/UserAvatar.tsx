import { RouteLink, useGlobal, IS_ADMINCP } from '@metafox/framework';
import { colorHash, getImageSrc, shortenFullName } from '@metafox/utils';
import { Avatar, AvatarProps, useTheme, styled, Box } from '@mui/material';
import { isEmpty, isNil } from 'lodash';
import React from 'react';

interface Base {
  full_name?: string;
  title?: string;
  link?: string;
  short_name?: string;
  avatar?: any;
  cover?: any;
  can_view_story?: boolean;
  has_new_story?: boolean;
}
export interface UserAvatarProps<T extends Base = Base> extends AvatarProps {
  user: T;
  size?: number;
  to?: string;
  url?: string;
  onClick?: any;
  noLink?: boolean;
  component?: string;
  'data-testid'?: string;
  hoverCard?: any;
  cover?: boolean;
  srcSizePrefers?: string;
  noStory?: boolean;
  showLiveStream?: boolean;
  has_live_story?: boolean;
}

const useMappingDefaultPhoto = user => {
  const { assetUrl } = useGlobal();

  if (isEmpty(user)) return;

  let source;

  const { module_name } = user;

  switch (module_name) {
    case 'group':
      source = assetUrl('group.cover_no_image');
      break;
    default:
      source = undefined;
  }

  return source;
};

const name = 'Avatar';

const RootStyled = styled(Box, { name })(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

const AvatarWrapper = styled(Avatar, {
  name,
  shouldForwardProp: props =>
    props !== 'hasNewStory' &&
    props !== 'variantStyle' &&
    props !== 'showLiveStream'
})<{ hasNewStory?: boolean; variantStyle?: any; showLiveStream?: boolean }>(
  ({ theme, hasNewStory, variantStyle, showLiveStream }) => ({
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: theme.palette.border.secondary,
    ...(theme.palette.mode === 'dark' && {
      borderWidth: 0
    }),
    ...((showLiveStream || !isNil(hasNewStory)) && {
      borderWidth: showLiveStream ? '2px' : '2.5px',
      borderColor: showLiveStream
        ? theme.palette.error.main
        : hasNewStory
        ? theme.palette.primary.main
        : theme.palette.grey[500],
      '&::before': {
        content: "''",
        position: 'absolute',
        PointerEvent: 'none',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        border: '2.5px solid #fff',
        borderColor: theme.palette.background.paper,
        borderRadius: !variantStyle || variantStyle === 'circular' ? '100%' : 0
      }
    })
  })
);

const WrapperLabel = styled(Box, {
  slot: 'WrapperLabel'
})(({ theme }) => ({
  marginTop: theme.spacing(-1.5),
  zIndex: 2,
  display: 'flex'
}));

export default function UserAvatar({
  user,
  size = 24,
  to,
  item = {},
  noLink,
  onClick,
  hoverCard: hoverCardProp,
  src,
  'data-testid': testid = 'userAvatar',
  cover,
  srcSizePrefers = '200x200',
  noStory = false,
  showLiveStream = false,
  ...rest
}: UserAvatarProps) {
  const { jsxBackend } = useGlobal();
  const LiveLabel = jsxBackend.get('livestreaming.ui.labelLive');

  const theme = useTheme();
  const altSrc = useMappingDefaultPhoto(user);
  const title = user?.title ?? (user?.full_name || 'NaN');
  const alt = shortenFullName(user?.full_name || user?.title);
  const style: any = {
    width: size,
    height: size,
    color: theme.palette.grey['50'],
    fontSize: size / 3
  };

  // LABEL LIVE: height 1/3size(max: 20px)
  // fontSize: 1/4size(max: 15px)
  const styleLabelLive = {
    margin: 0,
    height: Math.max(Math.min(size * (1 / 3), 20), 10) || '16px',
    fontSize:
      Math.max(Math.min(size * (1 / 4), 15), 8) || theme.mixins.pxToRem(12),
    padding: theme.spacing(0, 1)
  };
  const hoverCardUrl =
    user?.id && user?.module_name ? `/${user?.module_name}/${user?.id}` : '';
  const hoverCard = hoverCardProp ?? hoverCardUrl;
  const avatar =
    src ||
    getImageSrc(!cover ? user?.avatar : user?.cover, srcSizePrefers, altSrc);

  const {
    can_view_story,
    has_new_story,
    has_live_story: hasLiveVideoItem = false
  } = user || {};

  const hasLiveVideo = showLiveStream && hasLiveVideoItem;

  let toStory = null;

  if (!noStory && !noLink && can_view_story) {
    toStory = `/story/${user?.id}`;
  }

  if (!avatar) {
    style.backgroundColor = colorHash.hex(alt || '');
  }

  if (onClick || noLink) {
    return (
      <RootStyled>
        <AvatarWrapper
          src={avatar}
          data-testid={testid}
          alt={title}
          style={style}
          component={'span'}
          role="button"
          onClick={onClick}
          children={alt}
          hasNewStory={toStory ? has_new_story : null}
          showLiveStream={hasLiveVideo}
          {...rest}
        />
        {hasLiveVideo && LiveLabel ? (
          <WrapperLabel>
            <LiveLabel sx={styleLabelLive} />
          </WrapperLabel>
        ) : null}
      </RootStyled>
    );
  }

  return (
    <RootStyled>
      <AvatarWrapper
        src={avatar}
        alt={title}
        style={style}
        component={RouteLink}
        to={to ?? toStory ?? (IS_ADMINCP ? user?.url : user?.link)}
        data-testid={testid}
        hoverCard={hoverCard}
        children={alt}
        draggable={false}
        variant={rest?.variant}
        variantStyle={rest?.variant}
        hasNewStory={toStory ? has_new_story : null}
        showLiveStream={hasLiveVideo}
        {...rest}
      />
      {hasLiveVideo && LiveLabel ? (
        <WrapperLabel>
          <LiveLabel sx={styleLabelLive} />
        </WrapperLabel>
      ) : null}
    </RootStyled>
  );
}
