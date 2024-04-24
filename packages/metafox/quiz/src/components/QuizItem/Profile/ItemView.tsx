import { Link, useGlobal } from '@metafox/framework';
import { useBlock } from '@metafox/layout';
import { QuizItemProps } from '@metafox/quiz/types';
import {
  FeaturedFlag,
  ItemAction,
  ItemMedia,
  ItemText,
  ItemTitle,
  ItemView,
  SponsorFlag,
  PendingFlag
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import { styled, Typography } from '@mui/material';
import React from 'react';
import useStyles from './styles';

const FlagWrapper = styled('span', {
  name: 'FlagWrapper'
})(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1)
}));

export default function QuizItemMainCard({
  item,
  itemProps,
  user,
  handleAction,
  state,
  identity,
  wrapAs,
  wrapProps
}: QuizItemProps) {
  const {
    ItemActionMenu,
    useIsMobile,
    i18n,
    InViewTrackingSponsor,
    LinkTrackingSponsor
  } = useGlobal();
  const classes = useStyles();
  const isMobile = useIsMobile();

  const { itemLinkProps = {} } = useBlock();

  if (!item) return null;

  const { is_sponsor } = item;

  const to = `/quiz/${item.id}`;

  const cover = getImageSrc(item.image, '240');

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
      {isTrackingClickSponsor ? (
        <LinkTrackingSponsor
          to={to}
          identity={identity}
          asModal={itemLinkProps.asModal}
        >
          <ItemMedia src={cover} alt={item.title} backgroundImage />
        </LinkTrackingSponsor>
      ) : (
        <ItemMedia
          asModal={itemLinkProps.asModal}
          src={cover}
          link={to}
          alt={item.title}
          backgroundImage
        />
      )}

      <ItemText>
        {isMobile ? (
          <FlagWrapper>
            <FeaturedFlag variant="itemView" value={item.is_featured} />
            <SponsorFlag
              variant="itemView"
              value={item.is_sponsor}
              item={item}
            />
            <PendingFlag variant="itemView" value={item.is_pending} />
          </FlagWrapper>
        ) : null}
        <ItemTitle>
          {isTrackingClickSponsor ? (
            <LinkTrackingSponsor
              to={to}
              identity={identity}
              color={'inherit'}
              children={item.title}
            />
          ) : (
            <Link to={to} children={item.title} color={'inherit'} />
          )}
        </ItemTitle>
        {itemProps.showActionMenu ? (
          <ItemAction placement="top-end" spacing="normal">
            <ItemActionMenu
              identity={identity}
              icon={'ico-dottedmore-vertical-o'}
              state={state}
              handleAction={handleAction}
            />
          </ItemAction>
        ) : null}
        <Typography variant="body2" color="text.secondary" mt={1}>
          {i18n.formatMessage(
            { id: 'total_vote' },
            { value: item.statistic.total_play }
          )}
        </Typography>
        {!isMobile ? (
          <div className={classes.itemFlag}>
            <FeaturedFlag variant="itemView" value={item.is_featured} />
            <SponsorFlag
              variant="itemView"
              value={item.is_sponsor}
              item={item}
            />
            <PendingFlag variant="itemView" value={item.is_pending} />
          </div>
        ) : null}
      </ItemText>
    </ItemView>
  );
}
