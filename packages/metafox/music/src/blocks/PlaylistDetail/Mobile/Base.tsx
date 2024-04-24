import { useGetItems, useGlobal, useGetItem } from '@metafox/framework';
import { Block, BlockContent } from '@metafox/layout';
import { SongDetailViewProps } from '@metafox/music/types';
import {
  FormatDate,
  Image,
  LineIcon,
  UserAvatar,
  FeaturedFlag,
  SponsorFlag,
  DotSeparator,
  PrivacyIcon,
  UserName,
  HtmlViewerWrapper
} from '@metafox/ui';
import clsx from 'clsx';
import { Box, Skeleton, Typography, styled } from '@mui/material';
import * as React from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PlayList from './PlayList';
import useStyles from './styles';
import { getImageSrc } from '@metafox/utils';
import HtmlViewer from '@metafox/html-viewer';
import AttachmentFile from '@metafox/music/components/Attachment/attachment';
import { isArray, range } from 'lodash';
import ProfileLink from '@metafox/feed/components/FeedItemView/ProfileLink';

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

function PlaylistDetailMobile({
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
    usePageParams,
    dispatch
  } = useGlobal();
  const classes = useStyles();
  const [selectedSong, setSelectedSong] = React.useState();
  const pageParams = usePageParams();

  const [orderPlay, setOrderPlay] = React.useState([]);
  const [shuffle, setShuffle] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(false);

  const songs = useGetItems(item?.songs);
  const owner = useGetItem(item?.owner);

  React.useEffect(() => {
    setLoading(true);

    if (!item?.songs)
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

  React.useEffect(() => {
    if (isArray(item?.songs)) {
      setOrderPlay(Array.from(Array(item?.songs?.length).keys()));
    }
  }, [item?.songs]);

  if (!item) return null;

  const imagePlaylist = getImageSrc(
    item?.image,
    '500',
    assetUrl(`music.${isAlbum ? 'album' : 'playlist'}_no_image`)
  );

  const changeSong = (value: number) => {
    const index = songs.findIndex(song => song?.id === selectedSong?.id);
    const indexShuffle = orderPlay.findIndex(order => index === order);

    if (shuffle) {
      if (indexShuffle + value === orderPlay.length)
        setSelectedSong(songs[orderPlay[0]]);
      else setSelectedSong(songs[orderPlay[indexShuffle + value]]);
    } else {
      if (index + value === orderPlay.length) setSelectedSong(songs[0]);
      else setSelectedSong(songs[index + value]);
    }
  };

  const onEnded = e => {
    changeSong(1);
  };

  const handleShuffle = () => {
    if (!selectedSong?.destination) return;

    setShuffle(!shuffle);
    setOrderPlay(array => {
      return array.sort((a, b) => 0.5 - Math.random());
    });
  };

  const EmptyPage = jsxBackend.get('core.block.no_content_with_icon');

  return (
    <Block blockProps={blockProps} testid={`detailview ${item.resource_name}`}>
      <BlockContent>
        <div className={classes.root}>
          <div className={classes.bgCoverWrapper}>
            <div className={classes.bgCover}></div>
            <div className={classes.header}>
              <div className={classes.headerInner}>
                <div className={classes.titleWrapper}>
                  {item?.is_featured || item?.is_sponsor ? (
                    <div className={classes.itemFlag}>
                      <FeaturedFlag
                        variant="itemView"
                        value={item?.is_featured}
                      />
                      <SponsorFlag
                        variant="itemView"
                        value={item?.is_sponsor}
                        item={item}
                      />
                    </div>
                  ) : null}
                  <Typography component="h2" className={classes.pageTitle}>
                    {selectedSong?.name}
                  </Typography>
                </div>

                <Box
                  sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}
                  component="div"
                  mt={1}
                  fontWeight={600}
                >
                  <span className={classes.playlistLabel}>
                    {`${i18n.formatMessage({
                      id: isAlbum ? 'album' : 'playlist'
                    })}: `}
                  </span>
                  <span className={classes.playlistName}>{item.name}</span>
                </Box>
              </div>
              <Image
                src={imagePlaylist}
                className={classes.imgSong}
                aspectRatio={'11'}
              />
              <AudioPlayer
                className={clsx(
                  classes.audioPlayer,
                  !selectedSong?.destination && classes.disabledIcon
                )}
                src={selectedSong?.destination}
                showJumpControls={false}
                onEnded={onEnded}
                showSkipControls
                customVolumeControls={[]}
                customControlsSection={[
                  <LineIcon
                    onClick={handleShuffle}
                    sx={shuffle && { color: 'primary.main' }}
                    key="icon"
                    icon="ico-shuffle"
                    className={classes.btnControlAudio}
                  />,
                  RHAP_UI.MAIN_CONTROLS,
                  RHAP_UI.ADDITIONAL_CONTROLS
                ]}
                onClickNext={e => changeSong(1)}
                onClickPrevious={e => changeSong(-1)}
                customIcons={{
                  play: <LineIcon icon="ico-play" />,
                  pause: <LineIcon icon="ico-pause" />,
                  previous: (
                    <LineIcon
                      icon="ico-play-prev"
                      className={classes.btnControlAudio}
                    />
                  ),
                  next: (
                    <LineIcon
                      icon="ico-play-next"
                      className={classes.btnControlAudio}
                    />
                  ),
                  loop: (
                    <LineIcon
                      icon="ico-play-repeat"
                      className={classes.btnRepeatOn}
                    />
                  ),
                  loopOff: <LineIcon icon="ico-play-repeat" />
                }}
              />
            </div>
          </div>
          <div className={classes.viewContainer}>
            <ItemActionMenu
              identity={identity}
              icon={'ico-dottedmore-vertical-o'}
              state={state}
              handleAction={handleAction}
              className={classes.actionMenu}
            />
            <div className={classes.author}>
              <Box component="div">
                <UserAvatar user={user} size={48} />
              </Box>
              <div className={classes.authorInfo}>
                <UserName
                  color={'inherit'}
                  to={`/user/${user?.id}`}
                  user={user}
                  className={classes.userName}
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
              </div>
            </div>
            {item?.description && (
              <MusicContent>
                <HtmlViewerWrapper>
                  <HtmlViewer html={item?.text || item?.description} />
                </HtmlViewerWrapper>
              </MusicContent>
            )}
            <AttachmentFile attachments={item?.attachments} size="mini" />
            {loading ? (
              <Box component="div" mt={3} className={classes.itemContent}>
                {range(1, 4).map(index => (
                  <Box
                    key={index.toString()}
                    sx={{
                      display: 'flex',
                      mt: 1,
                      justifyContent: 'space-between'
                    }}
                  >
                    <Skeleton sx={{ flex: 1 }} />
                    <Skeleton width="30px" sx={{ ml: 2 }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box component="div" mt={3} className={classes.itemContent}>
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
                    item={item}
                    isAlbum={isAlbum}
                    songs={songs}
                    selectedSong={selectedSong}
                    setSelectedSong={setSelectedSong}
                  />
                )}
              </Box>
            )}
            <ItemDetailInteraction
              identity={identity}
              handleAction={handleAction}
            />
          </div>
        </div>
      </BlockContent>
    </Block>
  );
}

export default PlaylistDetailMobile;
