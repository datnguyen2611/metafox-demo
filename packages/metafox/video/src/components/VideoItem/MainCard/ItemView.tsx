import { Link, useGlobal } from '@metafox/framework';
import { useBlock } from '@metafox/layout';
import {
  FeaturedFlag,
  Image,
  ItemMedia,
  ItemSummary,
  ItemText,
  ItemTitle,
  ItemView,
  LineIcon,
  PendingFlag,
  SponsorFlag,
  Statistic,
  UserName
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import { VideoItemProps } from '@metafox/video/types';
import { Box, styled } from '@mui/material';
import * as React from 'react';
import useStyles from './styles';

const OverlayStyled = styled(Box, {
  shouldForwardProp: props => props !== 'isMobile'
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  opacity: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  '& .iconPlay': {
    color: '#fff',
    fontSize: 48,
    position: 'relative'
  },
  '&:hover': {
    opacity: 1
  },
  ...(isMobile && {
    opacity: 1
  })
}));

const MediaStyled = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0.4)',
  aspectRatio: '16 / 9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.mixins.pxToRem(16),
  padding: theme.spacing(1)
}));

const VideoItemMainCard = ({
  item,
  user,
  identity,
  itemProps,
  handleAction,
  state,
  wrapAs,
  wrapProps
}: VideoItemProps) => {
  const classes = useStyles();
  const {
    ItemActionMenu,
    assetUrl,
    useIsMobile,
    InViewTrackingSponsor,
    LinkTrackingSponsor,
    i18n
  } = useGlobal();
  const { itemProps: { media = {} } = {} } = useBlock();
  const isMobile = useIsMobile();

  if (!item) return null;

  const to = `/video/play/${item.id}`;
  const { is_sponsor } = item;

  const noImage = item?.is_processing
    ? assetUrl('video.video_in_processing_image')
    : assetUrl('video.no_image');
  const cover = getImageSrc(item.image, '500', noImage);

  const isTrackingViewSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && InViewTrackingSponsor;
  const isTrackingClickSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && LinkTrackingSponsor;

  return (
    <ItemView
      wrapAs={wrapAs}
      wrapProps={wrapProps}
      testid={`${item.resource_name}`}
      data-eid={identity}
    >
      {isTrackingViewSponsor ? (
        <InViewTrackingSponsor identity={identity} />
      ) : null}
      <div className={classes.itemFlag}>
        <FeaturedFlag variant="itemView" value={item.is_featured} />
        <SponsorFlag variant="itemView" value={item.is_sponsor} item={item} />
        <PendingFlag variant="itemView" value={item.is_pending} />
      </div>
      {item?.is_failed ? (
        <MediaStyled>
          <LineIcon icon="ico-warning" sx={{ fontSize: '24px' }} />
          <Box mt={1}>
            {i18n.formatMessage({ id: 'video_has_been_processed_failed' })}
          </Box>
        </MediaStyled>
      ) : (
        <ItemMedia src={cover} backgroundImage>
          {isTrackingClickSponsor ? (
            <LinkTrackingSponsor to={to} identity={identity} asModal>
              <Box sx={{ position: 'relative' }}>
                {item?.is_processing ? (
                  <MediaStyled>
                    <LineIcon
                      icon="ico-loading-icon"
                      sx={{ fontSize: '24px' }}
                    />
                    <Box mt={1}>
                      {i18n.formatMessage({ id: 'video_is_being_processed' })}
                    </Box>
                  </MediaStyled>
                ) : (
                  <Image src={cover} {...media} />
                )}
                <OverlayStyled isMobile={isMobile}>
                  <LineIcon className="iconPlay" icon="ico-play-circle-o" />
                </OverlayStyled>
              </Box>
            </LinkTrackingSponsor>
          ) : (
            <Link to={to} asModal>
              <Box sx={{ position: 'relative' }}>
                {item?.is_processing ? (
                  <MediaStyled>
                    <LineIcon
                      icon="ico-loading-icon"
                      sx={{ fontSize: '24px' }}
                    />
                    <Box mt={1}>
                      {i18n.formatMessage({ id: 'video_is_being_processed' })}
                    </Box>
                  </MediaStyled>
                ) : (
                  <Image src={cover} {...media} />
                )}
                <OverlayStyled isMobile={isMobile}>
                  <LineIcon className="iconPlay" icon="ico-play-circle-o" />
                </OverlayStyled>
              </Box>
            </Link>
          )}
        </ItemMedia>
      )}
      <ItemText>
        <ItemTitle className={classes.itemTitle}>
          {isTrackingClickSponsor ? (
            <LinkTrackingSponsor to={to} identity={identity} asModal>
              {item.title}
            </LinkTrackingSponsor>
          ) : (
            <Link to={to} asModal>
              {item.title}
            </Link>
          )}
        </ItemTitle>
        <Box>
          <ItemSummary>
            <UserName
              to={`/${user?.user_name}`}
              user={user}
              data-testid="itemAuthor"
              hoverCard={false}
            />
          </ItemSummary>
          <Statistic values={item.statistic} display={'total_view'} />
          {itemProps.showActionMenu ? (
            <ItemActionMenu
              identity={identity}
              icon={'ico-dottedmore-vertical-o'}
              handleAction={handleAction}
              className={classes.actionMenu}
            />
          ) : null}
        </Box>
      </ItemText>
    </ItemView>
  );
};

export default VideoItemMainCard;
