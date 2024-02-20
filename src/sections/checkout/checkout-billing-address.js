// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressNewForm, AddressItem } from '../address';

// ----------------------------------------------------------------------

const _addresses = [
  {
    name: 'Carlos Herrera',
    phoneNumber: '310-880-8673',
    address: '2900 NE 7Th Ave Unit 2006',
    city: 'Miami',
    state: 'HI',
    country: 'US',
    zip: '33137',
    fullAddress: '2900 NE 7Th Ave Unit 2006, Miami, FL, US, 33137',
    addressType: 'HQ',
    primary: true,
  },
  {
    name: 'Lucian Obrien',
    phoneNumber: '904-966-2836',
    address: '1147 Rohan Drive Suite 819',
    city: 'Burlington',
    state: 'VT',
    country: 'US',
    zip: '82021',
    fullAddress: '1147 Rohan Drive Suite 819, Burlington, VT, US, 82021',
    addressType: 'Foster',
    primary: false,
  },
  {
    name: 'Deja Brady',
    phoneNumber: '399-757-9909',
    address: '18605 Thompson Circle Apt. 086',
    city: 'Idaho Falls',
    state: 'WV',
    country: 'US',
    zip: '50337',
    fullAddress: '18605 Thompson Circle Apt. 086, Idaho Falls, WV, US, 50337',
    addressType: 'Foster',
    primary: false,
  },
  {
    name: 'Harrison Stein',
    phoneNumber: '692-767-2903',
    address: '110 Lamar Station Apt. 730',
    city: 'Hagerstown',
    state: 'OK',
    country: 'US',
    zip: '49808',
    fullAddress: '110 Lamar Station Apt. 730, Hagerstown, OK, US, 49808',
    addressType: 'Foster',
    primary: false,
  },
];

export default function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();

  const addressForm = useBoolean();

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {_addresses.slice(0, 4).map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              action={
                <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                  {!address.primary && (
                    <Button size="small" color="error" sx={{ mr: 1 }}>
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => checkout.onCreateBilling(address)}
                  >
                    Deliver to this Address
                  </Button>
                </Stack>
              }
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows.card,
              }}
            />
          ))}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Address
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={checkout.onCreateBilling}
      />
    </>
  );
}
