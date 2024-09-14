import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetPaymentMethods } from 'src/api/payment'; // Import the hook
import { useAuthContext } from 'src/auth/hooks'; // Assume you have an auth context for getting userId
// components
import Iconify from 'src/components/iconify';
import PaymentCardItem from '../payment/payment-card-item';
// import PaymentNewCardDialog from '../payment/payment-new-card-dialog'; // Comment out Stripe-related components

// Comment out Stripe-related imports and configuration
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// Comment out Stripe publishable key
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST);

// ----------------------------------------------------------------------

export default function AccountBillingPayment() {
  const newCardState = useBoolean();
  const { user } = useAuthContext(); // Assuming user context provides userId

  // Use the useGetPaymentMethods hook to get the user's payment methods
  const { paymentMethods, isLoading, error } = useGetPaymentMethods({ userId: user?.pid });

  const [savedCards, setSavedCards] = useState([]);

  // Whenever the paymentMethods data changes, update the savedCards state
  useEffect(() => {
    if (paymentMethods.length) {
      const formattedCards = paymentMethods.map((method) => ({
        id: method.paymentMethodId,
        cardType: method.cardBrand,
        cardNumber: `**** **** **** ${method.last4}`,
        expiryMonth: method.expiryMonth,
        expiryYear: method.expiryYear,
        primary: false,  // Adjust logic to determine if the card is primary
      }));

      setSavedCards(formattedCards);
    }
  }, [paymentMethods]);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading payment methods: {error.message}</p>;
  }

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

      {/* Commented out Stripe-related dialog */}
      {/* <Elements stripe={stripePromise}>
        <PaymentNewCardDialog
          open={newCardState.value}
          onClose={newCardState.onFalse}
          onCardAdded={handleCardAdded}
        />
      </Elements> */}
    </>
  );
}

// AccountBillingPayment.propTypes = {
//   cards: PropTypes.array,
// };
