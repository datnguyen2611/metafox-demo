import { useGlobal, useGetItem } from '@metafox/framework';
import { Block, BlockContent } from '@metafox/layout';
import { SongDetailViewProps } from '@metafox/music/types';
import { getImageSrc } from '@metafox/utils';
import {
  FeaturedFlag,
  FormatDate,
  Image,
  UserAvatar,
  SponsorFlag,
  DotSeparator,
  PrivacyIcon,
  LineIcon,
  UserName,
  HtmlViewerWrapper,
  ItemTitle
} from '@metafox/ui';
import { Box, Table, styled } from '@mui/material';
import * as React from 'react';
import Waveform from '../Waveform/Waveform';
import PlayList from './PlayList';
import HtmlViewer from '@metafox/html-viewer';
import { isEmpty, range } from 'lodash';
import AttachmentFile from '@metafox/music/components/Attachment/attachment';
import ProfileLink from '@metafox/feed/components/FeedItemView/ProfileLink';
import { IntlShape } from 'react-intl';

const HeadlineSpan = styled('span', { name: 'HeadlineSpan' })(({ theme }) => ({
  paddingRight: theme.spacing(0.5),
  color: theme.palette.text.secondary
}));

const MusicContent = styled('div', { name: 'MusicContent' })(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15),
  lineHeight: 1.33
}));

const OwnerStyled = styled(ProfileLink, { name: 'OwnerStyled' })(
  ({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    fontSize: theme.mixins.pxToRem(15),
    '&:hover': {
      textDecoration: 'underline'
    }
  })
);

const BgCoverWrapper = styled('div', { name: 'BgCoverWrapper' })(
  ({ theme }) => ({
    height: 320,
    overflow: 'hidden',
    position: 'relative'
  })
);

const BgCoverInner = styled('div', { name: 'BgCoverInner' })(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: -1
}));

const BgCover = styled('div', { name: 'BgCover' })(({ theme }) => ({
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  filter: 'brightness(0.4) blur(50px)'
}));

const Header = styled('div', { name: 'Header' })(({ theme }) => ({
  marginLeft: theme.spacing(2),
  color: '#fff',
  paddingTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between'
}));

const HeaderInner = styled('div', { name: 'HeaderInner' })(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  margin: theme.spacing(0, 3, 0, 2),
  display: 'flex',
  flexDirection: 'column'
}));

const ImgSong = styled(Image, { name: 'ImgSong' })(({ theme }) => ({
  width: 212,
  height: 212
}));

const TitleWrapper = styled('div', { name: 'TitleWrapper' })(({ theme }) => ({
  display: 'flex'
}));

const MinorInfo = styled('div', { name: 'MinorInfo' })(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  fontSize: 13,
  fontWeight: 'normal',
  color: '#cecece'
}));

const PageTitle = styled(Box, { name: 'PageTitle' })(({ theme }) => ({
  margin: theme.spacing(1.5, 0),
  fontWeight: theme.typography.fontWeightBold,
  flex: 1,
  minWidth: 0,
  fontSize: theme.spacing(3),
  lineHeight: 1.3,
  maxHeight: 72,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  WebkitLineClamp: 1,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  '& .ico-heart': {
    color: theme.palette.primary.main
  }
}));

const Statistic = styled('span', { name: 'Statistic' })(({ theme }) => ({
  '&::after': {
    content: '"•"',
    margin: theme.spacing(0, 1)
  }
}));

const SoundWave = styled('div', { name: 'SoundWave' })(({ theme }) => ({
  marginTop: 'auto'
}));

const ViewContainer = styled('div', { name: 'viewContainer' })(({ theme }) => ({
  margin: theme.spacing(0, 2, 0, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.mixins.backgroundColor('paper'),
  border: theme.mixins.border('secondary'),
  padding: theme.spacing(0, 2, 2, 2),
  position: 'relative',
  marginTop: -44
}));

const WrapActionStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

const Author = styled('div', { name: 'Author' })(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2)
}));

const AuthorInfo = styled('div', { name: 'AuthorInfo' })(({ theme }) => ({
  marginLeft: theme.spacing(1.5)
}));

const UserNameWrapper = styled(UserName, { name: 'UserNameWrapper' })(
  ({ theme }) => ({
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    paddingRight: theme.spacing(0.5)
  })
);

const PlaylistContent = styled('div', { name: 'AuthorInfo' })(({ theme }) => ({
  fontSize: 15,
  lineHeight: 1.33,
  marginTop: theme.spacing(3)
}));

const secondsToHms = (second: number, i18n: IntlShape) => {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const seconds = Math.floor((second % 3600) % 60);

  const hDisplay =
    hours > 0 ? `${hours} ${i18n.formatMessage({ id: 'time_hr' })} ` : '';
  const mDisplay =
    minutes > 0 ? `${minutes} ${i18n.formatMessage({ id: 'time_min' })} ` : '';
  const sDisplay =
    seconds > 0 ? `${seconds} ${i18n.formatMessage({ id: 'time_sec' })}` : '';

  return hDisplay + mDisplay + sDisplay;
};

function PlaylistDetail({
  item,
  user,
  blockProps,
  identity,
  handleAction,
  state,
  isAlbum
}: SongDetailViewProps) {
  const {
    ItemActionMenu,
    ItemDetailInteraction,
    i18n,
    assetUrl,
    jsxBackend,
    dispatch,
    usePageParams
  } = useGlobal();

  const [selectedSong, setSelectedSong] = React.useState();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const pageParams = usePageParams();

  const owner = useGetItem(item?.owner);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    if (
      isEmpty(item?.songs) ||
      item?.statistic?.total_song > item?.songs?.length
    )
      dispatch({
        type: 'music/getListSong',
        meta: {
          onSuccess: ({ data }) => {
            setLoading(!data);
          }
        },
        payload: { identity }
      });
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParams]);

  if (!item) return null;

  const imageSong = getImageSrc(
    item?.image,
    '500',
    assetUrl(`music.${isAlbum ? 'album' : 'playlist'}_no_image`)
  );

  const EmptyPage = jsxBackend.get('core.block.no_content_with_icon');
  const LoadingSkeleton = jsxBackend.get(
    'music_song.itemView.listingCard.skeleton'
  );

  return (
    <Block testid={`detailview ${item.resource_name}`}>
      <BlockContent>
        <Box>
          <BgCoverWrapper>
            <BgCoverInner>
              <BgCover style={{ backgroundImage: `url(${imageSong})` }} />
            </BgCoverInner>
            <Header>
              <ImgSong src={imageSong} aspectRatio={'11'} />
              <HeaderInner>
                <ItemTitle>
                  <FeaturedFlag variant="itemView" value={item?.is_featured} />
                  <SponsorFlag
                    variant="itemView"
                    value={item.is_sponsor}
                    item={item}
                  />
                </ItemTitle>
                <TitleWrapper>
                  <PageTitle>{item?.name}</PageTitle>
                </TitleWrapper>
                <MinorInfo>
                  <Statistic>
                    {i18n.formatMessage({ id: isAlbum ? 'album' : 'playlist' })}
                  </Statistic>
                  {item?.year && <Statistic>{item?.year}</Statistic>}

                  <Box mr={0.5}>
                    {i18n.formatMessage(
                      { id: 'total_song' },
                      {
                        value: item.statistic?.total_song
                      }
                    )}
                    {item.statistic?.total_duration
                      ? `, ${secondsToHms(
                          item.statistic?.total_duration,
                          i18n
                        )}`
                      : null}
                  </Box>
                </MinorInfo>
                <SoundWave>
                  {selectedSong?.destination && item?.songs?.length ? (
                    <Waveform
                      url={selectedSong?.destination}
                      isPlaylist
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      songs={item?.songs}
                      selectedSong={selectedSong}
                      setSelectedSong={setSelectedSong}
                    />
                  ) : null}
                </SoundWave>
              </HeaderInner>
            </Header>
          </BgCoverWrapper>

          <ViewContainer>
            <WrapActionStyled>
              <ItemActionMenu
                identity={identity}
                icon={'ico-dottedmore-vertical-o'}
                state={state}
                handleAction={handleAction}
                size="smaller"
              />
            </WrapActionStyled>
            <Author>
              <Box component="div">
                <UserAvatar user={user} size={48} />
              </Box>
              <AuthorInfo>
                <UserNameWrapper
                  color={'inherit'}
                  to={`/user/${user?.id}`}
                  user={user}
                  hoverCard={false}
                />
                {owner?.resource_name !== user?.resource_name && (
                  <HeadlineSpan>
                    {i18n.formatMessage(
                      {
                        id: 'to_parent_user'
                      },
                      {
                        icon: () => <LineIcon icon="ico-caret-right" />,
                        parent_user: () => <OwnerStyled user={owner} />
                      }
                    )}
                  </HeadlineSpan>
                )}
                <DotSeparator sx={{ color: 'text.secondary', mt: 0.5 }}>
                  <FormatDate value={item?.creation_date} format="LL" />
                  <PrivacyIcon
                    value={item?.privacy}
                    item={item?.privacy_detail}
                  />
                </DotSeparator>
              </AuthorInfo>
            </Author>
            {item?.description && (
              <MusicContent>
                <HtmlViewerWrapper>
                  <HtmlViewer html={item?.text || item?.description} />
                </HtmlViewerWrapper>
              </MusicContent>
            )}
            <AttachmentFile attachments={item?.attachments} size="large" />
            <PlaylistContent mt={3}>
              {loading ? (
                <Table>
                  {range(1, 4).map(index => (
                    <LoadingSkeleton key={index.toString()} />
                  ))}
                </Table>
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {!item?.songs?.length ? (
                    <EmptyPage
                      image="ico-music-note-o"
                      title="no_songs_found"
                      {...(item.extra.can_edit && {
                        labelButton: isAlbum
                          ? 'add_new_song'
                          : 'find_your_favorite'
                      })}
                      action={
                        isAlbum
                          ? 'music/redirectToEditAlbum'
                          : 'music/redirectToAllSongs'
                      }
                      isIconButton={false}
                      description="find_your_favorite_music_and_add_to_your_list"
                    />
                  ) : (
                    <PlayList
                      identity={identity}
                      isAlbum={isAlbum}
                      songs={item?.songs}
                      selectedSong={selectedSong}
                      handleAction={handleAction}
                      setSelectedSong={setSelectedSong}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      item={item}
                    />
                  )}
                </>
              )}
            </PlaylistContent>
            <ItemDetailInteraction
              identity={identity}
              handleAction={handleAction}
            />
          </ViewContainer>
        </Box>
      </BlockContent>
    </Block>
  );
}

export default PlaylistDetail;
