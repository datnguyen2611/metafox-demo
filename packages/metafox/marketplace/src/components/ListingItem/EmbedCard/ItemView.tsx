import { Link, useGlobal } from '@metafox/framework';
import { EmbedListingInFeedItemProps } from '@metafox/marketplace';
import {
  FeaturedFlag,
  FeedEmbedCard,
  FeedEmbedCardMedia,
  LineIcon,
  SponsorFlag,
  Statistic,
  TruncateText
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import { Box, styled } from '@mui/material';
import React from 'react';

const name = 'EmbedListingInFeedItemView';

const ItemInner = styled('div', { name, slot: 'itemInner' })(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column'
}));
const Price = styled('div', { name, slot: 'Price' })(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.error.main
}));

const PriceNotAvailable = styled('div', { name, slot: 'PriceNotAvailable' })(
  ({ theme }) => ({
    color: theme.palette.text.hint,
    fontSize: theme.mixins.pxToRem(13),
    fontWeight: 'normal',
    '& span': {
      marginLeft: theme.spacing(0.5)
    }
  })
);
const FlagWrapper = styled('span', {
  name,
  slot: 'flagWrapper'
})(({ theme }) => ({
  marginLeft: 'auto',
  '& > .MuiFlag-root': {
    marginLeft: theme.spacing(2.5)
  }
}));

export default function EmbedListingInFeedItemView({
  item,
  feed,
  isShared
}: EmbedListingInFeedItemProps) {
  const { i18n, assetUrl, LinkTrackingSponsor, useIsMobile } = useGlobal();
  const isMobile = useIsMobile();

  if (!item) return null;

  const trackingSponsor = feed?.is_sponsor && LinkTrackingSponsor;

  return (
    <FeedEmbedCard
      variant="list"
      bottomSpacing="normal"
      item={item}
      feed={feed}
      isShared={isShared}
    >
      {trackingSponsor ? (
        <LinkTrackingSponsor to={item.link} identity={feed?._identity}>
          <FeedEmbedCardMedia
            mediaRatio="11"
            widthImage="200px"
            image={getImageSrc(
              item.image,
              isMobile ? '500' : '200',
              assetUrl('marketplace.no_image')
            )}
          />
        </LinkTrackingSponsor>
      ) : (
        <FeedEmbedCardMedia
          mediaRatio="11"
          widthImage="200px"
          link={item.link ?? ''}
          image={getImageSrc(
            item.image,
            isMobile ? '500' : '200',
            assetUrl('marketplace.no_image')
          )}
        />
      )}
      <ItemInner data-testid="embedview">
        <TruncateText variant="h4" lines={2} sx={{ mb: 2 }}>
          {trackingSponsor ? (
            <LinkTrackingSponsor to={item.link} identity={feed?._identity}>
              {item.title}
            </LinkTrackingSponsor>
          ) : (
            <Link to={item.link ?? ''}>{item.title}</Link>
          )}
        </TruncateText>
        {item?.short_description && (
          <TruncateText
            component="div"
            variant={'body1'}
            lines={3}
            sx={{ mb: 2 }}
          >
            <div dangerouslySetInnerHTML={{ __html: item.short_description }} />
          </TruncateText>
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          mb={1}
        >
          {item?.is_free ? (
            <Price> {i18n.formatMessage({ id: 'free' })} </Price>
          ) : (
            <Price
              children={
                item?.price ?? (
                  <PriceNotAvailable>
                    {i18n.formatMessage({ id: 'price_is_not_available' })}
                    <LineIcon icon="ico-question-circle" />
                  </PriceNotAvailable>
                )
              }
            />
          )}
        </Box>
        <Box mt={'auto'} display="flex">
          <div>
            <Statistic
              values={item.statistic}
              display="total_view"
              fontStyle="minor"
              skipZero={false}
            />
          </div>
          <FlagWrapper>
            <FeaturedFlag
              variant="text"
              value={item.is_featured}
              color="primary"
              showTitleMobile={false}
            />
            <SponsorFlag
              color="yellow"
              variant="text"
              value={item.is_sponsor}
              showTitleMobile={false}
              item={item}
            />
          </FlagWrapper>
        </Box>
      </ItemInner>
    </FeedEmbedCard>
  );
}
