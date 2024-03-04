import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton'; // Import the Skeleton component.

// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeaderDetail({ participants, pet }) {
  const group = participants.length > 1;

  console.log('participants:', participants);
  console.log('pet:', pet);

  pet.kibble_balance = '100KBL ($100)';

  if (participants[0].name === 'Lucian Obrien') {
    participants[0].name = 'Grilli • 3yo';
    participants[0].status = 'Shih Tzu';
    participants[0].email = 'Kibble Rewards';
    participants[0].role = '$110 • 1600';
  } else if (participants[0].name === 'Deja Brady') {
    participants[0].name = 'Skril • 5yo';
    participants[0].status = 'Persian';
    participants[0].email = 'Kibble Rewards';
    participants[0].role = '$110 • 1600';
  } else if (participants[0].name === 'Harrison Stein') {
    participants[0].name = 'Ollie • Adult';
    participants[0].status = 'Chihuahua Mix';
    participants[0].email = 'Kibble Rewards';
    participants[0].role = '$110 • 1600';
  }

  const singleParticipant = participants[0];

  const renderGroup = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 32,
          height: 32,
        },
      }}
    >
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant} />
      ))}
    </AvatarGroup>
  );

  const renderSingle = (
    <Stack
      flexGrow={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      <ListItemText
        primary={
          pet.name ? (
            `${pet.name} • ${pet.lifeStage}`
          ) : (
            <Skeleton variant="text" width={100} /> // Display Skeleton if 'pet.name' is empty
          )
        }
        secondary={
          pet.breed ? (
            pet.breed
          ) : (
            <Skeleton variant="text" width={80} /> // Display Skeleton if 'pet.breed' is empty
          )
        }
        primaryTypographyProps={{
          component: Typography,
          variant: 'chat_body',
          style: {
            fontWeight: 'bold',
          },
        }}
        secondaryTypographyProps={{
          component: Typography,
          variant: 'chat_body',
          ...(singleParticipant.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
          style: {
            fontWeight: 'normal',
          },
        }}
      />
      <ListItemText
        primary={singleParticipant.email}
        primaryTypographyProps={{
          component: Typography,
          variant: 'chat_body',
          style: {
            fontWeight: 'normal',
          },
        }}
        // secondary={
        //   singleParticipant.role === 'offline'
        //     ? fToNow(singleParticipant.lastActivity)
        //     : singleParticipant.role
        // }
        secondary={
          pet.kibble_balance ? (
            pet.kibble_balance
          ) : (
            <Skeleton variant="text" width={100} sx={{ marginLeft: 'auto' }} /> // Align to the right edge
          )
        }
        secondaryTypographyProps={{
          component: Typography,
          variant: 'chat_body',
          ...(singleParticipant.role !== 'offline' && {
            textTransform: 'capitalize',
          }),
          style: {
            fontWeight: 'normal',
          },
        }}
        style={{ textAlign: 'right' }}
      />
    </Stack>
  );

  return (
    <>
      {group ? renderGroup : renderSingle}

      <Stack flexGrow={0.2} />

      {/** 
      <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      */}
    </>
  );
}

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array,
  pet: PropTypes.array,
};
