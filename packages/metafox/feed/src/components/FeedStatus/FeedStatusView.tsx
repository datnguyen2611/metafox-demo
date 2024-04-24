import { useGlobal } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import {
  BackgroundSize,
  HtmlViewerWrapper,
  TruncateViewMore
} from '@metafox/ui';
import { getImageSrc } from '@metafox/utils';
import * as React from 'react';
import { styled } from '@mui/material';

const name = 'FeedStatus';
const StatusRoot = styled('div', { name })(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word',
  '& .profileLink, & .profileLink:active': {
    color: theme.palette.primary.main
  },
  '& a': {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));
const StatusBgWrapper = styled('div', {
  name: 'FeedItem',
  slot: 'StatusBgWrapper',
  overridesResolver(props, styles) {
    return [styles.statusBgWrapper];
  }
})(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word',
  '& .profileLink, & .profileLink:active': {
    color: theme.palette.primary.main
  },
  '& a': {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'border-box',
  border: '1px solid rgba(0,0,0,0.1)',
  width: 'auto',
  margin: `0 ${theme.spacing(-2)}`,
  '&:before': {
    content: '""',
    display: 'block',
    paddingBottom: '56.25%'
  },
  [theme.breakpoints.down('sm')]: {
    overflow: 'hidden'
  }
}));
const StatusBgInner = styled('div', { name })(({ theme }) => ({
  wordBreak: 'break-word',
  wordWrap: 'break-word',
  maxWidth: '100%',
  zIndex: 2,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  textAlign: 'center',
  overflow: 'hidden',
  width: '100%',
  paddingLeft: theme.spacing(9),
  paddingRight: theme.spacing(9),
  paddingBottom: theme.spacing(4.5),
  paddingTop: theme.spacing(4.5),
  margin: 0,
  fontSize: theme.mixins.pxToRem(28),
  lineHeight: '37px',
  fontWeight: 'bold',
  color: '#fff',
  '& p:empty': {
    margin: 0
  },
  '& a': {
    color: '#fff !important'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.mixins.pxToRem(20),
    lineHeight: '30px',
    padding: theme.spacing(2.5, 2)
  }
}));
export type FeedStatusViewProps = {
  backgroundImage?: Record<BackgroundSize, string>;
  status?: string;
  'data-testid'?: string;
};

export default function FeedStatusView({
  status,
  backgroundImage,
  'data-testid': testid = 'feed status'
}: FeedStatusViewProps) {
  const { useTheme, useIsMobile } = useGlobal();
  const theme = useTheme();

  const isMobile = useIsMobile();

  if (!status) return null;

  const background = getImageSrc(backgroundImage);

  return background ? (
    <StatusBgWrapper
      data-testid={testid}
      className={'withBackgroundStatus'}
      style={{ backgroundImage: `url(${background})` }}
    >
      <StatusBgInner>
        <HtmlViewer html={status} />
      </StatusBgInner>
    </StatusBgWrapper>
  ) : (
    <StatusRoot data-testid={testid}>
      <TruncateViewMore
        truncateProps={{
          variant: isMobile ? 'body2' : 'body1',
          lines: 3,
          style: { fontWeight: theme.typography.fontWeightRegular }
        }}
      >
        <HtmlViewerWrapper mt={0}>
          <HtmlViewer html={status} />
        </HtmlViewerWrapper>
      </TruncateViewMore>
    </StatusRoot>
  );
}
