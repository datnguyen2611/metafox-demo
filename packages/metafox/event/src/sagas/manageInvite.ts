/**
 * @type: saga
 * name: event/manageInvite
 */

import {
  deleteEntity,
  getGlobalContext,
  getItem,
  getItemActionConfig,
  getResourceAction,
  handleActionError,
  handleActionFeedback,
  ItemLocalAction,
  makeDirtyPaging,
  patchEntity,
  fulfillEntity,
  PAGINATION_REFRESH
} from '@metafox/framework';
import { compactData } from '@metafox/utils';
import { takeLatest, put } from 'redux-saga/effects';
import { APP_EVENT } from '../constants';

function* invitePeopleToCome(
  action: ItemLocalAction & {
    payload: { identity: string };
  }
) {
  const {
    payload: { identity }
  } = action;
  const item = yield* getItem(identity);

  if (!identity && !item) return;

  const id = identity.split('.')[3];
  const { parent_id } = item;

  try {
    const { dialogBackend, apiClient, i18n, normalization } =
      yield* getGlobalContext();

    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: APP_EVENT },
      'suggestFriends'
    );
    const selectedItems = yield dialogBackend.present({
      component: 'friend.dialog.MultipleFriendPicker',
      props: {
        apiUrl: dataSource.apiUrl,
        initialParams: compactData(dataSource.apiParams, { id, parent_id }),
        dialogTitle: i18n.formatMessage({ id: 'invite_people_to_come' })
      }
    });

    if (!selectedItems?.length) return;

    const userIds = selectedItems.map(item => item.id);

    const config = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: APP_EVENT },
      'invitePeopleToCome'
    );

    if (!config) return;

    const { apiMethod, apiUrl, apiParams } = config;

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        id,
        ids: userIds
      })
    });

    const data = response?.data?.data;
    const result = yield normalization.normalize(data);
    yield* fulfillEntity(result.data);

    yield* handleActionFeedback(response);
  } catch (err) {
    yield* handleActionError(err);
  }
}

function* approveCoHostInvite(
  action: ItemLocalAction & {
    payload: { identity: string };
  }
) {
  const {
    payload: { identity }
  } = action;
  const { apiClient } = yield* getGlobalContext();

  try {
    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: 'event_host_invite' },
      'acceptInvite'
    );

    const { apiUrl, apiMethod, apiParams } = dataSource;

    const id = identity.split('.')[3];

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        id
      })
    });
    const data = response?.data?.data;
    yield* handleActionFeedback(response);
    yield* patchEntity(identity, data);

    yield put({
      type: PAGINATION_REFRESH,
      payload: { pagingId: `event-member?event_id=${id}&view=host` }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* declineInvite(
  action: ItemLocalAction & {
    payload: { identity: string };
  }
) {
  const {
    payload: { identity }
  } = action;
  const { apiClient } = yield* getGlobalContext();

  try {
    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: 'event_host_invite' },
      'declineInvite'
    );

    const { apiUrl, apiMethod, apiParams } = dataSource;

    const id = identity.split('.')[3];

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        id
      })
    });

    yield* handleActionFeedback(response);
    yield* patchEntity(identity, { pending_host_invite: null });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* cancelInvitation(
  action: ItemLocalAction & {
    payload: { identity: string; onSuccess: any };
  }
) {
  const {
    payload: { identity, onSuccess }
  } = action;

  const { apiClient, normalization } = yield* getGlobalContext();

  try {
    const item = yield* getItem(identity);

    const { event_id, owner } = item;

    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: 'event_invite' },
      'cancelInvite'
    );

    const { apiUrl, apiMethod, apiParams } = dataSource;

    const userId = owner.split('.')[3];

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        event_id,
        user_id: userId
      })
    });

    yield* deleteEntity(identity);

    if (onSuccess) onSuccess();

    yield* handleActionFeedback(response);
    const data = response?.data?.data;
    const result = yield normalization.normalize(data);
    yield* fulfillEntity(result.data);
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* cancelHostInvitation(
  action: ItemLocalAction & {
    payload: { identity: string; onSuccess: any };
  }
) {
  const {
    payload: { identity, onSuccess }
  } = action;

  const { apiClient, normalization } = yield* getGlobalContext();

  try {
    const item = yield* getItem(identity);

    const { event_id, owner } = item;

    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: 'event_host_invite' },
      'cancelInvite'
    );

    const { apiUrl, apiMethod, apiParams } = dataSource;

    const userId = owner.split('.')[3];

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        event_id,
        user_id: userId
      })
    });
    const data = response?.data?.data;
    const result = yield normalization.normalize(data);
    yield* fulfillEntity(result.data);

    if (onSuccess) onSuccess();

    yield* deleteEntity(identity);

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* removeHost(
  action: ItemLocalAction & {
    payload: { identity: string; onSuccess: any };
  }
) {
  const {
    payload: { identity, onSuccess }
  } = action;

  const { apiClient } = yield* getGlobalContext();

  try {
    const item = yield* getItem(identity);

    const { event_id, user } = item;

    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: 'event_member' },
      'removeHost'
    );

    const { apiUrl, apiMethod, apiParams } = dataSource;

    const userId = user.split('.')[3];

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        event_id,
        user_id: userId
      })
    });

    if (onSuccess) onSuccess();

    yield* handleActionFeedback(response);

    yield* deleteEntity(identity);
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* generalInviteLink(
  action: ItemLocalAction & {
    payload: { identity: string };
  }
) {
  const {
    payload: { identity }
  } = action;

  const item = yield* getItem(identity);
  const { dialogBackend } = yield* getGlobalContext();

  if (!item) return;

  try {
    yield dialogBackend.present({
      component: 'event.dialog.generateInviteLinkDialog',
      props: {
        item
      }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

export function* getCode(
  action: ItemLocalAction<{ item: any }, { onSuccess: (value) => void }>
) {
  const {
    payload: { item }
  } = action;
  const { apiClient } = yield* getGlobalContext();

  if (!item) return;

  try {
    const config = yield* getResourceAction(
      APP_EVENT,
      'event_invite_code',
      'getCode'
    );
    const apiUrl = config?.apiUrl;

    if (!apiUrl) return;

    const response = yield apiClient.request({
      url: apiUrl,
      method: config?.apiMethod || 'POST',
      params: compactData(config.apiParams, item)
    });

    const result = response.data.data;

    if (result) {
      action?.meta?.onSuccess && action?.meta?.onSuccess(result);
    }
  } catch (err) {
    yield* handleActionError(err);
  }
}
export function* refreshCode(
  action: ItemLocalAction<{ item: any }, { onSuccess: (value) => void }>
) {
  const {
    payload: { item }
  } = action;
  const { apiClient } = yield* getGlobalContext();

  if (!item) return;

  try {
    const config = yield* getResourceAction(
      APP_EVENT,
      'event_invite_code',
      'refreshCode'
    );
    const apiUrl = config?.apiUrl;

    if (!apiUrl) return;

    const response = yield apiClient.request({
      url: apiUrl,
      method: config?.apiMethod || 'POST',
      params: compactData(config.apiParams, item)
    });

    const result = response.data.data;

    if (result) {
      action?.meta?.onSuccess && action?.meta?.onSuccess(result);
    }
  } catch (err) {
    yield* handleActionError(err);
  }
}

function* inviteToComeHost(
  action: ItemLocalAction & {
    payload: { identity: string };
  }
) {
  const {
    payload: { identity }
  } = action;
  const item = yield* getItem(identity);

  if (!identity && !item) return;

  const id = identity.split('.')[3];
  const { parent_id } = item;

  try {
    const { dialogBackend, apiClient, i18n, normalization } =
      yield* getGlobalContext();

    const dataSource = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: APP_EVENT },
      'suggestHosts'
    );

    const selectedItems = yield dialogBackend.present({
      component: 'friend.dialog.MultipleFriendPicker',
      props: {
        apiUrl: dataSource.apiUrl,
        initialParams: compactData(dataSource.apiParams, { id, parent_id }),
        dialogTitle: i18n.formatMessage({ id: 'invite_hosts' })
      }
    });

    if (!selectedItems?.length) return;

    const userIds = selectedItems.map(item => item.id);

    const config = yield* getItemActionConfig(
      { module_name: APP_EVENT, resource_name: APP_EVENT },
      'inviteHosts'
    );

    if (!config) return;

    const { apiMethod, apiUrl, apiParams } = config;

    const response = yield apiClient.request({
      method: apiMethod,
      url: apiUrl,
      params: compactData(apiParams, {
        id,
        ids: userIds
      })
    });

    yield* makeDirtyPaging('event_hostevent');

    yield* handleActionFeedback(response);
    const data = response?.data?.data;
    const result = yield normalization.normalize(data);
    yield* fulfillEntity(result.data);
  } catch (err) {
    yield* handleActionError(err);
  }
}

const sagas = [
  takeLatest('event/invitePeopleToCome', invitePeopleToCome),
  takeLatest('event/approveCoHostInvite', approveCoHostInvite),
  takeLatest('cancelHostInvitation', cancelHostInvitation),
  takeLatest('event/removeHost', removeHost),
  takeLatest('event/denyCoHostInvite', declineInvite),
  takeLatest('event/cancelInvitation', cancelInvitation),
  takeLatest('event/generateInviteLink', generalInviteLink),
  takeLatest('event/getCode', getCode),
  takeLatest('event/refreshCode', refreshCode),
  takeLatest('event/inviteToComeHost', inviteToComeHost)
];

export default sagas;

