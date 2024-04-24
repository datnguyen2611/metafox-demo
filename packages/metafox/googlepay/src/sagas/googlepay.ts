/**
 * @type: saga
 * name: payment.googlepay
 */
import {
  getGlobalContext,
  handleActionError,
  LocalAction
} from '@metafox/framework';
import { get } from 'lodash';
import { takeLatest } from 'redux-saga/effects';
import { FormSchemaShape } from '@metafox/form';

export function* applepayConfirm({
  payload
}: LocalAction<{
  formSchema: FormSchemaShape;
  handleAction: (x: Record<string, any>) => {};
  values: Record<string, any>;
}>) {
  const { formSchema, handleAction, values = {} } = payload;
  const { action, method } = formSchema;
  const { apiClient, compactUrl, redirectTo } = yield* getGlobalContext();

  try {
    const response = yield apiClient.request({
      method: method || 'POST',
      url: compactUrl(action, {}),
      data: values
    });

    const clientSecret = get(response, 'data.data.token');
    const return_url = get(response, 'data.data.url');

    if (clientSecret) {
      handleAction({ clientSecret, return_url });
    } else {
      return_url && redirectTo(return_url);
    }
  } catch (err) {
    yield* handleActionError(err);
  }
}

const sagaEffect = [takeLatest('payment/googlepay/confirm', applepayConfirm)];

export default sagaEffect;
