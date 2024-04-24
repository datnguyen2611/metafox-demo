/**
 * @type: saga
 * name: chat.saga.room
 */

import {
  fulfillEntity,
  getGlobalContext,
  getItem,
  getResourceAction,
  handleActionConfirm,
  handleActionError,
  ItemLocalAction,
  LocalAction,
  PAGINATION_DELETE,
  PAGINATION_UNSHIFT
} from '@metafox/framework';
import { isEmpty } from 'lodash';
import { takeEvery, put, select } from 'redux-saga/effects';
import { APP_CHAT } from '../constants';
import { getOpenChatRoomsSelector } from '../selectors';
import {
  getRoomItem,
  putRoomMessages,
  removeMessagesRoom,
  removeRoomDock
} from './helpers';

function* openBuddyNewMessage({ rid }: any) {
  const { getPageParams } = yield* getGlobalContext();

  const params: any = getPageParams();

  if (!rid || params?.isAllPageMessages) return;

  const openRooms = yield select(getOpenChatRoomsSelector);

  const openRoomItem = openRooms.values.find(item => item.rid === rid);

  if (isEmpty(openRooms.values) || !openRoomItem) {
    yield put({
      type: 'chat/openRoomPanel',
      payload: { rid }
    });
  }
}

function* handleRoomLoadHistory({
  payload: { rid, lastMsgId },
  meta
}: LocalAction<
  { rid: string; lastMsgId: NumberConstructor },
  { onSuccess?: () => void; onFailure?: () => void }
>) {
  const { apiClient } = yield* getGlobalContext();

  try {
    const responseMessages = yield apiClient.request({
      url: '/chat',
      params: { room_id: rid, last_message_id: lastMsgId, limit: 20 }
    });

    const dataMessages = responseMessages?.data?.data;

    if (!dataMessages.length) {
      yield put({
        type: 'chat/room/endLoadmoreMessage',
        payload: { rid }
      });

      return;
    }

    yield* putRoomMessages(dataMessages);
    typeof meta?.onSuccess === 'function' && meta?.onSuccess();
  } catch (error) {
    typeof meta?.onFailure === 'function' && meta?.onFailure();
    // yield* handleActionError(error);
  }
}

function* handleRoomActive(
  action: ItemLocalAction<
    { rid: string },
    { onSuccess: (value) => void; onFailure?: () => void }
  >
) {
  const rid = action.payload;
  const { onSuccess, onFailure } = action.meta;

  const { apiClient, normalization } = yield* getGlobalContext();

  // todo check latest data.
  try {
    const responseRoom = yield apiClient.request({
      url: `/chat-room/${rid}`
    });

    const dataRoom = responseRoom?.data?.data;

    if (!dataRoom) return;

    const resultRoom = normalization.normalize(dataRoom);

    yield* fulfillEntity(resultRoom.data);

    const responseMessages = yield apiClient.request({
      url: '/chat',
      params: { room_id: rid, limit: 50 }
    });

    const dataMessages = responseMessages?.data?.data;

    if (rid) {
      yield put({
        type: 'chat/chatroom/add',
        payload: { rid }
      });
    }

    yield* putRoomMessages(dataMessages);

    if (dataMessages.length < 50) {
      yield put({
        type: 'chat/room/endLoadmoreMessage',
        payload: { rid }
      });
    }

    typeof onSuccess === 'function' && onSuccess(dataRoom);
  } catch (error) {
    typeof onFailure === 'function' && onFailure();
    yield* handleActionError(error);
  }
}

function* handleRoomInactive() {
  yield;
}

function* deleteRoom(action: ItemLocalAction) {
  const { identity: rid } = action.payload;
  const room = yield* getRoomItem(rid);

  if (!room) return;

  const { apiClient, compactUrl } = yield* getGlobalContext();

  const config: any = yield* getResourceAction(APP_CHAT, 'room', 'deleteItem');

  if (!config.apiUrl) return;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return;

  try {
    const result = yield apiClient.request({
      method: config.apiMethod,
      url: compactUrl(config.apiUrl, room)
    });

    if (!result) {
      // handle error
    }

    yield put({
      type: PAGINATION_DELETE,
      payload: { identity: `chat.entities.room.${rid}` }
    });
    yield* removeRoomDock(rid);
    yield* removeMessagesRoom(rid);
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* deleteRoomBackend(action: ItemLocalAction<{ id: string }>) {
  const { id: rid } = action.payload;
  const room = yield* getRoomItem(rid);

  if (!room) return;

  try {
    yield* removeRoomDock(rid);
    yield* removeMessagesRoom(rid);
    yield put({
      type: PAGINATION_DELETE,
      payload: { identity: `chat.entities.room.${rid}` }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

function* roomUserDeleted(action: ItemLocalAction<{ id: string }>) {
  const { id: rid } = action.payload;
  const room = yield* getRoomItem(rid);

  if (!room) return;

  const { dialogBackend, i18n, getPageParams } = yield* getGlobalContext();

  const pageParam: any = getPageParams();

  const openRooms = yield select(getOpenChatRoomsSelector);

  const openRoomItem = openRooms.values.find(item => item.rid === rid);

  try {
    // eslint-disable-next-line eqeqeq
    if (openRoomItem || pageParam?.rid == rid) {
      yield dialogBackend.alert({
        title: 'Oops!',
        message: i18n.formatMessage({ id: 'chat_room_can_not_found' })
      });
    }

    yield* removeRoomDock(rid);
    yield* removeMessagesRoom(rid);
    yield put({
      type: PAGINATION_DELETE,
      payload: { identity: `chat.entities.room.${rid}` }
    });
  } catch (error) {
    yield* handleActionError(error);
  }
}

export function* updateRoom(
  action: LocalAction<{
    id: string | number;
    total_unseen?: number;
    [key: string]: any;
  }>
) {
  const { normalization, apiClient } = yield* getGlobalContext();
  let { room } = action.payload;
  const type = action.payload?.type;

  const { id } = room;

  if (!id) return;

  const identity = `chat.entities.room.${id}`;

  const item = yield* getItem(identity);

  try {
    if (item) {
      const resultRoom = normalization.normalize(room);

      yield* fulfillEntity(resultRoom.data);
    } else {
      if (!room.module_name || !room.resource_name) {
        const responseRoom = yield apiClient.request({
          url: `/chat-room/${id}`
        });

        room = responseRoom?.data?.data;
      }

      const resultRoom = normalization.normalize(room);

      yield* fulfillEntity(resultRoom.data);
    }

    yield put({
      type: PAGINATION_UNSHIFT,
      payload: {
        data: [identity],
        pagingId: ['/chat-room?']
      }
    });

    if (!['block', 'unBlock'].includes(type)) {
      yield* openBuddyNewMessage({ rid: id });
    }
  } catch (error) {
    // yield* handleActionError(error);
  }
}

const sagas = [
  takeEvery('chat/room/loadHistory', handleRoomLoadHistory),
  takeEvery('chat/room/active', handleRoomActive),
  takeEvery('chat/room/inactive', handleRoomInactive),
  takeEvery('chat/room/deleteRoom', deleteRoom),
  takeEvery('chat/updateRoom', updateRoom),
  takeEvery('chat/roomUserDeleted', roomUserDeleted),
  takeEvery('chat/room/deleteRoomBackend', deleteRoomBackend)
];

export default sagas;
