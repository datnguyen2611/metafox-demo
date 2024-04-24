/* eslint-disable max-len */
import ItemDetailInteraction from '@metafox/core/containers/ItemDetailInteraction';
import { Link, useGlobal, useResourceAction } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent } from '@metafox/layout';
import { APP_PHOTO, RESOURCE_ALBUM } from '@metafox/photo/constant';
import { AlbumDetailProps } from '@metafox/photo/types';
import { capitalizeWord } from '@metafox/photo/utils';
import {
  DotSeparator,
  FeaturedFlag,
  SponsorFlag,
  FormatDate,
  LineIcon,
  PrivacyIcon,
  UserAvatar,
  UserName,
  TruncateViewMore,
  HtmlViewerWrapper
} from '@metafox/ui';
import clsx from 'clsx';
import * as React from 'react';
import useStyles from './styles';
import { Box } from '@mui/material';

export type Props = AlbumDetailProps;

function PhotoAlbumDetail({
  item,
  user,
  identity,
  handleAction,
  state,
  blockProps
}: Props) {
  const classes = useStyles();
  const { jsxBackend, ItemActionMenu, useGetItem, i18n, usePageParams } =
    useGlobal();
  const PhotoAlbumView = jsxBackend.get('photo.block.pinView');
  const resourceAction = useResourceAction(
    APP_PHOTO,
    RESOURCE_ALBUM,
    'getAlbumItems'
  );
  const ownerItem = useGetItem(item?.owner);
  const { comment_id } = usePageParams();

  if (!item) return null;

  const { apiUrl, apiMethod } = resourceAction || {};
  const dataSource = {
    apiUrl,
    apiMethod,
    apiParams: 'sort=latest'
  };
  const contentType = 'photo_album';
  const pagingId = `photo-album/${item.id}`;

  const { is_featured, is_sponsor, name, text_parsed, photos, id, extra } =
    item;
  const to = `/photo/album/${id}`;
  let toAllAlbums = '/photo/albums';
  let labelLinkAlbum = i18n.formatMessage({ id: 'all_albums' });

  if (ownerItem && ownerItem?.resource_name !== 'user') {
    toAllAlbums = `${ownerItem?.link}/photo?stab=albums`;
    labelLinkAlbum = i18n.formatMessage(
      { id: 'all_albums_from_name' },
      { name: capitalizeWord(ownerItem.resource_name) }
    );
  }

  return (
    <Block blockProps={blockProps} testid={`detailview ${item.resource_name}`}>
      <BlockContent>
        <div className={classes.root}>
          <div
            className={clsx(classes.albumContent, photos && classes.hasPhotos)}
          >
            <div className={classes.actionsDropdown}>
              <ItemActionMenu
                className={classes.dropdownButton}
                identity={identity}
                state={state}
                handleAction={handleAction}
              >
                <LineIcon
                  icon={'ico-dottedmore-vertical-o'}
                  className={classes.iconButton}
                />
              </ItemActionMenu>
            </div>
            <div className={classes.albumContainer}>
              <Box sx={{ mb: 1 }}>
                <Link
                  to={toAllAlbums}
                  color="primary"
                  children={labelLinkAlbum}
                  className={classes.category}
                />
              </Box>
              <div className={classes.albumTitle}>
                {is_featured || is_sponsor ? (
                  <Box sx={{ display: 'inline-flex', mr: 1 }}>
                    <FeaturedFlag variant="itemView" value={is_featured} />
                    <SponsorFlag
                      value={is_sponsor}
                      variant="itemView"
                      item={item}
                    />
                  </Box>
                ) : null}
                <Link
                  to={to}
                  className={clsx(classes.title)}
                  children={name}
                  variant={'h4'}
                />
              </div>
              <div className={classes.owner}>
                <div className={classes.ownerAvatar}>
                  <UserAvatar user={user} size={48} />
                </div>
                <div className={classes.ownerInfo}>
                  <UserName
                    to={`/${user.user_name}`}
                    user={user}
                    className={classes.profileLink}
                  />
                  <DotSeparator sx={{ color: 'text.secondary', mt: 0.5 }}>
                    <FormatDate
                      data-testid="creationDate"
                      value={item.creation_date}
                      format="LL"
                    />
                    <PrivacyIcon
                      value={item?.privacy}
                      item={item?.privacy_detail}
                    />
                  </DotSeparator>
                </div>
              </div>
              {text_parsed ? (
                <div className={classes.info}>
                  <TruncateViewMore
                    truncateProps={{
                      variant: 'body1',
                      lines: 5
                    }}
                  >
                    <HtmlViewerWrapper>
                      <HtmlViewer html={text_parsed} />
                    </HtmlViewerWrapper>
                  </TruncateViewMore>
                </div>
              ) : null}
            </div>
            <ItemDetailInteraction
              identity={identity}
              handleAction={handleAction}
              borderBottom
              hideListComment={!comment_id}
            />
          </div>
          <PhotoAlbumView
            title=""
            numColumns={2}
            pagingId={pagingId}
            dataSource={dataSource}
            contentType={contentType}
            gridContainerProps={{ spacing: 1 }}
            emptyPage="photo.block.EmptyPhotoAlbum"
            emptyPageProps={{
              isVisible: extra?.can_upload_media
            }}
          />
        </div>
      </BlockContent>
    </Block>
  );
}

export default PhotoAlbumDetail;
