import { Link, useGlobal } from '@metafox/framework';
import { PhotoItemProps } from '@metafox/photo/types';
import {
  FeaturedFlag,
  ItemMedia,
  ItemView,
  PendingFlag,
  SponsorFlag
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import React from 'react';
import useStyles from './styles';

const PhotoItemMainCard = ({
  item,
  user,
  identity,
  handleAction,
  state,
  wrapAs,
  wrapProps,
  itemProps
}: PhotoItemProps) => {
  const classes = useStyles();
  const {
    ItemActionMenu,
    assetUrl,
    getAcl,
    InViewTrackingSponsor,
    LinkTrackingSponsor
  } = useGlobal();

  if (!item) return null;

  const canViewReactionItem = getAcl('like.like.view');
  const { id, statistic, is_sponsor } = item;
  const to = `/photo/${id}`;
  const cover = getImageSrc(item.image, '500', assetUrl('photo.no_image'));

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
      className={classes.root}
    >
      {isTrackingViewSponsor ? (
        <InViewTrackingSponsor identity={identity} />
      ) : null}
      <ItemMedia src={cover} backgroundImage identity={identity} />
      {isTrackingClickSponsor ? (
        <LinkTrackingSponsor to={to} identity={identity} asModal>
          <div className={classes.photoInfo}>
            {canViewReactionItem && statistic.total_like > 0 ? (
              <div className={classes.photoLike}>
                <span className="ico ico-thumbup-o"></span>
                <span className={classes.total_like}>
                  {statistic.total_like}
                </span>
              </div>
            ) : null}
          </div>
        </LinkTrackingSponsor>
      ) : (
        <Link to={to} asModal>
          <div className={classes.photoInfo}>
            {canViewReactionItem && statistic.total_like > 0 ? (
              <div className={classes.photoLike}>
                <span className="ico ico-thumbup-o"></span>
                <span className={classes.total_like}>
                  {statistic.total_like}
                </span>
              </div>
            ) : null}
          </div>
        </Link>
      )}

      <div className={classes.features}>
        <FeaturedFlag variant="itemView" value={item.is_featured} />
        <SponsorFlag value={item.is_sponsor} variant="itemView" item={item} />
        <PendingFlag variant="itemView" value={item.is_pending} />
      </div>
      <div className={classes.photoActions}>
        <ItemActionMenu
          state={state}
          identity={identity}
          handleAction={handleAction}
          className={classes.photoActionsDropdown}
          icon={'ico-dottedmore-vertical-o'}
        />
      </div>
    </ItemView>
  );
};

export default PhotoItemMainCard;
