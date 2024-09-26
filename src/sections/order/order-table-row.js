import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  // Get the most recent attempt (last one) from the attempts array
  const latestAttempt = row.attempts[row.attempts.length - 1] || {};
  const products = latestAttempt.products || [];  // Use products for items

  // Extract zinc_webhooks from the row and access delivery dates and delivery status
  const zinc_webhooks = row.zinc_webhooks || [];
  const latestWebhook = zinc_webhooks[0] || {}; // Assuming we're using the latest zinc_webhooks object
  const deliveryDates = latestWebhook.delivery_dates || [];

  // Calculate total quantity of items in the order
  const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);

  // Calculate the subtotal of all items in the order
  const subTotal = products.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0);

  // Check if all products have a 'Delivered' delivery_status
  const allProductsDelivered = products.every(product => product.delivery_status === 'Delivered');

  // Set status to "Completed" if all products are delivered, otherwise use the row's status
  const status = allProductsDelivered ? 'Completed' : (row.status || 'unknown');

  const orderNumber = row.id || 'N/A';
  const createdAt = latestAttempt.createdAt ? new Date(latestAttempt.createdAt) : new Date();
  const customer = latestAttempt.customer || { name: 'Unknown', email: 'N/A', avatarUrl: '' };

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disabled checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box
          // onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {orderNumber}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={customer.name} src={customer.avatarUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={customer.name || 'Unknown'}
          secondary={customer.email || 'N/A'}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center"> {totalQuantity} </TableCell>

      <TableCell> {fCurrency(subTotal) || '-'} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Completed' && 'success') ||
            (status === 'In Transit' && 'info') ||
            (status === 'Pending' && 'warning') ||
            (status === 'Cancelled' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {products.map((item) => {
              // First, check if the item has a delivery date directly
              let deliveryDate = item.delivery_date || 'N/A';
              const trackingUrl = item.tracking_url || 'N/A';
              const deliveryStatus = item.delivery_status || 'N/A';

              // If no direct delivery date, look in zinc_webhooks delivery_dates array
              if (deliveryDate === 'N/A') {
                const matchingDeliveryDate = deliveryDates.find((deliveryDateEntry) =>
                  deliveryDateEntry.products.some((prod) => prod.product_id === item.product_id)
                );
                deliveryDate = matchingDeliveryDate?.delivery_date || 'N/A';
              }

              return (
                <Stack
                  key={item.product_id}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                    },
                  }}
                >
                  <Avatar
                    src={item.coverUrl || ''} // Replace with actual image URL if available
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />

                  <ListItemText
                    primary={item.name || 'Unnamed Product'}
                    secondary={item.product_id}
                    primaryTypographyProps={{
                      typography: 'body2',
                    }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <Box>x{item.quantity}</Box>

                  <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price) || '$0'}</Box>

                  {/* Adding the delivery date */}
                  <Box sx={{ width: 160, textAlign: 'right' }}>{`${deliveryDate}`}</Box>

                  {/* Adding the delivery status */}
                  <Box sx={{ width: 160, textAlign: 'right' }}>{`${deliveryStatus}`}</Box>

                  {/* Adding the tracking URL */}
                  <Box sx={{ width: 160, textAlign: 'right' }}>
                    {trackingUrl !== 'N/A' ? (
                      <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                        Track Package
                      </a>
                    ) : (
                      'No Tracking Info'
                    )}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          disabled
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          disabled
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

OrderTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
