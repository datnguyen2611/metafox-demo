/**
 * @type: saga
 * name: chat.saga.message
 */

import {
  fulfillEntity,
  getGlobalContext,
  getItem,
  getItemActionConfig,
  getResourceAction,
  handleActionConfirm,
  handleActionError,
  ItemLocalAction,
  LocalAction,
  MFOX_API_URL,
  patchEntity
} from '@metafox/framework';
import { isFunction } from 'lodash';
import { takeEvery, takeLatest, put } from 'redux-saga/effects';
import { APP_CHAT, RESOURCE_MESSAGE } from '../constants';
import { MsgItemShape } from '../types';
import { normalizeMsgItem } from '../utils';
import { getMessageItem, putRoomMessages } from './helpers';

function* addMessage(action: LocalAction<MsgItemShape>) {
  const message = action.payload;

  yield* putRoomMessages([message]);
}

function* updateMessage(action: LocalAction<MsgItemShape>) {
  const { normalization } = yield* getGlobalContext();
  const message = action.payload;

  if (!message) return;

  const identity = `chat.entities.message.${message.message_id}`;

  try {
    const item = yield* getMessageItem(identity);

    if (!item) return;

    normalizeMsgItem(message);
    const result = yield normalization.normalize(message);

    yield* fulfillEntity(result.data);

    yield put({
      type: 'chat/chatroom/setMessageDelete',
      payload: { rid: item?.room_id, message }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* getDeleteMessage(action: ItemLocalAction) {
  const message = action.payload;
  const identity = `chatplus.entities.message.${message[0].id}`;

  try {
    const item = yield* getMessageItem(identity);

    if (!item) return;

    yield* patchEntity(identity, {
      deleted: true,
      type: 'messageDeleted',
      msgContentType: 'messageDeleted'
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* deleteMessageItem({ payload: { identity } }: ItemLocalAction) {
  try {
    const item = yield* getItem<MsgItemShape>(identity);
    const { apiClient, compactUrl } = yield* getGlobalContext();

    if (!item) return;

    const config = yield* getItemActionConfig(item, 'removeItem');

    const ok = yield* handleActionConfirm(config);

    if (!ok) return;

    const result = yield apiClient.request({
      method: config.apiMethod,
      url: compactUrl(config.apiUrl, item)
    });

    if (!result) {
      // handle error
    }

    yield* patchEntity(identity, { type: 'messageDeleted' });

    yield put({
      type: 'chat/chatroom/setMessageDelete',
      payload: { rid: item?.room_id, message: item }
    });
  } catch (error) {
    yield* patchEntity(identity, { type: 'text' });
    yield* handleActionError(error);
  }
}

function* copyMessageItem({ payload: { identity } }: ItemLocalAction) {
  try {
    const item = yield* getItem<MsgItemShape>(identity);
    const { copyToClipboard, toastBackend, i18n } = yield* getGlobalContext();

    if (!item) return;

    yield copyToClipboard(item.message);

    toastBackend.success(i18n.formatMessage({ id: 'copied_to_clipboard' }));
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* reactMessage({
  payload: { shortcut, identity }
}: ItemLocalAction<{ shortcut?: string; identity?: string }>) {
  try {
    const item = yield* getItem<MsgItemShape>(identity);

    if (!item) return;

    const { apiClient } = yield* getGlobalContext();

    const response = yield apiClient.request({
      method: 'PUT',
      url: `/chat/react/${item.id}`,
      data: { react: shortcut }
    });

    const data = response.data.data;

    yield* patchEntity(identity, { reactions: data?.reactions });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* unsetReactMessage(
  action: ItemLocalAction<
    { identity: string; shortcut: string },
    { onSuccess?: () => void }
  >
) {
  try {
    const { identity } = action.payload;
    const item = yield* getItem<MsgItemShape>(identity);

    if (!item) return;

    const { apiClient } = yield* getGlobalContext();

    const response = yield apiClient.request({
      method: 'PUT',
      url: `/chat/react/${item.id}`,
      data: { remove: 1 }
    });

    const data = response.data.data;

    yield* patchEntity(identity, { reactions: data?.reactions });

    isFunction(action?.meta.onSuccess) && action.meta.onSuccess();
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* replyMessageItem(action: ItemLocalAction) {
  yield;
}

function* editMessageItem(action: ItemLocalAction) {
  yield;
}

function* presentReactionsList(action: ItemLocalAction) {
  const { dialogBackend } = yield* getGlobalContext();

  try {
    const { identity } = action.payload;
    const item = yield* getItem<MsgItemShape>(identity);

    if (!item) return;

    yield dialogBackend.present({
      component: 'dialog.chat.PresentReactionsList',
      props: { identity }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function download(url, token) {
  let filename = '';
  const headers = {
    Authorization: `Bearer ${token}`
  };

  fetch(url, { headers })
    .then(response => {
      filename = response.headers
        .get('Content-Disposition')
        .split('filename=')[1];

      return response.blob();
    })
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(error => console.log(error));
}

function* downloadItem(action: ItemLocalAction) {
  const id = action.payload;

  const { compactUrl, cookieBackend } = yield* getGlobalContext();

  const config = yield* getResourceAction(
    APP_CHAT,
    RESOURCE_MESSAGE,
    'downloadItem'
  );

  if (!config?.apiUrl) return false;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return false;

  try {
    const url = compactUrl(config.apiUrl, { id });

    const token = cookieBackend.get('token');

    download(`${MFOX_API_URL}/${url}`, token);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [
  takeEvery('chat/addMessage', addMessage),
  takeEvery('chat/updateMessage', updateMessage),
  takeEvery('chat/getDeleteMessage', getDeleteMessage),
  takeLatest('chat/deleteMessage', deleteMessageItem),
  takeLatest('chat/copyMessage', copyMessageItem),
  takeLatest('chat/replyMessage', replyMessageItem),
  takeLatest('chat/editMessage', editMessageItem),
  takeLatest('chat/messageReaction', reactMessage),
  takeLatest('chat/unsetReaction', unsetReactMessage),
  takeLatest('chat/presentReactionsList', presentReactionsList),
  takeEvery('chat/image/downloadItem', downloadItem)
];

export default sagas;
