/**
 * @type: saga
 * name: advertise.saga.sponsorItem
 */
import {
  getGlobalContext,
  getItem,
  handleActionConfirm,
  ItemLocalAction,
  getResourceAction,
  getItemActionConfig,
  patchEntity,
  handleActionFeedback,
  handleActionError
} from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';
import { APP_NAME, RESOURCE_SPONSOR } from '@metafox/advertise/constants';

function* purchaseSponsorItemInFeed(action: ItemLocalAction) {
  const { identity, location } = action.payload;
  const item = yield* getItem(identity);

  const { navigate, compactUrl } = yield* getGlobalContext();

  const config = yield* getResourceAction(
    APP_NAME,
    RESOURCE_SPONSOR,
    'addFeedItem'
  );

  if (!config?.pageUrl) return false;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return false;

  const pageUrl = compactUrl(config.pageUrl, item);

  if (location?.state?.asModal) {
    navigate(pageUrl, { replace: true });
  } else {
    navigate(pageUrl);
  }

  window.scrollTo(0, 0);
}

function* purchaseSponsorItem(action: ItemLocalAction) {
  const { identity, location } = action.payload;
  const item = yield* getItem(identity);

  const { navigate, compactUrl } = yield* getGlobalContext();

  const config = yield* getResourceAction(
    APP_NAME,
    RESOURCE_SPONSOR,
    'addItem'
  );

  if (!config?.pageUrl) return false;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return false;

  const pageUrl = compactUrl(config.pageUrl, item);

  if (location?.state?.asModal) {
    navigate(pageUrl, { replace: true });
  } else {
    navigate(pageUrl);
  }

  window.scrollTo(0, 0);
}

function* activeSponsorItem(
  action: ItemLocalAction & { payload: { active: boolean } }
) {
  const { identity, active } = action.payload;
  const item = yield* getItem(identity);

  if (!item) return;

  const { apiClient, compactUrl, compactData } = yield* getGlobalContext();

  const config = yield* getItemActionConfig(item, 'activeItem');

  if (!config.apiUrl) return;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return;

  try {
    const response = yield apiClient.request({
      method: config.apiMethod,
      url: compactUrl(config.apiUrl, item),
      data: compactData(config.apiParams, { is_active: active })
    });

    const data = response.data?.data;

    if (data?.is_active) {
      yield* patchEntity(identity, {
        is_active: data.is_active
      });
    }

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [
  takeEvery('advertise/purchaseSponsorItemInFeed', purchaseSponsorItemInFeed),
  takeEvery('advertise/purchaseSponsorItem', purchaseSponsorItem),
  takeEvery('advertise/activeSponsorItem', activeSponsorItem)
];

export default sagas;
