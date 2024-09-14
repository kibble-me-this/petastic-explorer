import PropTypes from 'prop-types';
import { useState } from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'; // Comment out Stripe hooks
import { createPaymentMethod } from 'src/api/payment'; // Import your function to create the payment method
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
// hooks 
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// Styling for Stripe's CardElement (commented out)
// const cardElementOptions = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#424770',
//       letterSpacing: '0.025em',
//       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
//       '::placeholder': {
//         color: '#aab7c4',
//       },
//     },
//     invalid: {
//       color: '#9e2146',
//     },
//   },
// };

// ----------------------------------------------------------------------

export default function PaymentNewCardDialog({ onClose, onCardAdded, ...other }) {
  const popover = usePopover();
  // const stripe = useStripe(); // Comment out Stripe hook
  // const elements = useElements(); // Comment out Stripe hook
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user } = useAuthContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Comment out Stripe-related logic
    // if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    // const cardElement = elements.getElement(CardElement);

    const billingDetails = {
      name: event.target.cardHolderName.value,
      address: {
        line1: event.target.billingLine1.value,
        city: event.target.billingCity.value,
        state: event.target.billingState.value,
        postal_code: event.target.billingPostalCode.value,
        country: event.target.billingCountry.value,
      },
    };

    // Comment out Stripe payment method creation
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    //   billing_details: billingDetails,
    // });

    // if (error) {
    //   setErrorMessage(error.message);
    //   setLoading(false);
    // } else {
    try {
      // Optimistically add the card to the UI using the prop onCardAdded
      // onCardAdded(paymentMethod);

      // Simulate API call to save the payment method (without Stripe)
      const response = await createPaymentMethod(user?.pid, {
        // Use dummy data in place of Stripe's payment method
        paymentMethodId: 'dummy-id',
        cardBrand: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2024,
        billingDetails,
      });

      setLoading(false);

      if (response.success) {
        onClose(); // Close the dialog
      } else {
        setErrorMessage(response.error || 'Failed to save payment method.');
      }
    } catch (apiError) {
      setErrorMessage(apiError.message || 'Failed to save payment method.');
      setLoading(false);
    }
    // }
  };

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <DialogTitle> New Card </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={2.5}>
              {/* Comment out Stripe's Card Element */}
              {/* <div style={{ padding: '12px 14px', border: '1px solid #c4c4c4', borderRadius: '4px' }}>
                <CardElement options={cardElementOptions} />
              </div> */}

              {/* Cardholder Name */}
              <TextField
                autoFocus
                name="cardHolderName"
                label="Card Holder"
                placeholder="JOHN DOE"
                InputLabelProps={{ shrink: true }}
              />

              {/* Billing Address */}
              <TextField
                name="billingLine1"
                label="Billing Address Line 1"
                placeholder="1234 Main St"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="billingCity"
                label="City"
                placeholder="San Francisco"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="billingState"
                label="State"
                placeholder="CA"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="billingPostalCode"
                label="Postal Code"
                placeholder="94111"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="billingCountry"
                label="Country"
                placeholder="US"
                InputLabelProps={{ shrink: true }}
              />

              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
                Your transaction is secured with SSL encryption
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover>
    </>
  );
}

PaymentNewCardDialog.propTypes = {
  onClose: PropTypes.func,
  onCardAdded: PropTypes.func.isRequired,
};
