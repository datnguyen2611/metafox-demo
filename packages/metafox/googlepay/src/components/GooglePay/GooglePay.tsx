import React from 'react';
import {
  useStripe,
  useElements,
  ExpressCheckoutElement
} from '@stripe/react-stripe-js';
import { useFormSchema } from '@metafox/form';
import { useGlobal } from '@metafox/framework';
import { useFormikContext } from 'formik';
import { Skeleton, Box, useTheme } from '@mui/material';

const StripeButton = props => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = React.useState('');
  const formSchema = useFormSchema();
  const { values } = useFormikContext();
  const { dispatch } = useGlobal();
  const { config, setShow } = props;
  const { gateway_field_name, gateway_id } = config;
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();

  const onReady = ({ availablePaymentMethods }) => {
    setLoading(false);

    if (!availablePaymentMethods) {
      setShow(false);
    }
  };

  const onError = e => {
    setShow(false);
  };

  const onClick = event => {
    if (!stripe || !elements) return;

    elements.submit().then(result => {
      event.resolve();
      // Handle result.error
    });
  };

  const onConfirm = async event => {
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const handleAction = async ({ clientSecret, return_url }) => {
      // Confirm the PaymentIntent
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url
        }
      });

      if (stripeError) {
        // Show error to your customer (e.g., insufficient funds)
        setErrorMessage(stripeError.message);

        return;
      }
    };

    dispatch({
      type: 'payment/googlepay/confirm',
      payload: {
        formSchema,
        handleAction,
        values: {
          ...(values || {}),
          [gateway_field_name]: gateway_id
        }
      }
    });

    return;
  };

  return (
    <Box>
      {loading ? (
        <Box>
          <Skeleton animation="wave" height={40} />
        </Box>
      ) : null}
      <Box>
        <ExpressCheckoutElement
          onLoadError={onError}
          onConfirm={onConfirm}
          onClick={onClick}
          options={{
            wallets: {
              applePay: 'never',
              googlePay: 'always'
            },
            buttonTheme: {
              googlePay: theme.palette.mode === 'light' ? 'black' : 'white'
            },
            buttonType: {
              googlePay: 'plain'
            }
          }}
          onReady={onReady}
        />
        {errorMessage && <div>{errorMessage}</div>}
      </Box>
    </Box>
  );
};

export default StripeButton;
