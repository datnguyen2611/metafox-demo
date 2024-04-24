/**
 * @type: saga
 * name: settings.profilePrivacy
 */
import {
  getGlobalContext,
  getItemActionConfig,
  handleActionError,
  handleActionFeedback
} from '@metafox/framework';
import { compactUrl } from '@metafox/utils';
import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { APP_USER } from '../constant';

export function* fetchData(action: { type: string; payload: { id: number } }) {
  const { payload } = action;

  const { apiClient } = yield* getGlobalContext();
  const config = yield* getItemActionConfig(
    { resource_name: APP_USER, module_name: APP_USER },
    'getProfileSettings'
  );

  if (!config) return;

  try {
    const response = yield apiClient.request({
      url: compactUrl(config.apiUrl, { id: payload.id }),
      method: config.apiMethod
    });
    const data = response?.data?.data;

    if (data) {
      yield put({ type: 'setting/profilePrivacy/FULFILL', payload: data });
    }
  } catch (error) {
    yield* handleActionError(error);
  }
}

export function* updateData(action: {
  type: string;
  payload: { var_name: string; value: number };
}) {
  const { apiClient } = yield* getGlobalContext();
  const { value, var_name } = action.payload;
  const config = yield* getItemActionConfig(
    { resource_name: APP_USER, module_name: APP_USER },
    'updateProfileSettings'
  );

  if (!config) return;

  try {
    const response = yield apiClient.request({
      url: config.apiUrl,
      method: config.apiMethod,
      data: { [var_name]: value }
    });

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const effects = [
  takeLatest('setting/profilePrivacy/FETCH', fetchData),
  takeEvery('setting/profilePrivacy/UPDATE', updateData)
];

export default effects;
