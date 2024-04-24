/**
 * @type: ui
 * name: story-book.sample.form
 */

import { RemoteFormBuilder } from '@metafox/form';
import React from 'react';

export default function Base() {
  return (
    <RemoteFormBuilder dataSource={{ apiUrl: '/admincp/setting/form/user' }} />
  );
}
