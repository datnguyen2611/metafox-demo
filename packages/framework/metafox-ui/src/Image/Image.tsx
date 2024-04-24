/**
 * @type: ui
 * name: ui.image.default
 */
import { Link, useGlobal } from '@metafox/framework';
import { ImageShape, LineIcon, ImageMatureState } from '@metafox/ui';
import { styled, Theme, Box, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';
import PlayerOverlay from './PlayerOverlay';
import { alpha } from '@mui/system/colorManipulator';

const name = 'Image';

const StyledBgImg = styled('span')({
  display: 'block',
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'border-box',
  backgroundSize: 'cover'
});

const MatureImageItem = styled(Box, {
  name,
  slot: 'MatureImageItem',
  overridesResolver(props, styles) {
    return [styles.MatureImageItem];
  }
})<{ isStrict?: boolean }>(({ theme, isStrict }) => ({
  position: 'absolute',
  containerName: 'imageMature',
  containerType: 'inline-size',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  padding: theme.spacing(2),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  cursor: 'pointer',
  ...(isStrict && {
    background: `radial-gradient(circle, ${alpha(
      theme.palette.grey[700],
      0.7
    )} 0%, ${alpha(theme.palette.grey[500], 0.5)} 100%)`
  })
}));
const InnerImage = styled(Box, {
  name,
  slot: 'InnerImage',
  overridesResolver(props, styles) {
    return [styles.InnerImage];
  }
})<{ isStrict?: boolean }>(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  '& img': {
    width: '100%',
    height: '100%',
    maxWidth: '100%'
  }
}));

const DescriptionMature = styled(Typography, {
  name,
  slot: 'DescriptionMature',
  overridesResolver(props, styles) {
    return [styles.DescriptionMature];
  }
})(({ theme }) => ({
  userSelect: 'none',
  '@container imageMature (max-width: 250px)': {
    // hide description when image too small
    display: 'none'
  }
}));

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        display: 'block',
        position: 'relative',
        width: '100%',
        '& img': {
          maxWidth: '100%'
        },
        '&:before': {
          content: '""',
          display: 'block',
          paddingBottom: '100%'
        }
      },
      ratiofixed: {
        width: '100%',
        height: '100%',
        '&:before': {
          display: 'none'
        }
      },
      ratioauto: {
        '&:before': {
          display: 'none'
        },
        '& img': {
          maxHeight: '750px',
          width: '100%'
        }
      },
      ratio169: {
        '&:before': {
          paddingBottom: '56.25%'
        }
      },
      ratio32: {
        '&:before': {
          paddingBottom: '66.66%'
        }
      },
      ratio23: {
        '&:before': {
          paddingBottom: '150%'
        }
      },
      ratio43: {
        '&:before': {
          paddingBottom: '75%'
        }
      },
      ratio34: {
        '&:before': {
          paddingBottom: '133.33%'
        }
      },
      ratio13: {
        '&:before': {
          paddingBottom: '31%'
        }
      },
      ratio11: {
        '&:before': {
          paddingBottom: '100%'
        }
      },
      square: {
        borderRadius: '0',
        '& img': {
          borderRadius: '0'
        }
      },
      circle: {
        borderRadius: '100%',
        '& img': {
          borderRadius: '100%'
        }
      },
      radius: {
        borderRadius: theme.shape.borderRadius,
        '& img': {
          borderRadius: theme.shape.borderRadius
        }
      },
      inner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        '& img': {
          width: '100%',
          height: '100%',
          maxWidth: '100%'
        }
      },
      bgImage: {
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'border-box'
      },
      blur1: {
        '& $bgImage': {
          filter: 'blur(25px)'
        },
        '& img': {
          filter: 'blur(25px)'
        }
      },
      blur2: {
        '& $bgImage': {
          filter: 'blur(5px)'
        },
        '& img': {
          filter: 'blur(5px)'
        }
      },
      cover: {
        '& $bgImage': {
          backgroundSize: 'cover'
        },
        '& img': {
          objectFit: 'cover'
        }
      },
      contain: {
        '& $bgImage': {
          backgroundSize: 'contain'
        },
        '& img': {
          objectFit: 'contain'
        }
      }
    }),
  { name: 'MuiImage' }
);

const DEFAULT_RATIO = 'auto';

const ImageBlock = ({
  aspectRatio = DEFAULT_RATIO,
  src,
  alt,
  imgClass,
  onLoad,
  backgroundImage,
  classes,
  playerOverlay,
  playerOverlayProps
}: ImageShape) => (
  <>
    {'auto' === aspectRatio ? (
      <img src={src} alt={alt} className={imgClass} onLoad={onLoad} />
    ) : (
      <InnerImage>
        {backgroundImage ? (
          <StyledBgImg
            className={classes.bgImage}
            style={{ backgroundImage: `url(${src})` }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className={imgClass}
            onLoad={onLoad}
          />
        )}
      </InnerImage>
    )}
    {playerOverlay && <PlayerOverlay {...playerOverlayProps} />}
  </>
);

export default function Image(props: ImageShape) {
  const {
    aspectRatio = DEFAULT_RATIO,
    shape = 'square',
    link,
    linkParams: linkParamsProps = {},
    asModal,
    imageFit = 'cover',
    className,
    'data-testid': testid,
    style = {},
    matureProps = {},
    identity
  } = props;
  const maturePropsSetting = {
    color: 'white',
    showDescription: true,
    ...matureProps
  };
  const {
    dialogBackend,
    i18n,
    getAcl,
    dispatch,
    useGetItem,
    assetUrl,
    navigate
  } = useGlobal();
  const ageMature = getAcl('photo.photo.mature_photo_age_limit');
  const item = useGetItem(identity);

  const { mature: matureDefault, _mature, extra } = item || {};
  const mature = extra?.can_view_mature ? 0 : _mature ?? matureDefault ?? 0;
  const blurClass = mature !== 0 ? `blur${mature}` : undefined;

  const classes = useStyles();
  const strictImageBg = assetUrl('photo.album_no_image');
  const handleConfirmMature = React.useCallback(async () => {
    const ok = await dialogBackend.confirm({
      message: i18n.formatMessage({
        id: 'photo_mature_warning_desc'
      }),
      title: i18n.formatMessage({
        id: 'photo_mature_warning_title'
      })
    });

    if (ok) {
      if (identity) {
        dispatch({
          type: 'editItemLocal',
          payload: { identity, data: { mature: 0, _mature: 0 } }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkParams = { ...linkParamsProps, to: link };
  const handleClickStrictMature = React.useCallback(() => {
    navigate(link, { state: { asModal, ...linkParamsProps } });
  }, [navigate, link, linkParamsProps, asModal]);

  if (mature) {
    const isStrictMature = mature === ImageMatureState.Strict;

    return (
      <Box
        data-testid={testid}
        className={clsx(
          classes.root,
          classes[shape],
          classes[`ratio${aspectRatio}`],
          classes[imageFit],
          classes[blurClass],
          className
        )}
        sx={{
          ...style
        }}
        onClick={isStrictMature ? handleClickStrictMature : handleConfirmMature}
      >
        <ImageBlock
          {...props}
          src={isStrictMature ? strictImageBg : props?.src}
          classes={classes}
        />
        <MatureImageItem isStrict={isStrictMature} {...maturePropsSetting}>
          <LineIcon
            icon={isStrictMature ? 'ico-eye-off-o' : 'ico-warning-o'}
            sx={{ fontSize: '40px' }}
          />
          {maturePropsSetting?.showDescription ? (
            <DescriptionMature mt={0.5}>
              {i18n.formatMessage(
                {
                  id: isStrictMature
                    ? 'mature_photo_strict_message'
                    : 'mature_photo_warning_message'
                },
                { age: ageMature }
              )}
            </DescriptionMature>
          ) : null}
        </MatureImageItem>
      </Box>
    );
  }

  return link ? (
    <Link
      asModal={asModal}
      data-testid={testid}
      className={clsx(
        classes.root,
        classes[shape],
        classes[`ratio${aspectRatio}`],
        classes[imageFit],
        classes[blurClass],
        className
      )}
      style={style}
      {...linkParams}
    >
      <ImageBlock {...props} classes={classes} />
    </Link>
  ) : (
    <div
      data-testid={testid}
      className={clsx(
        classes.root,
        classes[shape],
        classes[`ratio${aspectRatio}`],
        classes[imageFit],
        classes[blurClass],
        className
      )}
      style={style}
    >
      <ImageBlock {...props} classes={classes} />
    </div>
  );
}
