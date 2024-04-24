import { useGlobal } from '@metafox/framework';
import { Image, LineIcon, TruncateText } from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import { Box, CircularProgress, styled, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import useStyles from './AttachmentItem.styles';

const IconDownStyled = styled(Box, {
  shouldForwardProp: props => props !== 'downloading'
})<{ downloading?: boolean }>(({ theme, downloading }) => ({
  ...(downloading && {
    background: theme.palette.action.disabledBackground,
    borderColor: theme.palette.action.disabledBackground,
    opacity: theme.palette.action.disabledOpacity,
    cursor: 'auto'
  })
}));

export type AttachmentItemProps = {
  fileName: string;
  downloadUrl?: string;
  identity: string;
  isImage: boolean;
  fileSizeText?: string;
  size?: 'small' | 'large' | 'mini';
  image?: Record<number, any>;
};

export default function AttachmentItem(props: AttachmentItemProps) {
  const {
    fileName,
    isImage,
    fileSizeText,
    size = 'small',
    image,
    identity
  } = props;
  const { dispatch, getSetting, i18n } = useGlobal();
  const classes = useStyles();
  const downloadIconRef = React.useRef<HTMLAnchorElement>();
  const setting = getSetting('attachment');
  const [downloading, setDownloading] = React.useState(false);

  const [widthDownIcon, setWidthDownIcon] = React.useState('40px');

  React.useEffect(() => {
    const width =
      downloadIconRef.current &&
      `${downloadIconRef.current.getBoundingClientRect().width}px`;

    setWidthDownIcon(width);
  }, []);

  const icon = isImage ? 'ico-file-photo-o' : 'ico-file-zip-o';
  const photo = getImageSrc(image, '500');
  const photoFull = getImageSrc(image, 'origin');

  const presentPhoto = src => {
    dispatch({
      type: 'photo/presentSimplePhoto',
      payload: { src, alt: 'photo', identity }
    });
  };

  const handleDownloading = () => setDownloading(false);

  const downloadItem = () => {
    if (downloading) return;

    setDownloading(true);
    dispatch({
      type: 'core/downloadItem',
      payload: { identity },
      meta: { onSuccess: handleDownloading, onFailure: handleDownloading }
    });
  };

  return (
    <div
      className={clsx(
        classes.attachmentWrapper,
        size === 'large' && classes.largeSize,
        size === 'mini' && classes.miniSize
      )}
    >
      <div className={classes.attachmentPhoto}>
        {isImage ? (
          <div onClick={() => presentPhoto(photoFull)} role="button">
            <Image aspectRatio="11" src={photo} alt={'photo'} />
          </div>
        ) : (
          <LineIcon className={classes.attachmentTypeIcon} icon={icon} />
        )}
      </div>

      <div className={classes.statistic}>
        <TruncateText
          className={classes.fileName}
          lines={1}
          variant="body1"
          sx={{ fontWeight: 600, paddingRight: widthDownIcon }}
        >
          {fileName}
        </TruncateText>
        <div className={classes.fileSize}>{fileSizeText}</div>
      </div>
      {setting ? (
        <Tooltip
          title={i18n.formatMessage({
            id: downloading ? 'downloading' : 'download'
          })}
        >
          <IconDownStyled
            downloading={downloading}
            ref={downloadIconRef}
            onClick={downloadItem}
            className={clsx(
              classes.downloadButton,
              size === 'large' && classes.largeDownloadButton
            )}
          >
            {downloading ? (
              <CircularProgress
                size={18}
                color="info"
                className={classes.downloadIcon}
              />
            ) : (
              <LineIcon
                className={classes.downloadIcon}
                icon={'ico-download'}
              />
            )}
          </IconDownStyled>
        </Tooltip>
      ) : null}
    </div>
  );
}
