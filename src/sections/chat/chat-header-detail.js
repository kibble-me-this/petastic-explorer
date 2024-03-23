import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// utils
import { fKibble } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeaderDetail({ pet }) {

  pet = {

    id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
    status: "online",
    name: "Raley",
    age: "Senior",
    breed: "Maltese",
    opt_in: "true",
    kibble_balance: "2000",
    avatarUrl: "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/69301534/1/",

  };

  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={pet.status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={pet.avatarUrl} alt={pet.name} />
      </Badge>

      <ListItemText
        primary={`${pet.name} • ${pet.age}`}
        secondary={
          pet.opt_in === 'trueho'
            ? fKibble(pet.kibble_balance)
            : fKibble(pet.kibble_balance)
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

      <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </>
  );
}

ChatHeaderDetail.propTypes = {
  pet: PropTypes.array,
};
