import PropTypes from 'prop-types';
import { memo, useState, useCallback } from 'react';
// @mui
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
//
import { navVerticalConfig } from '../config';
import { StyledSubheader } from './styles';
import NavList from './nav-list';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, config, sx, ...other }) {
  const { currentRole } = config;

  console.log('Rendering NavSectionVertical with roles:', currentRole); // Debugging log

  return (
    <Stack sx={sx} {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          subheader={group.subheader}
          items={group.items}
          roles={group.roles}
          currentRole={currentRole}
          config={navVerticalConfig(config)}
        />
      ))}
    </Stack>
  );
}

NavSectionVertical.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      subheader: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.object),
      roles: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  config: PropTypes.shape({
    currentRole: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure this is an array
  }).isRequired,
  sx: PropTypes.object,
};

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({ subheader, items, roles, currentRole, config }) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  // Function to check if any of the user's roles match the allowed roles
  const hasPermission = (allowedRoles, userRoles) => {
    console.log('Checking permissions:', { allowedRoles, userRoles }); // Debugging log
    return allowedRoles.some(role => userRoles.includes(role));
  };

  // Hide the entire group if none of the user's roles are included in the roles array
  if (roles && !hasPermission(roles, currentRole)) {
    console.log('No permission for group:', subheader, 'with roles', roles, 'and user roles', currentRole); // Detailed Debugging log
    return null;
  }

  console.log('Rendering group:', subheader); // Debugging log

  const renderContent = items.map(list => (
    <NavList
      key={list.title + list.path}
      data={list}
      depth={1}
      hasChild={!!list.children}
      config={config}
    />
  )); // Simplified arrow function without curly braces and return statement

  return (
    <List disablePadding sx={{ px: 2 }}>
      {subheader ? (
        <>
          <StyledSubheader disableGutters disableSticky onClick={handleToggle} config={config}>
            {subheader}
          </StyledSubheader>
          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </List>
  );
}

Group.propTypes = {
  subheader: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  currentRole: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure this is an array for multiple roles
  config: PropTypes.object.isRequired,
};
