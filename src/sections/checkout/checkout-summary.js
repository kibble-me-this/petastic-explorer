import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';

// utils
import { fCurrency, fKibble } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  kibble,
  //
  onEdit,
  onApplyDiscount,
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const displayKibble = kibble !== null ? '5000 Available' : '-';


  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
          </Stack>



          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? fCurrency(shipping) : displayShipping}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {'\u24C0'}ibble Cash
              </Typography>
              <Iconify icon="solar:wad-of-money-bold" width={16} sx={{ ml: 1, color: 'success.main' }} />
            </Stack>
            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
              {kibble ? fKibble(kibble) : displayKibble}
            </Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (Tax included if applicable)
              </Typography>
            </Box>
          </Stack>

          <Divider variant="middle" />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              Purchase Reward:
            </Typography>
            <Typography sx={{ color: 'success.main' }} variant="subtitle2">{discount ? fKibble(discount) : '-'}</Typography>
          </Stack>

          {/* {onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )} */}
        </Stack>
      </CardContent>
    </Card>
  );
}

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  shipping: PropTypes.number,
  kibble: PropTypes.number,

  subTotal: PropTypes.number,
  onEdit: PropTypes.func,
  onApplyDiscount: PropTypes.func,
};
