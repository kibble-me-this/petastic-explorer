import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer, delivery, payment, shippingAddress, trackingObtained }) {


  const allTracking = trackingObtained.flatMap(item => item.tracking || []);

  const renderCustomer = (
    <>
      <CardHeader
        title="Customer Info"
      // action={
      //   <IconButton disabled>
      //     <Iconify icon="solar:pen-bold" />
      //   </IconButton>
      // }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer.name}
          src={customer.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer.email}</Box>

          <Box>
            IP Address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer.ipAddress}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title="Delivery"
      // action={
      //   <IconButton disabled>
      //     <Iconify icon="solar:pen-bold" />
      //   </IconButton>
      // }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Ship by
          </Box>
          {delivery.shipBy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Speed
          </Box>
          {delivery.speedy}
        </Stack>
        <Stack direction="row" alignItems="flex-start">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Tracking No.
          </Box>
          <Box>
            {allTracking.length > 0 ? (
              allTracking.map(({ tracking_url, tracking_number }, index) => (
                <Link
                  key={index}
                  href={tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="always"
                  color="inherit"
                  sx={{ display: 'block' }}
                >
                  {tracking_number}
                </Link>
              ))
            ) : (
              <Link
                href={delivery.trackingNumber}
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                color="inherit"
                sx={{ display: 'block' }}
              >
                {delivery.trackingNumber}
              </Link>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title="Shipping"
      // action={
      //   <IconButton disabled>
      //     <Iconify icon="solar:pen-bold" />
      //   </IconButton>
      // }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          {shippingAddress.fullAddress}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          {shippingAddress.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader
        title="Payment"
      // action={
      //   <IconButton disabled>
      //     <Iconify icon="solar:pen-bold" />
      //   </IconButton>
      // }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Account number
        </Box>
        {payment.cardNumber}
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderDelivery}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderShipping}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderPayment}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
  trackingObtained: PropTypes.arrayOf(PropTypes.shape({
    delivery_status: PropTypes.string,
    obtained_at: PropTypes.string,
    tracking_url: PropTypes.string,
    tracking_number: PropTypes.string,
  })),
};
