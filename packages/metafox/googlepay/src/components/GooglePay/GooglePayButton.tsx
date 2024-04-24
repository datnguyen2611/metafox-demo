/**
 * @type: ui
 * name: payment.element.GatewayButton.googlepay
 */

import React from 'react';
import GooglePay from './GooglePay';
import StripeWrapper from './StripeWrapper';

export default function GooglePayButton(props) {
  return (
    <StripeWrapper {...props}>
      <GooglePay {...props} />
    </StripeWrapper>
  );
}
