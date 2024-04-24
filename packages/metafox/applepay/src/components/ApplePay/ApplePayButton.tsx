/**
 * @type: ui
 * name: payment.element.GatewayButton.applepay
 */

import React from 'react';
import ApplePay from './ApplePay';
import StripeWrapper from './StripeWrapper';

export default function ApplePayButton(props) {
  return (
    <StripeWrapper {...props}>
      <ApplePay {...props} />
    </StripeWrapper>
  );
}
