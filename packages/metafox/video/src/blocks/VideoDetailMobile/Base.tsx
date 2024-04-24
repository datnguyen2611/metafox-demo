import { DialogContent } from '@metafox/dialog';
import { Link, useGlobal } from '@metafox/framework';
import {
  CategoryList,
  LineIcon,
  TruncateViewMore,
  AuthorInfo,
  ItemAction,
  HtmlViewerWrapper
} from '@metafox/ui';
import { Box, Divider, styled } from '@mui/material';
import * as React from 'react';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent } from '@metafox/layout';
import { VideoItemProps } from '@metafox/video/types';

const name = 'videoView';

const VideoContainer = styled('div', {
  name,
  slot: 'VideoContainer',
  shouldForwardProp: props => props !== 'fullScreenView'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#000',
  justifyContent: 'center',
  position: 'relative',
  flexGrow: 1,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderRadius: '0'
}));

const Root = styled(DialogContent, {
  name,
  slot: 'root'
})<{}>(({ theme }) => ({
  padding: '0 !important',
  height: '100%',
  display: 'flex',
  overflowX: 'hidden',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    flexFlow: 'column'
  }
}));

const HeaderItemAlbum = styled('div', { name, slot: 'HeaderItemAlbum' })(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column'
  })
);
const AlbumNameWrapper = styled('div', { name, slot: 'AlbumNameWrapper' })(
  ({ theme }) => ({
    '& .ico.ico-photos-o': {
      fontSize: theme.mixins.pxToRem(18),
      marginRight: theme.spacing(1)
    },
    display: 'flex',
    alignItems: 'center'
  })
);
const AlbumName = styled('div', { name, slot: 'AlbumName' })(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15)
}));

const Info = styled('div', { name, slot: 'Info' })(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15),
  color: theme.palette.text.primary,
  padding: theme.spacing(2)
}));

function VideoViewMobile({ identity, handleAction, state }: VideoItemProps) {
  const {
    ItemDetailInteraction,
    i18n,
    jsxBackend,
    useGetItem,
    useGetItems,
    ItemActionMenu
  } = useGlobal();
  const item = useGetItem(identity);

  const itemAlbum = useGetItem(item?.album);

  const categories = useGetItems<{ id: number; name: string }>(
    item?.categories
  );

  if (!item) return null;

  return (
    <Block testid={`detailview ${item.resource_name}`}>
      <BlockContent>
        <Root>
          <HeaderItemAlbum>
            {itemAlbum ? (
              <>
                <AlbumNameWrapper>
                  <LineIcon icon=" ico-photos-o" />
                  <AlbumName>
                    {i18n.formatMessage(
                      { id: 'from_album_name' },
                      {
                        name: (
                          <Link to={itemAlbum?.link}>{itemAlbum?.name}</Link>
                        )
                      }
                    )}
                  </AlbumName>
                </AlbumNameWrapper>
                <Box sx={{ pt: 2 }}>
                  <Divider />
                </Box>
              </>
            ) : null}
            <CategoryList
              data={categories}
              sx={{ pt: 2, mb: { sm: 1, xs: 0 }, textTransform: 'capitalize' }}
              displayLimit={2}
            />
          </HeaderItemAlbum>
          <Box sx={{ position: 'relative' }}>
            <AuthorInfo
              sx={{ margin: 0, padding: theme => theme.spacing(2, 0) }}
              item={item}
            />
            <ItemAction sx={{ position: 'absolute', top: 8, right: 8 }}>
              <ItemActionMenu
                identity={identity}
                icon={'ico-dottedmore-vertical-o'}
                state={state}
                menuName="detailActionMenu"
                handleAction={handleAction}
                size="smaller"
              />
            </ItemAction>
          </Box>
          <VideoContainer>
            {jsxBackend.render({
              component: 'video.itemView.modalCard',
              props: {
                item,
                isNativeControl: true
              }
            })}
          </VideoContainer>
          {item.description ? (
            <Info>
              <TruncateViewMore
                truncateProps={{
                  variant: 'body1',
                  lines: 3
                }}
              >
                <HtmlViewerWrapper mt={0}>
                  <HtmlViewer html={item.text || item.description} />
                </HtmlViewerWrapper>
              </TruncateViewMore>
            </Info>
          ) : null}
          <ItemDetailInteraction
            identity={identity}
            handleAction={handleAction}
          />
        </Root>
      </BlockContent>
    </Block>
  );
}

export default VideoViewMobile;
