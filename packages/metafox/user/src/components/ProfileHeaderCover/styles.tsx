import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const wrapHeight = 320;
const wrapHeightMobile = 180;

export default makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        position: 'relative',
        backgroundColor: theme.palette.background.paper
      },
      imagePositionBox: {
        height: wrapHeight,
        overflow: 'hidden',
        position: 'relative',
        borderBottomWidth: 'thin',
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.border.secondary,
        [theme.breakpoints.down('sm')]: {
          height: wrapHeightMobile
        }
      },
      bgBlur: {
        backgroundColor: theme.palette.background.default,
        height: wrapHeight,
        filter: 'blur(60px)',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        [theme.breakpoints.down('sm')]: {
          height: wrapHeightMobile
        }
      },
      imageCover: {
        width: '100%',
        minHeight: wrapHeight,
        objectFit: 'cover',
        objectPosition: 'top',
        [theme.breakpoints.down('sm')]: {
          minHeight: wrapHeightMobile
        }
      },
      editCover: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1
      },
      imageDrag: {
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
          textAlign: 'center'
        }
      },
      overBg: {
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute'
      },
      linkModal: {
        position: 'relative',
        zIndex: 1
      },
      btnEditCover: {
        textTransform: 'capitalize'
      },
      iconEditCover: {
        margin: theme.spacing(0, 0.5)
      },
      textEditCover: {
        padding: theme.spacing(0, 0.5),
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      popper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        width: 300,
        boxShadow: theme.shadows[20]
      },
      repositionMessage: {
        position: 'absolute',
        left: '50%',
        top: 160,
        color: '#fff',
        transform: 'translate(-50%,-50%)',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,.4)',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
        pointerEvents: 'none',
        [theme.breakpoints.down('sm')]: {
          top: 90
        }
      },
      controlGroup: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(2),
        zIndex: 2
      },
      btnControl: {
        margin: `${theme.spacing(0, 0.5)} !important`,
        textTransform: 'capitalize'
      },
      btnCancel: {
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main
        }
      },
      isReposition: {
        cursor: 'move'
      }
    }),
  { name: 'MuiUserCoverPhoto' }
);
