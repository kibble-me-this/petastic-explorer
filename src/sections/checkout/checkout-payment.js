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
// import { createOrder } from 'src/api/order';
import { createOrderV2 } from 'src/api/order';
import { useAuthContext } from 'src/auth/hooks';
import { fCurrency } from 'src/utils/format-number';
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

  if (user) {
    user.anymalTokenBalance = Infinity;
  }

  const PAYMENT_OPTIONS = [
    // {
    //   value: 'credit',
    //   label: 'Credit / Debit Card',
    //   description: 'We support Mastercard, Visa, Discover and Stripe.',
    // },
    {
      value: 'token',
      label: 'Pay with \u24C0ibble Cash',
      description: `You've activated \u221E \u24C0ibble Cash as a Tester (woah!) 🐱🐶🐾`,
      caption: `(~${fCurrency(user?.anymalTokenBalance || 0)} USD)`,
    },
  ];

  const checkout = useCheckoutContext();

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

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     console.log('CheckoutPayment :: onSubmit');

  //     const orderData = {
  //       ...checkout,
  //       userEmail: user.email,
  //       anymalTokenBalance: user.anymalTokenBalance,
  //     };

  //     const result = await createOrder(orderData);

  //     console.log('handlePlaceOrder result: ', result);

  //     await checkout.onUpdateOrderNumber(result.id);
  //     checkout.onNextStep();
  //     checkout.onReset();
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error('Error placing order(s):', error);
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Destructure and add fallback values for missing data from checkout.billing
      const {
        name = "Default Name",
        firstName = "Default First Name",  // Fallback if firstName is missing
        lastName = "Default Last Name",    // Fallback if lastName is missing
        fullAddress = "Unknown Address",   // Fallback if fullAddress is missing
        phoneNumber = "5551234567",        // Fallback if phoneNumber is missing
        city = "Unknown City",             // Fallback if city is missing
        state = "Unknown State",           // Fallback if state is missing
        zip = "00000"                      // Fallback if zip_code is missing
      } = checkout.billing;

      // Fallback for product price if missing
      const products = checkout.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price || 0  // Fallback if price is missing
      }));

      // Calculate the total price on the client-side and apply the multiplier
      const totalPrice = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const max_price = (totalPrice * 1.35) * 100; // Apply the 1.35 multiplier

      // Get order_type from environment variables
      const orderType = process.env.REACT_APP_ORDER_TYPE || 'test'; // Default to 'test' if not set

      // Prepare orderData with fallbacks applied
      const orderData = {
        shelter_id: checkout.accountID,  // Shelter ID
        customer: {
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
          email: user.email,
          phoneNumber  // Ensure this is passed
        },
        shipping_address: {
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
          address_line1: fullAddress.split(",")[0], // Split the address string to get address_line1
          city,                   // Send city
          state,                 // Send state
          zip_code: zip,           // Send zip_code
          country: "US",
          phone_number: phoneNumber     // Send phone number
        },
        products,
        max_price,  // Add max_price calculated above
        order_type: orderType  // Use the environment variable here
      };

      // Call your order creation function (createOrderV2)
      const result = await createOrderV2(orderData);
      console.log('handlePlaceOrder result: ', result);

      // Update the order number and proceed to the next step in checkout
      await checkout.onUpdateOrderNumber(result.id);
      checkout.onNextStep();
      checkout.onReset();

    } catch (error) {
      console.error('Error placing order(s):', error);
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
            kibble={selectedPaymentOption === 'token' ? Number(checkout.total) : null}
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
