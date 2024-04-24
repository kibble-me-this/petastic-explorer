import React, { useState } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
//
import { usePlaceOrder } from 'src/api/zinc';
import { useAuthContext } from 'src/auth/hooks';

import { fCurrency, fNumber } from 'src/utils/format-number';

import { useCheckoutContext } from './context';


import CheckoutSummary from './checkout-summary';
import CheckoutDelivery from './checkout-delivery';
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    label: 'Free',
    description: '2-3 Days delivery',
  },
  // {
  //   value: 10,
  //   label: 'Standard',
  //   description: '3-5 Days delivery',
  // },
  {
    value: 20,
    label: 'Express',
    description: '1 Day delivery',
  },
];



const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const { user } = useAuthContext();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');


  // Check if user exists and has a publicAddress
  if (user) {
    // Add a mock value for anymalTokenBalance
    user.anymalTokenBalance = 5000; // Mock value, replace with your desired value
  }

  const PAYMENT_OPTIONS = [
    // {
    //   value: 'paypal',
    //   label: 'Pay with Paypal',
    //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
    // },
    {
      value: 'credit',
      label: 'Credit / Debit Card',
      description: 'We support Mastercard, Visa, Discover and Stripe.',
    },
    {
      value: 'token',
      label: 'Pay with \u24C0ibble Cash',
      // description: `You've earned ${fNumber(user?.anymalTokenBalance || 0)} Kibble 🐱🐶🐾`,
      description: `You've earned 5000 ($5000 USD) \u24C0ibble 🐱🐶🐾`,
      caption: `(~${fCurrency(user?.anymalTokenBalance || 0)} USD)`,
    },
  ];



  const checkout = useCheckoutContext();
  const placeOrder = usePlaceOrder();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('CheckoutPayment :: onSubmit');

      // Transform checkout.items to the expected format for placeOrder
      const zincItems = checkout.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const zincShippingAddress = checkout.billing;
      const zincOrderTotal = checkout.subTotal;

      // Assuming placeOrder accepts an array of items and a billing address
      console.log('handlePlaceOrder call placeOrder: ');
      const result = await placeOrder(zincItems, zincShippingAddress, zincOrderTotal);
      console.log('handlePlaceOrder result: ', result);

      // If placeOrder is successful, proceed with the next steps
      checkout.orderNumber = result.request_id;
      checkout.onNextStep();
      checkout.onReset();
      console.info('DATA', data);
    } catch (error) {
      console.error('Error placing order(s):', error);
      // Handle error, such as showing a message to the user
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
            setSelectedPaymentOption={setSelectedPaymentOption}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={selectedPaymentOption === 'token' ? fCurrency('0') : checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            kibble={selectedPaymentOption === 'token' ? checkout.total : null}
            selectedPaymentOption={selectedPaymentOption}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
