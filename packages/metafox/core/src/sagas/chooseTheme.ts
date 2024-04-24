/**
 * @type: saga
 * name: core.chooseTheme
 */

import { getGlobalContext } from '@metafox/framework';
import { takeLatest, put } from 'redux-saga/effects';

function* chooseTheme() {
  const { dialogBackend, preferenceBackend, eventCenter } =
    yield* getGlobalContext();

  const themeId = yield dialogBackend.present({
    component: 'core.dialog.ChooseTheme',
    props: {}
  });

  if (themeId) {
    preferenceBackend.setTheme(themeId, () => {
      eventCenter.dispatch('layout.theme.changed', themeId);
      put({ type: 'navigate/reload' });
    });
  }
}

const sagas = [takeLatest('chooseTheme', chooseTheme)];

export default sagas;
