import { Link, useGlobal } from '@metafox/framework';
import { usePageParams } from '@metafox/layout';
import { AlbumItemProps } from '@metafox/photo/types';
import {
  FeaturedFlag,
  Image,
  ItemMedia,
  ItemText,
  ItemTitle,
  ItemView,
  SponsorFlag,
  Statistic
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import { Box, styled } from '@mui/material';
import React from 'react';

const name = 'PhotoAlbumItemMainCard';

const ItemViewStyled = styled(ItemView, { name, slot: 'root' })(
  ({ theme }) => ({
    transition: 'all 0.2s ease',
    position: 'relative',
    '& .actionMenu': {
      position: 'absolute !important',
      right: theme.spacing(1),
      bottom: theme.spacing(-1),
      opacity: 1
    }
  })
);

const FlagWrapper = styled('div', { name, slot: 'flagWrapper' })(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(-0.25),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  })
);

const PhotoAlbumItemMainCard = ({
  item,
  user,
  identity,
  itemProps,
  handleAction,
  state,
  wrapAs,
  wrapProps
}: AlbumItemProps) => {
  const {
    ItemActionMenu,
    assetUrl,
    InViewTrackingSponsor,
    LinkTrackingSponsor
  } = useGlobal();
  const pageParams = usePageParams();
  const { module_name, profile_page, profile_id } = pageParams;

  if (!item) return null;

  const { name, statistic, is_featured, is_sponsor } = item;
  let to = `/photo/album/${item.id}`;

  if (profile_page && profile_id) {
    to = `/${module_name}/${profile_id}/photo?stab=albums&album_id=${item.id}`;
  }

  const cover = getImageSrc(
    item.image,
    '500',
    assetUrl('photo.album_no_image')
  );

  const isTrackingViewSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && InViewTrackingSponsor;
  const isTrackingClickSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && LinkTrackingSponsor;

  return (
    <ItemViewStyled
      wrapAs={wrapAs}
      wrapProps={wrapProps}
      testid={`${item.resource_name}`}
      data-eid={identity}
    >
      {isTrackingViewSponsor ? (
        <InViewTrackingSponsor identity={identity} />
      ) : null}
      <ItemMedia>
        {isTrackingClickSponsor ? (
          <LinkTrackingSponsor to={to} identity={identity}>
            <Image src={cover} aspectRatio={'32'} />
          </LinkTrackingSponsor>
        ) : (
          <Image link={to} src={cover} aspectRatio={'32'} />
        )}
      </ItemMedia>
      <FlagWrapper>
        <FeaturedFlag variant="itemView" value={is_featured} />
        <SponsorFlag value={is_sponsor} variant="itemView" item={item} />
      </FlagWrapper>
      <ItemText>
        <ItemTitle>
          {isTrackingClickSponsor ? (
            <LinkTrackingSponsor
              color={'inherit'}
              to={to}
              children={name}
              identity={identity}
            />
          ) : (
            <Link color={'inherit'} to={to} children={name} />
          )}
        </ItemTitle>
        <Box>
          <Statistic values={statistic} display="total_item" skipZero={false} />
          {itemProps.showActionMenu ? (
            <ItemActionMenu
              identity={identity}
              icon={'ico-dottedmore-vertical-o'}
              state={state}
              handleAction={handleAction}
              className={'actionMenu'}
            />
          ) : null}
        </Box>
      </ItemText>
    </ItemViewStyled>
  );
};

export default PhotoAlbumItemMainCard;
