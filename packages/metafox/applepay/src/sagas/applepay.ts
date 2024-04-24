/**
 * @type: saga
 * name: payment.applepay
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
  handleAppleAction: (x: Record<string, any>) => {};
  values: Record<string, any>;
}>) {
  const { formSchema, handleAppleAction, values } = payload;
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
      handleAppleAction({ clientSecret, return_url });
    } else {
      return_url && redirectTo(return_url);
    }
  } catch (err) {
    yield* handleActionError(err);
  }
}

const sagaEffect = [takeLatest('payment/applePay/confirm', applepayConfirm)];

export default sagaEffect;
