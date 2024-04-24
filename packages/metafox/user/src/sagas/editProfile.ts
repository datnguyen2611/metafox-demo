/**
 * @type: saga
 * name: user/editProfile
 */

import { getGlobalContext, getItem, ItemLocalAction } from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';

function* editProfile(action: ItemLocalAction) {
  const {
    payload: { identity }
  } = action;

  const item = yield* getItem(identity);

  const { navigate } = yield* getGlobalContext();

  navigate(`/user/${item.id}/profile`);
}

const sagas = [takeEvery('user/editProfile', editProfile)];

export default sagas;
