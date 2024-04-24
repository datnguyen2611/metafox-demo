import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

export default makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        maxWidth: 720,
        margin: 'auto',
        backgroundColor: theme.palette.background.paper
      },
      albumContent: {
        padding: theme.spacing(2),
        position: 'relative'
      },
      category: {
        fontSize: theme.mixins.pxToRem(13),
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1.5),
        display: 'inline-block'
      },
      albumTitle: {
        marginBottom: theme.spacing(0.5),
        overflow: 'hidden'
      },
      title: {
        color: theme.palette.text.primary,
        fontSize: theme.mixins.pxToRem(24),
        fontWeight: theme.typography.fontWeightBold
      },
      hasFeatures: {
        padding: theme.spacing(0, 1.5)
      },
      albumContainer: {},
      info: {
        color: theme.palette.text.primary,
        fontSize: theme.mixins.pxToRem(15),
        padding: theme.spacing(1, 0)
      },
      profileLink: {
        color: theme.palette.text.primary,
        fontSize: theme.mixins.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold
      },
      owner: {
        overflow: 'hidden',
        padding: theme.spacing(1.5, 0),
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      },
      ownerInfo: {
        overflow: 'hidden',
        flexGrow: 1
      },
      ownerAvatar: {
        float: 'left',
        marginRight: theme.spacing(2)
      },
      date: {
        fontSize: theme.mixins.pxToRem(13),
        color: theme.palette.text.secondary,
        paddingTop: theme.spacing(0.5)
      },
      listingActions: {
        display: 'inline-flex',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(0.5),
        [theme.breakpoints.down('xs')]: {
          display: 'flex'
        }
      },
      actionMenu: {
        border: '1px solid',
        width: '40px',
        height: '40px',
        borderRadius: theme.spacing(0.5),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.main,
        justifyContent: 'center'
      },
      listingHeader: {
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
          display: 'block'
        }
      },
      listingComment: {
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
          padding: theme.spacing(0, 2)
        }
      },
      hasPhotos: {
        marginBottom: theme.spacing(2)
      },
      actionsDropdown: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1)
      },
      iconButton: {
        fontSize: theme.mixins.pxToRem(13)
      },
      dropdownButton: {
        padding: theme.spacing(1),
        width: 30,
        height: 30,
        textAlign: 'center'
      }
    }),
  { name: 'MuiPhotoMobileViewDetail' }
);
