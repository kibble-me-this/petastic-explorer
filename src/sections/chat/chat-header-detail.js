import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';

// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeaderDetail({ participants }) {
  const group = participants.length > 1;

  console.log('participants:', participants);

  if (participants[0].name === 'Lucian Obrien') {
    participants[0].name = 'Grilli • 3yo';
    participants[0].status = 'Shih Tzu';
    participants[0].email = 'Kibble Balance';
    participants[0].role = '$100 • 1600';
  } else if (participants[0].name === 'Deja Brady') {
    participants[0].name = 'Skril • 5yo';
    participants[0].status = 'Persian';
    participants[0].email = 'Kibble Balance';
    participants[0].role = '$100 • 1600';
  } else if (participants[0].name === 'Harrison Stein') {
    participants[0].name = 'Fred Again • 4yo';
    participants[0].status = 'French Bullog';
    participants[0].email = 'Kibble Balance';
    participants[0].role = '$100 • 1600';
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
      justifyContent="space-between" // This will space the items apart horizontally
      spacing={2}
    >
      <ListItemText
        primary={singleParticipant.name}
        secondary={
          singleParticipant.status === 'offline'
            ? fToNow(singleParticipant.lastActivity)
            : singleParticipant.status
        }
        primaryTypographyProps={{
          component: Typography, // Use Typography component
          variant: 'chat_body', // Apply the 'chat_body' variant here
          style: {
            fontWeight: 'bold', // Set the font weight to normal (not bold)
          },
        }}
        secondaryTypographyProps={{
          component: Typography, // Use Typography component for secondary text
          variant: 'chat_body', // Apply the 'chat_body' variant to secondary text as well
          ...(singleParticipant.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
          style: {
            fontWeight: 'normal', // Set the font weight to normal (not bold)
          },
        }}
      />
      <ListItemText
        primary={singleParticipant.email}
        primaryTypographyProps={{
          component: Typography, // Use Typography component for secondary text
          variant: 'chat_body', // Apply the 'chat_body' variant to secondary text as well
          style: {
            fontWeight: 'normal', // Set the font weight to normal (not bold)
          },
        }}
        secondary={
          singleParticipant.role === 'offline'
            ? fToNow(singleParticipant.lastActivity)
            : singleParticipant.role
        }
        secondaryTypographyProps={{
          component: Typography, // Use Typography component for secondary text
          variant: 'chat_body', // Apply the 'chat_body' variant to secondary text as well
          ...(singleParticipant.role !== 'offline' && {
            textTransform: 'capitalize',
          }),
          style: {
            fontWeight: 'normal', // Set the font weight to normal (not bold)
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
};
