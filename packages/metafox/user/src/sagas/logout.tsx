/**
 * @deprecated
 * @type: saga
 * name: user.logout
 */
import { IS_ADMINCP, getGlobalContext } from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';

/**
 * Deprecated by cause redirect two slow and User see flash screen
 * @returns
 */
export function* logoutSaga() {
  const { redirectTo, apiClient, cookieBackend, getSetting } =
    yield* getGlobalContext();

  const token = yield cookieBackend.get('token');
  const deviceToken = yield cookieBackend.get('fcm-token');
  const redirect_after_logout = getSetting('user.redirect_after_logout');

  if (!token) return;

  yield cookieBackend.remove('token');
  yield cookieBackend.remove('refreshToken');
  yield cookieBackend.remove('dateExpiredToken');

  if (deviceToken) {
    // clear if has token, if not keep fcm-notification for dismiss alert
    yield cookieBackend.remove('fcm-notification');
    yield cookieBackend.remove('fcm-token');
  }

  // TO DO send request to notify logged out.
  try {
    // remove service worker
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    // send request logout
    yield apiClient.request({
      url: '/auth/logout',
      method: 'GET',
      params: { device_uid: deviceToken },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    // do nothing
  }

  const redirectUrl = IS_ADMINCP
    ? process.env.MFOX_ADMINCP_URL
    : process.env.MFOX_SITE_URL;

  redirectTo(redirect_after_logout || redirectUrl || '/');
}

const sagaEffect = takeEvery('@logout', logoutSaga);

export default sagaEffect;
