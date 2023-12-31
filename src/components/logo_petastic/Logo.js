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
            marginLeft: '16px', // Add the desired padding value here
        width: 24,
        height: 24,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
    <svg width="24" height="24" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 240C186.274 240 240 186.274 240 120C240 53.7258 186.274 0 120 0C53.7258 0 0 53.7258 0 120C0 186.274 53.7258 240 120 240ZM126.155 182.717C126.155 182.717 100.87 199.856 88.8265 172.09C88.8265 172.09 72.8978 138.841 90.8963 79.241C86.3497 63.7826 87.0189 53.0432 87.0349 52.7866L87.0351 52.7819C107.551 49.4412 123.807 64.8494 123.807 64.8494C148.293 53.0239 162.321 75.0046 162.321 75.0046C162.321 75.0046 175.466 91.4054 168.591 117.889C161.728 144.372 142.096 149.153 142.096 149.153C130.159 153.542 119.447 146.358 117.068 144.761C116.967 144.694 116.881 144.636 116.811 144.59C115.092 143.44 115.056 144.723 115.056 144.723C114.124 161.342 126.155 182.717 126.155 182.717ZM130.234 123.263C136.008 124.219 142.047 116.376 143.706 105.749C145.364 95.1213 142.023 85.7408 136.238 84.7967C130.452 83.8405 124.412 91.6838 122.754 102.311C121.096 112.926 124.436 122.307 130.234 123.263Z" fill="#345BFF"/>
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
