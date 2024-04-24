/**
 * @type: saga
 * name: notification
 */
import {
  deleteEntity,
  fulfillEntity,
  getGlobalContext,
  getItem,
  getResourceAction,
  ItemLocalAction,
  patchEntity,
  makeDirtyPaging,
  handleActionFeedback,
  handleActionError,
  handleActionConfirm
} from '@metafox/framework';
import { select, takeEvery, all, call } from 'redux-saga/effects';
import { cloneDeep, isEmpty } from 'lodash';
import {
  APP_NAME,
  NOTIFICATION_POPPER_PAGING_IDS,
  RESOURCE_NOTIFICATION
} from '../constant';

export function* markAsRead(action: ItemLocalAction) {
  const { identity } = action.payload;

  try {
    const item = yield* getItem(identity);

    if (!item) return null;

    yield* patchEntity(identity, { is_read: true });

    const { apiClient } = yield* getGlobalContext();

    if (item?.module_item) {
      yield* makeDirtyPaging(item.module_item);
    }

    yield apiClient.request({
      method: 'PUT',
      url: `/notification/${item.id}`,
      data: { is_read: true }
    });
  } catch (err) {
    // handle error
  }
}

export function* markAllAsRead(action: ItemLocalAction) {
  const { apiClient } = yield* getGlobalContext();

  try {
    const { apiUrl, apiMethod } = yield* getResourceAction(
      'notification',
      'notification',
      'markAllAsRead'
    );

    const data = yield select(
      state => state.notification.entities.notification
    );

    const cloneData = cloneDeep(data);

    Object.keys(cloneData).forEach(id => (cloneData[id].is_read = true));

    yield* fulfillEntity({
      notification: {
        entities: { notification: cloneData }
      }
    });

    yield apiClient.request({ method: apiMethod, url: apiUrl });
  } catch (err) {
    console.log(err);
    // handle error
  }
}

export function* editNotificationSetting({ meta }: ItemLocalAction) {
  try {
    if (meta?.setLocalState) {
      meta.setLocalState(prev => ({ ...prev, menuOpened: false }));
    }

    const { navigate } = yield* getGlobalContext();

    if (navigate) {
      navigate('/settings/notifications');
    }
  } catch (err) {
    // handle error
  }
}

export function* browseNotifications() {
  const { navigate } = yield* getGlobalContext();

  try {
    if (navigate) {
      navigate('/notification');
    }
  } catch (err) {
    // handle error
  }
}

export function* getUnread() {
  const { apiClient } = yield* getGlobalContext();

  try {
    yield apiClient.get('/notification');
  } catch (err) {
    // handle error
  }
}

export function* deleteItem(action: ItemLocalAction) {
  try {
    const { apiClient } = yield* getGlobalContext();
    const { identity } = action.payload;
    const item = yield* getItem(identity);

    if (!item) return null;

    yield* deleteEntity(identity);

    const response = yield apiClient.request({
      method: 'DELETE',
      url: `/notification/${item.id}`
    });
    yield* handleActionFeedback(response);
  } catch (err) {
    // handle error
  }
}

export function* viewNotification(action: ItemLocalAction) {
  const { navigate } = yield* getGlobalContext();
  const { identity } = action.payload;

  try {
    const item = yield* getItem(identity);

    if (!item?.link) return null;

    if (item?.link?.includes('feed')) {
      yield* makeDirtyPaging('feed');
    }

    if (item?.module_item) {
      yield* makeDirtyPaging(item.module_item);
    }

    navigate(item.link, { state: { asModal: item?.asModal } });
  } catch (err) {
    // handle error
    console.log(err);
  }
}

export function* deleteAll(action: ItemLocalAction<{ pagingId?: string }>) {
  const { apiClient } = yield* getGlobalContext();
  const config = yield* getResourceAction(
    APP_NAME,
    RESOURCE_NOTIFICATION,
    'deleteAll'
  );

  const { pagingId } = action.payload || {};

  const pagingItem = yield* getItem(
    `pagination.${pagingId || NOTIFICATION_POPPER_PAGING_IDS}`
  );

  if (isEmpty(pagingItem?.ids) || !config.apiUrl) return;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return;

  try {
    yield all(pagingItem?.ids.map(id => call(deleteEntity, id)));

    const response = yield apiClient.request({
      method: config.apiMethod || 'delete',
      url: config.apiUrl
    });

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [
  takeEvery('notification/deleteItem', deleteItem),
  takeEvery('notification/viewItem', viewNotification),
  takeEvery('notification/markAsRead', markAsRead),
  takeEvery('notification/markAllAsRead', markAllAsRead),
  takeEvery('notification/editNotificationSetting', editNotificationSetting),
  takeEvery('notification/browseNotifications', browseNotifications),
  takeEvery('notification/deleteAll', deleteAll)
];

export default sagas;
