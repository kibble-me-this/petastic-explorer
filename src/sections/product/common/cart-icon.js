import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog'; // Import Dialog component
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle component
import Button from '@mui/material/Button'; // Import DialogTitle component

// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

import CheckoutCart from 'src/sections/checkout/checkout-cart';

import React, { useState } from 'react'; // Import useState

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function CartIcon({ totalItems }) {
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close

  const mdUp = useResponsive('up', 'md');

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        // component={RouterLink}
        // href={paths.product.checkout}
        sx={{
          right: 0,
          top: 12,
          zIndex: 999,
          display: 'flex',
          cursor: 'pointer',
          position: 'absolute',
          color: 'text.primary',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          bgcolor: 'background.paper',
          padding: (theme) => theme.spacing(1, 3, 1, 2),
          boxShadow: (theme) => theme.customShadows.dropdown,
          transition: (theme) => theme.transitions.create(['opacity']),
          '&:hover': { opacity: 0.72 },
        }}
        onClick={handleOpenDialog} // Open the dialog on click
      >
        <Badge showZero badgeContent={totalItems} color="error" max={99}>
          <Iconify icon="solar:cart-3-bold" width={16} />
        </Badge>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {' '}
        {/* Dialog component */}
        <DialogTitle>Your Cart</DialogTitle> {/* DialogTitle component */}
        {/* Add your cart content here */}
        {/* For example, you can display the cart items and a "Close" button */}
        {/* Replace the content below with your actual cart content */}
        <div>
          <CheckoutCart />
          <Button onClick={handleCloseDialog}>Close</Button> {/* Close button */}
        </div>
      </Dialog>
    </>
  );
}

CartIcon.propTypes = {
  totalItems: PropTypes.number,
};
