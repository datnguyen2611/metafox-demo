/**
 * @type: ui
 * name: feedUpdateAvatar.embedItem.insideFeedItem
 */
import { Link, useGlobal, useGetItem } from '@metafox/framework';
import { PhotoItemShape } from '@metafox/photo';
import { getImageSrc } from '@metafox/utils';
import { Box, styled } from '@mui/material';
import * as React from 'react';
import { FeedEmbedCard } from '@metafox/ui';

type Props = {
  ownerPhotoIdentity?: string;
  'data-testid': string;
  item: PhotoItemShape;
  feed?: Record<string, any>;
  isShared?: boolean;
};

const Root = styled('div', {
  name: 'FeedItem',
  slot: 'updateAvatarWrapper',
  overridesResolver(props, styles) {
    return [styles.updateAvatarWrapper];
  }
})(({ theme }) => ({
  display: 'block',
  paddingBottom: theme.spacing(2)
}));

export default function FeedPhotoGrid({
  item,
  feed,
  'data-testid': testid,
  ownerPhotoIdentity,
  isShared: isSharedProp
}: Props) {
  const { assetUrl, ProfileHeaderAvatar, ProfileHeaderCover } = useGlobal();
  const ownerPhoto = useGetItem(ownerPhotoIdentity);
  const isShared = isSharedProp;

  const trackingSponsor = feed?.is_sponsor;

  return (
    <FeedEmbedCard
      variant="default"
      bottomSpacing="normal"
      item={item}
      feed={feed}
      isShared={isShared}
      sxOuter={{
        overflow: 'visible',
        borderRadius: 0,
        borderWidth: 0,
        borderBottomWidth: 1,
        margin: theme => `0 ${theme.spacing(-2)}`
      }}
      sx={{ paddingTop: 0 }}
    >
      <Root data-testid={testid}>
        <Box>
          <Link
            asModal
            sx={{ display: ' block', position: 'relative' }}
            to={`/photo/${item.id}`}
            identityTrackingClick={
              trackingSponsor ? feed?._identity : undefined
            }
          >
            <ProfileHeaderCover
              image={getImageSrc(
                ownerPhoto?.cover,
                'origin',
                assetUrl('user.cover_no_image')
              )}
              alt={''}
              left={0}
              top={0}
              isUpdateAvatar
            />
            <ProfileHeaderAvatar
              avatar={getImageSrc(
                item.avatar || item.image,
                '500',
                assetUrl('user.no_image')
              )}
              alt={''}
              isUpdateAvatar
              showLiveStream={false}
            />
          </Link>
        </Box>
      </Root>
    </FeedEmbedCard>
  );
}
