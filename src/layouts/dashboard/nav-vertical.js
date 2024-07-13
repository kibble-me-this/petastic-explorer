import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUserRoles } from 'src/api/user';
// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hooks';
import { NavSectionVertical } from 'src/components/nav-section';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useAuthContext(); // Get user from the context
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();

  const [userRoles, setUserRoles] = useState([]); // Initialize as an empty array

  // Fetch user roles based on user email
  const { roles, isLoading } = useGetUserRoles({ email: user?.email });

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname, openNav, onCloseNav]);

  useEffect(() => {
    if (!isLoading && roles.length > 0) {
      setUserRoles(roles);
      console.log('Fetched user roles:', roles); // Debugging log
    }
  }, [isLoading, roles]);

  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: userRoles, // Pass the array of roles
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  onCloseNav: PropTypes.func,
  openNav: PropTypes.bool,
};
