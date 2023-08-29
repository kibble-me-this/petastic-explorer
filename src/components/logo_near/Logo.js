import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link, Chip, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 16,
        height: 16,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.8213 0.81687L9.4828 5.77137C9.35849 5.93119 9.39401 6.14428 9.55383 6.26859C9.69589 6.37514 9.89123 6.35738 10.0155 6.23307L13.3008 3.37403C13.3541 3.32076 13.4428 3.32076 13.4784 3.37403C13.4961 3.39179 13.5139 3.4273 13.5139 3.46282V12.3951C13.5139 12.4662 13.4606 12.5194 13.3718 12.5194C13.3363 12.5194 13.3008 12.5017 13.2653 12.4661L3.32076 0.568258C3.01887 0.230855 2.55716 0 2.04218 0H1.70477C0.763596 0 0 0.763596 0 1.70477V14.2775C0 15.2186 0.763596 15.9822 1.70477 15.9822C2.29079 15.9822 2.84129 15.6804 3.16093 15.1654L6.49944 10.2109C6.62375 10.0511 6.58824 9.83796 6.42841 9.71365C6.28635 9.6071 6.09101 9.62486 5.9667 9.74917L2.68147 12.5905C2.62819 12.6437 2.5394 12.6437 2.50388 12.5905C2.48613 12.5727 2.46837 12.5372 2.46837 12.5017V3.56937C2.46837 3.49834 2.52164 3.44506 2.61043 3.44506C2.64595 3.44506 2.68147 3.46282 2.71698 3.49834L12.6615 15.3962C12.9811 15.7869 13.4606 16 13.9578 16H14.313C15.2542 16 16 15.2364 16 14.2952V1.70477C15.9822 0.763596 15.2186 0 14.2775 0C13.6915 0 13.141 0.301887 12.8213 0.81687Z" fill="#343A40"/>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
      <>
      {logo}
      </>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
