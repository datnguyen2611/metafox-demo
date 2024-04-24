/**
 * @type: saga
 * name: user/loginByToken
 */
import {
  getGlobalContext,
  LocalAction,
  ACTION_UPDATE_TOKEN,
  IS_ADMINCP
} from '@metafox/framework';
import { ACTION_LOGIN_BY_TOKEN } from '@metafox/user';
import { takeLatest, put } from 'redux-saga/effects';
import moment from 'moment';

export function* loginByToken({
  payload: {
    token,
    refreshToken,
    returnUrl,
    expiresIn,
    urlForceRedirect,
    remember,
    keepUrl = false
  }
}: LocalAction<{
  token: any;
  refreshToken: any;
  returnUrl: string;
  urlForceRedirect?: string;
  remember: boolean;
  keepUrl?: boolean;
  expiresIn?: number;
}>) {
  const { cookieBackend, redirectTo, getSetting } = yield* getGlobalContext();
  const redirect_after_login = getSetting('user.redirect_after_login');

  if (remember) {
    yield put({
      type: ACTION_UPDATE_TOKEN,
      payload: {
        token,
        refreshToken,
        expiresIn
      }
    });
  } else {
    cookieBackend.set('token', token);
  }

  // handle redirect
  const redirectUrl = IS_ADMINCP ? process.env.MFOX_ADMINCP_URL : '';

  keepUrl =
    keepUrl ||
    !(returnUrl || redirectUrl || redirect_after_login || urlForceRedirect);

  setImmediate(() => {
    if (keepUrl) {
      window.location.reload();
    } else {
      redirectTo(
        urlForceRedirect ||
          redirect_after_login ||
          returnUrl ||
          redirectUrl ||
          '/'
      );
    }
  });
}

export function* updateToken({
  payload: { token, refreshToken, expiresIn }
}: LocalAction<{
  token: any;
  refreshToken: any;
  expiresIn?: number;
}>) {
  const { cookieBackend } = yield* getGlobalContext();
  // expiresIn is second
  const expires = expiresIn ? expiresIn / (3600 * 24) : 15;
  const dateExpiredToken = moment(new Date()).add(expiresIn, 'seconds').unix();

  cookieBackend.set('token', token, {
    expires
  });
  // life time refresh token plus 7 days, need improve
  cookieBackend.set('refreshToken', refreshToken, {
    expires: expires + 7
  });
  cookieBackend.set('dateExpiredToken', dateExpiredToken.toString(), {
    expires: expires + 7
  });
}

const sagas = [
  takeLatest(ACTION_LOGIN_BY_TOKEN, loginByToken),
  takeLatest(ACTION_UPDATE_TOKEN, updateToken)
];

export default sagas;
