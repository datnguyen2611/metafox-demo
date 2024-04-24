/**
 * @type: saga
 * name: saga.shareNow
 */

import { fetchDetailSaga } from '@metafox/core/sagas/fetchDetailSaga';
import { getTotalPins } from '@metafox/feed/sagas/getTotalPins';
import { getTotalPriority } from '@metafox/feed/sagas/getTotalPriorityFeed';
import {
  fetchDetail,
  getGlobalContext,
  getItem,
  getSession,
  handleActionError,
  handleActionFeedback,
  LocalAction,
  PAGINATION_PUSH_INDEX
} from '@metafox/framework';
import { getSharingItemPrivacy } from '@metafox/user/sagas';
import { fetchDataPrivacy } from '@metafox/user/sagas/sharingItemPrivacy';
import { get, isString } from 'lodash';
import { put, takeLatest, call } from 'redux-saga/effects';

export function* shareNow(
  action: LocalAction<{ identity: string; parentIdentity: string }>
) {
  const {
    payload: { identity }
  } = action;

  const item = yield* getItem(identity);
  const { apiClient } = yield* getGlobalContext();
  const { user } = yield* getSession();

  yield call(fetchDataPrivacy, {
    payload: { id: user.id }
  });
  const privacy = yield* getSharingItemPrivacy('share');

  if (!item) return;

  let embed = null;

  if (item.embed_object && isString(item.embed_object)) {
    embed = yield* getItem(item.embed_object);
  }

  const object = embed || item;
  const extraContext = embed
    ? { context_item_type: item?.resource_name, context_item_id: item?.id }
    : {};

  try {
    const response = yield apiClient.request({
      url: '/feed/share',
      method: 'post',
      data: {
        item_type: object?.shared_item_type || object?.resource_name,
        item_id: object?.shared_item_id || object?.id,
        ...extraContext,
        privacy: privacy?.value,
        post_type: 'wall',
        post_content: ''
      }
    });

    const ok = 'success' === get(response, 'data.status');
    const feedId = get(response, 'data.data.ids');

    if (!ok || !feedId) return;

    const apiUrl = `feed/${feedId}?item_type=${user?.resource_name}&item_id=${user?.id}`;

    const data = yield* fetchDetailSaga(fetchDetail(apiUrl));

    const totalPriorityFeedHome = yield* getTotalPriority(null);
    const totalPinsProfile = yield* getTotalPins(parseInt(user?.id));
    const indexId = [totalPinsProfile, totalPriorityFeedHome];

    yield put({
      type: PAGINATION_PUSH_INDEX,
      payload: {
        data,
        pagingId: [`/feed?user_id=${user?.id}`, '/feed'],
        indexId
      }
    });

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [takeLatest('feed/shareNow', shareNow)];

export default sagas;
