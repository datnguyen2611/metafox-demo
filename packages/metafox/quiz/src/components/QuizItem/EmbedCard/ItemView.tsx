import { Link, useGlobal } from '@metafox/framework';
import { EmbedQuizInFeedItemProps } from '@metafox/quiz';
import {
  FeedEmbedCard,
  FeaturedFlag,
  SponsorFlag,
  Statistic,
  TruncateText
} from '@metafox/ui';
import { Box } from '@mui/material';
import React from 'react';
import useStyles from './styles';

export default function EmbedQuizInFeedItemView({
  item,
  feed,
  isShared
}: EmbedQuizInFeedItemProps) {
  const classes = useStyles();
  const { LinkTrackingSponsor } = useGlobal();

  if (!item) return null;

  const trackingSponsor = feed?.is_sponsor && LinkTrackingSponsor;

  return (
    <FeedEmbedCard
      bottomSpacing="normal"
      item={item}
      feed={feed}
      isShared={isShared}
    >
      <div className={classes.itemInner} data-testid="embedview">
        <Box mb={1} fontWeight={600} className={classes.title}>
          {trackingSponsor ? (
            <LinkTrackingSponsor to={item.link} identity={feed?._identity}>
              <TruncateText variant="h4" lines={3}>
                {item.title}
              </TruncateText>
            </LinkTrackingSponsor>
          ) : (
            <Link to={item.link}>
              <TruncateText variant="h4" lines={3}>
                {item.title}
              </TruncateText>
            </Link>
          )}
        </Box>
        <Box className={classes.description} mb={2}>
          <TruncateText variant={'body1'} lines={3}>
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </TruncateText>
        </Box>
        <Box
          className={classes.wrapperInfoFlag}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Statistic
            values={item.statistic}
            display="total_play"
            skipZero={false}
            color="textHint"
          />
          <div className={classes.flagWrapper}>
            <FeaturedFlag
              variant="text"
              value={item.is_featured}
              color="primary"
              showTitleMobile={false}
            />
            {item.is_sponsor ? (
              <Box ml={1}>
                <SponsorFlag
                  variant="text"
                  value={item.is_sponsor}
                  color="yellow"
                  showTitleMobile={false}
                  item={item}
                />
              </Box>
            ) : null}
          </div>
        </Box>
      </div>
    </FeedEmbedCard>
  );
}
