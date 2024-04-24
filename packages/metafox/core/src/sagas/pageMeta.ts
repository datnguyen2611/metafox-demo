/**
 * @type: saga
 * name: core.pageMeta
 */
import {
  getGlobalContext,
  getPageMetaDataSelector,
  LOAD_PAGE_META,
  LocalAction
} from '@metafox/framework';
import { IS_ADMINCP, IS_INSTALLATION } from '@metafox/framework/constants';
import { put, select, takeLatest } from 'redux-saga/effects';

export function* loadPageMeta({
  payload: { pathname, queryParams, href, signal }
}: LocalAction<{
  pathname: string;
  queryParams?: Record<string, any>;
  href?: string;
}>) {
  try {
    const { apiClient } = yield* getGlobalContext();

    if (!pathname) return;

    if (IS_INSTALLATION) {
      return;
    }

    let data = yield select(getPageMetaDataSelector, href);

    if (data) return;

    // get current url?
    data = yield apiClient
      .request({
        url: 'seo/meta',
        method: 'post',
        data: {
          url: pathname.replace(/^\/|\/$/g, ''),
          resolution: IS_ADMINCP ? 'admin' : 'web',
          queryParams
        },
        signal
      })
      .then(x => x.data?.data);

    yield put({
      type: 'pageMeta/put',
      payload: { id: href || pathname, data }
    });
  } catch (err) {
    //
  }
}

const sagas = [takeLatest(LOAD_PAGE_META, loadPageMeta)];

export default sagas;
