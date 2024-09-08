import { useState } from 'react';  // Make sure this is imported
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import PaymentCardItem from '../payment/payment-card-item';
import PaymentNewCardDialog from '../payment/payment-new-card-dialog';

// Load Stripe publishable key from environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST);

// ----------------------------------------------------------------------

export default function AccountBillingPayment({ cards }) {
  const newCardState = useBoolean();
  const [savedCards, setSavedCards] = useState(cards);

  const handleCardAdded = (paymentMethod) => {
    const newCard = {
      id: paymentMethod.id,
      cardType: paymentMethod.card.brand,   // Brand (Visa, Mastercard)
      cardNumber: `**** **** **** ${paymentMethod.card.last4}`, // Last 4 digits
      expiryMonth: paymentMethod.card.exp_month,
      expiryYear: paymentMethod.card.exp_year,
      primary: false,  // You can set this as default if necessary
    };

    setSavedCards([...savedCards, newCard]); // Add the newly added card to the list
  };


  return (
    <>
      <Card sx={{ my: 3 }}>
        <CardHeader
          title="Payment Method"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={newCardState.onTrue}
            >
              New Card
            </Button>
          }
        />

        <Box
          rowGap={2.5}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          sx={{ p: 3 }}
        >
          {savedCards.map((card) => (
            <PaymentCardItem key={card.id} card={card} />
          ))}
        </Box>
      </Card>

      {/* Wrap the PaymentNewCardDialog in the Elements provider */}
      <Elements stripe={stripePromise}>
        <PaymentNewCardDialog
          open={newCardState.value}
          onClose={newCardState.onFalse}
          onCardAdded={handleCardAdded}
        />
      </Elements>
    </>
  );
}

AccountBillingPayment.propTypes = {
  cards: PropTypes.array,
};
