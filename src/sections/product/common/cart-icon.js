import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function CartIcon({ totalItems, blinkCount }) {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const checkoutPath = isChatPage ? paths.open_checkout : paths.product.checkout;

  useEffect(() => {
    let blinkInterval;
    if (blinkCount > 0) {
      // Blink effect logic
      blinkInterval = setInterval(() => {
        // Toggle the visibility of the icon by updating the state
      }, 500); // Adjust the interval duration as needed
    }

    return () => {
      clearInterval(blinkInterval);
    };
  }, [blinkCount]);

  return (
    <Box
      component={RouterLink}
      // href={paths.product.checkout}
      href={checkoutPath}
      sx={{
        right: 0,
        top: 700,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'background.neutral',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        bgcolor: 'text.blue',
        padding: (theme) => theme.spacing(1, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.card,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}

CartIcon.propTypes = {
  totalItems: PropTypes.number,
  blinkCount: PropTypes.number.isRequired,
};
