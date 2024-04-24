/**
 * @type: route
 * name: video.view
 * path: /video/play/:id, /media/:photo_set(\d+)/video/:id, /media/album/:photo_album(\d+)/video/:id
 * chunkName: pages.video
 * bundle: web
 */

import {
  fetchDetail,
  useGlobal,
  useLocation,
  useResourceAction
} from '@metafox/framework';
import { Page } from '@metafox/layout';
import { APP_VIDEO, RESOURCE_VIDEO } from '@metafox/video/constant';
import { get } from 'lodash';
import React from 'react';

export default function HomePage(props) {
  const { createPageParams, createContentParams, dispatch, jsxBackend } =
    useGlobal();
  const [err, setErr] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const onFailure = React.useCallback((error: any) => {
    // eslint-disable-next-line no-console
    setErr(error);
    setLoading(false);
  }, []);
  const onSuccess = React.useCallback(() => {
    setLoading(false);
  }, []);
  const config = useResourceAction(APP_VIDEO, RESOURCE_VIDEO, 'viewAll');

  const location = useLocation();
  const isModal = location?.state?.asModal;

  const pageParams = createPageParams<{
    appName: string;
    resourceName: string;
    id: string | number;
  }>(props, prev => ({
    appName: APP_VIDEO,
    resourceName: RESOURCE_VIDEO,
    tab: 'landing',
    pageMetaName: `${APP_VIDEO}.${RESOURCE_VIDEO}.landing`,
    identity: `${APP_VIDEO}.entities.${RESOURCE_VIDEO}.${prev['id']}`,
    _pageType: 'viewItem'
  }));

  const contentParams = createContentParams({
    mainListing: {
      canLoadMore: true,
      contentType: RESOURCE_VIDEO,
      title: pageParams?.heading,
      dataSource: {
        apiUrl: config?.apiUrl,
        apiRules: config?.apiRules,
        apiParams: { ...config?.apiParams, ...pageParams }
      }
    }
  });

  React.useEffect(() => {
    if (pageParams?.id && !isModal) {
      // dispatch here on check error page
      setLoading(true);
      dispatch(
        fetchDetail('/video/:id', { id: pageParams?.id }, onSuccess, onFailure)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParams?.id]);

  const errorPageParams = React.useMemo(() => {
    if (!err) return {};

    const message =
      get(err, 'response.data.error') || get(err, 'response.data.message');

    return { title: message, variant: 'h2' };
  }, [err]);

  if (err) {
    const pageName =
      get(err, 'response.status') === 403 ? 'core.error403' : 'core.error404';

    return <Page pageName={pageName} pageParams={errorPageParams} />;
  }

  if (loading) return jsxBackend.render({ component: 'Loading' });

  return (
    <Page
      pageName={'video.view'}
      pageParams={pageParams}
      contentParams={contentParams}
    />
  );
}
