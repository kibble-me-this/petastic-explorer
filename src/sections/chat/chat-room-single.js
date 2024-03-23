import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Skeleton from '@mui/material/Skeleton'; // Import Skeleton component

// ----------------------------------------------------------------------

export default function ChatRoomSingle({ user, participant, pet }) {
  const collapse = useBoolean(true);

  const { legalName, address, city, state, zipCode, phoneNumber, email } = user
  const {
    id,
    status = 'online',
    name,
    lifeStage,
    breed,
    opt_in = 'true',
    kibble_balance = '2000', // Use "=" instead of ":"
    avatar,
    acquired_from,
  } = pet;

  const fullAddress = `${address}\n${city}, ${state}, ${zipCode}`;

  const renderPetInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      {avatar ? (
        <Avatar alt={name} src={avatar} sx={{ width: 96, height: 96, mb: 2 }} />
      ) : (
        <Skeleton variant="circular" width={96} height={96} />
      )}
      {name ? (
        <Typography variant="subtitle1">{name}</Typography>
      ) : (
        <Skeleton variant="text" width={120} height={24} />
      )}
      {breed ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {breed}
        </Typography>
      ) : (
        <Skeleton variant="text" width={150} height={18} />
      )}
    </Stack>
  );

  const renderBtn = (
    <ListItemButton
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 40,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'overline',
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Box component="span" sx={{ flexGrow: 1 }}>
        Emergency Information
      </Box>
      <Iconify
        width={16}
        icon={collapse.value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      />
    </ListItemButton>
  );

  const renderContent = (
    <Stack
      spacing={2}
      sx={{
        px: 2,
        py: 2.5,
        '& svg': {
          mr: 1,
          flexShrink: 0,
          color: 'text.disabled',
        },
      }}
    >
      {/* LegalName with Skeleton */}
      {avatar ? (
        <Stack direction="row">
          <Iconify icon="solar:user-rounded-bold" />
          <Typography variant="body2">{legalName}</Typography>
        </Stack>
      ) : (
        <Stack direction="row">
          <Iconify icon="solar:phone-bold" />
          <Skeleton variant="text" width={100} />
        </Stack>
      )}

      {/* Address with Skeleton */}
      {avatar ? (
        <Stack direction="row">
          <Iconify icon="mingcute:location-fill" />
          <Typography variant="body2">
            {fullAddress}
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row">
          <Iconify icon="mingcute:location-fill" />
          <Stack direction="column">
            <Skeleton variant="text" width={150} />
            <Skeleton variant="text" width={150} />
          </Stack>
        </Stack>
      )}

      {/* Phone Number with Skeleton */}

      {avatar ? (
        <Stack direction="row">
          <Iconify icon="solar:phone-bold" />
          <Typography variant="body2">{phoneNumber}</Typography>
        </Stack>
      ) : (
        <Stack direction="row">
          <Iconify icon="solar:phone-bold" />
          <Skeleton variant="text" width={100} />
        </Stack>
      )}

      {/* Email with Skeleton */}
      {avatar ? (
        <Stack direction="row">
          <Iconify icon="fluent:mail-24-filled" />
          <Typography variant="body2" noWrap>
            {email}
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row">
          <Iconify icon="fluent:mail-24-filled" />
          <Skeleton variant="text" width={150} />
        </Stack>
      )}
    </Stack>
  );

  return (
    <>
      {renderPetInfo}
      {renderBtn}
      <div>
        <Collapse in={collapse.value}>{renderContent}</Collapse>
      </div>
    </>
  );
}

ChatRoomSingle.propTypes = {
  user: PropTypes.array,
  participant: PropTypes.object,
  pet: PropTypes.array,
};
