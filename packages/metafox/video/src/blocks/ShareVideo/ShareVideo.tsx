/**
 * @type: block
 * name: video.block.ShareVideoBlock
 * title: Share Video Form
 * keywords: video
 * description: Share Video Form
 * experiment: true
 */
import { RemoteFormBuilder } from '@metafox/form';
import {
  BlockViewProps,
  createBlock,
  useGlobal,
  useLocation,
  useResourceAction
} from '@metafox/framework';
import { Block, BlockContent, BlockHeader, BlockTitle } from '@metafox/layout';
import { LineIcon } from '@metafox/ui';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import qs from 'query-string';

const Tabs = styled('div', {
  name: 'Tab',
  slot: 'container'
})<{}>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row'
}));

const Tab = styled('div', {
  name: 'Tab',
  slot: 'item',
  shouldForwardProp: prop => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  cursor: 'pointer',
  textTransform: 'uppercase',
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.mixins.pxToRem(15),
  padding: theme.spacing(2, 0),
  marginRight: theme.spacing(3.75),
  color: theme.palette.text.secondary,
  borderBottom: 'solid 2px',
  borderBottomColor: 'transparent',
  ...(active && {
    color: theme.palette.primary.main,
    borderBottomColor: theme.palette.primary.main
  })
}));

const Panels = styled(Box, {
  name: 'Tab',
  slot: 'panels'
})<{}>(({ theme }) => ({}));

const Panel = styled(Box, {
  name: 'Tab',
  slot: 'panel'
})<{ active?: boolean }>(({ theme, active }) => ({
  display: active ? 'block' : 'none'
}));

const VideoForm = ({ name }: { name: string }) => {
  const { dispatch } = useGlobal();

  const location = useLocation();
  const searchParams = location?.search
    ? qs.parse(location.search.replace(/^\?/, ''))
    : {};

  const onChange = React.useCallback(
    (data: Record<string, any>) => {
      if (!name) return;

      dispatch({
        type: 'formValues/onChange',
        payload: {
          formName: `video.video.${name}`,
          data
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const dataSource = useResourceAction('video', 'video', name);

  return (
    <RemoteFormBuilder
      onChange={onChange}
      noHeader
      resetFormWhenSuccess
      allowRiskParams
      dataSource={dataSource}
      pageParams={searchParams}
    />
  );
};

const BackButton = ({ icon = 'ico-arrow-left', ...restProps }) => {
  const { navigate } = useGlobal();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <IconButton
      size="small"
      role="button"
      id="back"
      data-testid="buttonBack"
      sx={{ transform: 'translate(-5px,0)' }}
      onClick={handleClick}
      {...restProps}
    >
      <LineIcon icon={icon} />
    </IconButton>
  );
};

function ShareVideoBlock({ title }: BlockViewProps) {
  const { i18n, getAcl, jsxBackend, getSetting } = useGlobal();
  const isServiceReady = getSetting('video.video_service_is_ready');
  const isUploadVideo = getAcl('video.video.upload_video_file');
  const isShareVideo = getAcl('video.video.share_video_url');
  const [tab, setTab] = React.useState<string>(
    isServiceReady && isUploadVideo ? 'upload' : 'share'
  );

  const canCreate = getAcl('video.video.create');

  if (!canCreate && !isShareVideo && !isUploadVideo) {
    const ErrorBlock = jsxBackend.get('core.block.error403');

    return (
      <Block>
        <BlockContent>
          <ErrorBlock />
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block>
      <BlockHeader>
        <BlockTitle>
          <BackButton />
          {i18n.formatMessage({ id: title })}
        </BlockTitle>
      </BlockHeader>
      <BlockContent>
        <Tabs>
          {isServiceReady && isUploadVideo && (
            <Tab active={tab === 'upload'} onClick={() => setTab('upload')}>
              {i18n.formatMessage({ id: 'upload' })}
            </Tab>
          )}
          {isShareVideo && (
            <Tab active={tab === 'share'} onClick={() => setTab('share')}>
              {i18n.formatMessage({ id: 'share' })}
            </Tab>
          )}
        </Tabs>
        <Panels>
          {isServiceReady && isUploadVideo && (
            <Panel active={tab === 'upload'}>
              <VideoForm name="addItem" />
            </Panel>
          )}
          {isShareVideo && (
            <Panel active={tab === 'share'}>
              <VideoForm name="shareItem" />
            </Panel>
          )}
        </Panels>
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: ShareVideoBlock,

  overrides: {
    noHeader: false
  }
});
