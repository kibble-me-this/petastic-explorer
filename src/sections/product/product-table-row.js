import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency, penniesToDollars } from 'src/utils/format-number';
import { isValidDate } from 'src/utils/format-time';
import { truncateText } from 'src/utils/format-text';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onEnableRow,
}) {
  const {
    title: name,
    price,
    publish,
    main_image: coverUrl,
    product_id,
    quantity,
    created_at,
    available,
    inventoryType,
    enabled, // This should be coming in correctly from the parent component
  } = row;

  console.log('Row enabled status:', enabled, 'for product:', product_id); // Debugging log

  const confirm = useBoolean();
  const popover = usePopover();

  // Validate created_at
  const createdDate = new Date(created_at);
  const isValidcreated_at = isValidDate(createdDate);

  // Add conditional style for disabled state
  const rowStyle = enabled ? {} : { opacity: 0.5 }; // Dims the row but doesn't disable the popover

  return (
    <>
      <TableRow hover selected={selected} style={rowStyle}>
        <TableCell padding="checkbox">
          <Checkbox disabled={!enabled} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={name}
            src={coverUrl}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={enabled ? onViewRow : undefined}
                sx={{ cursor: enabled ? 'pointer' : 'not-allowed' }}
              >
                {truncateText(name, 20)}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {product_id}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          {isValidcreated_at ? (
            <ListItemText
              primary={format(createdDate, 'dd MMM yyyy')}
              secondary={format(createdDate, 'p')}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          ) : (
            <ListItemText
              primary="Invalid Date"
              secondary="Invalid Date"
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          )}
        </TableCell>

        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={(available * 100) / quantity}
            variant="determinate"
            color={
              (inventoryType === 'out of stock' && 'error') ||
              (inventoryType === 'low stock' && 'warning') ||
              'success'
            }
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
          {!!available && available} {inventoryType}
        </TableCell>

        <TableCell>{fCurrency(penniesToDollars(price))}</TableCell>

        <TableCell>
          <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
            {publish}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEnableRow();
            popover.onClose();
          }}
        >
          <Iconify icon={enabled ? 'eva:toggle-right-outline' : 'eva:toggle-left-outline'} />
          {enabled ? 'Disable' : 'Enable'}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(product_id);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}


ProductTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
