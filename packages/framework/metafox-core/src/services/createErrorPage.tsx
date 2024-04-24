/**
 * @type: service
 * name: createErrorPage
 */

import { Page } from '@metafox/layout';
import { get } from 'lodash';
import { createElement } from 'react';

interface Params {
  loginRequired?: boolean;
}

export default function createErrorPage(error: unknown, params?: Params) {
  const message =
    get(error, 'response.data.error') || get(error, 'response.data.message');

  const pageName =
    get(error, 'response.status') === 403 ? 'core.error403' : 'core.error404';

  const loginRequired = params?.loginRequired;

  const debugTraceId = get(error, 'response.data.debugTraceId');

  return createElement(Page, {
    pageName,
    loginRequired,
    pageParams: {
      title: message,
      variant: 'h2',
      debugTraceId
    }
  });
}
