/**
 * @type: saga
 * name: advertise.saga.sponsorshipStatistic
 */

import {
  getGlobalContext,
  getResourceConfig,
  ItemLocalAction,
  patchEntity,
  getSession,
  getItem
} from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';
import { APP_NAME, RESOURCE_SPONSOR } from '../constants';

function* updateView(action: ItemLocalAction & { payload: any }) {
  const { apiClient, compactUrl, compactData } = yield* getGlobalContext();
  const { loggedIn } = yield* getSession();
  const config = yield* getResourceConfig(
    APP_NAME,
    RESOURCE_SPONSOR,
    'updateTotalView'
  );

  const { identity } = action.payload;
  const item = yield* getItem(identity);

  if (!item || item?._sponsorship_viewed || !config.apiUrl || !loggedIn) return;

  try {
    const response = yield apiClient.request({
      method: config.apiMethod || 'POST',
      url: compactUrl(config.apiUrl, item),
      data: compactData(config.apiParams, {
        item_type: item.resource_name,
        item_ids: [item.id]
      })
    });

    const status = response.data?.status;

    if (status === 'success') {
      yield* patchEntity(item._identity, { _sponsorship_viewed: true });
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* updateClick(action: ItemLocalAction & { payload: any }) {
  const { apiClient, compactUrl, compactData } = yield* getGlobalContext();
  const { loggedIn } = yield* getSession();
  const config = yield* getResourceConfig(
    APP_NAME,
    RESOURCE_SPONSOR,
    'updateTotalClick'
  );

  const { identity } = action.payload;
  const item = yield* getItem(identity);

  if (!item || item?._sponsorship_clicked || !config.apiUrl || !loggedIn)
    return;

  try {
    const response = yield apiClient.request({
      method: config.apiMethod || 'POST',
      url: compactUrl(config.apiUrl, item),
      data: compactData(config.apiParams, {
        item_type: item.resource_name,
        item_ids: [item.id]
      })
    });

    const status = response.data?.status;

    if (status === 'success') {
      yield* patchEntity(item._identity, { _sponsorship_clicked: true });
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

const sagas = [
  takeEvery('advertise/sponsorship/updateView', updateView),
  takeEvery('link/trackingClick', updateClick)
];

export default sagas;
