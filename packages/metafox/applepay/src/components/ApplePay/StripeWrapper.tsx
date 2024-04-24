import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const StripeWrapper = ({ children, config }) => {
  const { item = {}, gateway_config } = config || {};
  const pk = gateway_config?.processor.public_key;

  if (!pk) return null;

  const stripePromise = loadStripe(pk);

  return (
    <Elements stripe={stripePromise} options={item}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;
