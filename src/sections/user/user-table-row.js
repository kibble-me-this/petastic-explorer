import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import UserQuickEditForm from './user-quick-edit-form';
import Logo from '../../components/logo_near';
import LogoPetastic from '../../components/logo_petastic';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, loading={loading}, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    shelterName,
    shelterCity,
    shelterState,
    locationCountry,
    locationState,
    locationCity,
    petName,
    petBreed,
    petGender,
    petLifeStage,
    petAvatar,
  } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      {loading ? (
        <TableRow hover>

          <TableCell padding="checkbox">
            <Skeleton variant="circular" width={16} height={16} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={100} height={16} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={100} height={16} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={100} height={16} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={100} height={16} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={100} height={16} />
          </TableCell>
          <TableCell align="right" sx={{ px: 1 }}>
            <Skeleton variant="rectangular" width={40} height={16} />
          </TableCell>
        </TableRow>
      ) : (
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <LogoPetastic width={16} height={16} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {/* You can customize the Avatar and ListItemText components here */}
          <Avatar alt={petName} src={petAvatar} sx={{ mr: 2 }} />

          <ListItemText
            primary={petName}
            secondary={`${petLifeStage}, ${petGender}`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{petBreed}</TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{locationCountry}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{locationState}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{locationCity}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {/* 
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          */}
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
)}


      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-bottom"
        sx={{ width: 50 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Logo width={16} height={16} />
        </MenuItem>
        {/* 
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        */}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Open Near Explorer"
        content="Are you sure want to go to Near Explorer?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Yes
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loading: PropTypes.bool,
};

// You can define a function to generate the avatar URL based on the shelterName
function getAvatarUrl(shelterName) {
  // Logic to generate the avatar URL
  return `url_for_avatar/${shelterName}.jpg`;
}
