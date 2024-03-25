import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fKibble } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import Skeleton from '@mui/material/Skeleton'; // Import Skeleton component


// ----------------------------------------------------------------------

export default function ChatHeaderDetail({ pet }) {

  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    if (pet.name !== '') {
      // If name is not empty, set loading to false
      setLoading(false);
    }
  }, [pet.name]);

  const {
    id,
    status = 'online',
    name,
    lifeStage,
    breed,
    opt_in = 'true',
    kibble_balance = '100',
    avatar,
    acquired_from,
  } = pet;

  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {/* Render Avatar or Skeleton depending on loading status */}
        {loading ? (
          <Skeleton variant="circular" width={40} height={40} />
        ) : (
          <Avatar src={avatar} alt={name} />
        )}
      </Badge>

      <ListItemText
        primary={
          loading ? (
            // Render Skeleton for primary text
            <Skeleton variant="text" width={120} />
          ) : (
            `${name} • ${lifeStage}`
          )
        }
        secondary={
          // eslint-disable-next-line no-nested-ternary
          loading ? (
            // Render Skeleton for secondary text
            <Skeleton variant="text" width={80} />
          ) : (
            pet.opt_in === 'true' ? fKibble(kibble_balance) : fKibble(kibble_balance)
          )
        }
        secondaryTypographyProps={{
          component: 'span',
          ...(pet.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  return (
    <>
      {renderSingle}

      <Stack flexGrow={1} />

      {/* Render IconButton with Skeleton or Iconify depending on loading status */}
      {/* <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton> */}
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="eva:more-vertical-fill" color="white" />
      </IconButton>
    </>
  );
}

ChatHeaderDetail.propTypes = {
  pet: PropTypes.array,
};
