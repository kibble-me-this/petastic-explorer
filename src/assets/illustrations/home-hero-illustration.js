import { memo } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

const stylesIcon = {
  width: 40,
  height: 40,
  color: 'common.black',
};

// ----------------------------------------------------------------------

function HomeHeroIllustration({ sx, ...other }) {
  const theme = useTheme();

  return (
    <Box
      component={m.div}
      sx={{
        width: 640,
        right: { md: 45, xl: 45 },
        top: { md: 100, xl: 100 },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Image
        visibleByDefault
        disabledEffect
        alt="home hero"
        src="/assets/images/home/passports.png"
      />
    </Box>
  );
}

HomeHeroIllustration.propTypes = {
  sx: PropTypes.object,
};

export default memo(HomeHeroIllustration);
