import parse from 'html-react-parser'; // Import the parse function from the library

import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Iconify from 'src/components/iconify';
//
import { useGetMessage } from './hooks';

import './ChatMessageItem.css'; // Import the CSS file
import YourCustomComponent from './YourCustomComponent';

// ----------------------------------------------------------------------

export default function ChatMessageItem({
  message,
  participants,
  onOpenLightbox,
  pet,
  setPet,
  onAiLoadingChange,
}) {
  const { user, fetchai } = useMockedUser();

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: user.id,
  });

  console.log('------> message.body:', message.body);
  console.log('------> message.prop:', message.prop);
  console.log('------> me', me);

  const { firstName, avatarUrl } = senderDetails;

  const { body, prop, createdAt } = message;

  let avatarSrc;
  let avatarName;

  if (me) {
    avatarSrc = user.photoURL;
  } else if (!hasImage) {
    avatarSrc = fetchai.photoURL;
  } else {
    avatarSrc = fetchai.photoDarkURL;
  }

  if (me) {
    avatarName = user.displayName;
  } else if (!hasImage) {
    avatarName = fetchai.displayName;
  } else {
    avatarName = fetchai.displayName;
  }

  const renderInfo = (
    <Typography
      noWrap
      variant="chat_author"
      sx={{
        // mb: 0.2,
        color: me ? 'black' : '#99ADFF',
        // fontWeight: '400', // Add this line for bold text
        // textTransform: 'uppercase', // Add this line for uppercase text
        ...(hasImage && {
          mr: 'auto',
          mb: 1,
          color: 'grey.700',
        }),
      }}
    >
      {/* !me && `${firstName},` */}
      {`${avatarName}`} &nbsp;
      {/* formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
    }) */}
    </Typography>
  );

  // Determine which styles to apply based on message.body content
  const contentStyle = () => {
    if (message.body.includes('ingredients')) {
      // HTML content is present, apply button style
      return 'ingredients';
    }
    // Default style (you can define a different style here)
    return 'ingredients';
  };

  const determinedStyle = contentStyle();

  // Define a function to handle React component flag
  const handleReactComponent = (content) => {
    if (message.prop) {
      return (
        <YourCustomComponent
          messageContent={content}
          pet={pet}
          setPet={setPet}
          onAiLoadingChange={onAiLoadingChange}
        />
      );
    }
    if (message.body.includes('html login button')) {
      return (
        <YourCustomComponent
          messageContent={content}
          pet={pet}
          setPet={setPet}
          onAiLoadingChange={onAiLoadingChange}
        />
      );
    }
    if (message.body.includes('html accept pet button')) {
      return (
        <YourCustomComponent
          messageContent={content}
          pet={pet}
          setPet={setPet}
          onAiLoadingChange={onAiLoadingChange}
        />
      );
    }
    return <div className={determinedStyle}>{parse(content.body)}</div>;
  };

  // Determine which callback function to use based on the flag in message.body
  const renderContent = () => {
    console.log('Calling renderContent: ', message);

    const bodyContent = (
      <>
        <Box sx={{ paddingTop: 1.5 }}>{message.body}</Box>
      </>
    );

    if (message.body.includes('html') || message.contentType === 'html') {
      return <>{handleReactComponent(message)}</>;
    }

    return bodyContent;
  };

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 2.5,
        typography: 'chat_body',
        bgcolor: '#345BFF',
        color: 'white',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'flex-start', // Add this line
        ...(me && {
          color: 'grey.800',
          bgcolor: 'rgba(0, 0, 0, 0.10)',
          ml: 0.2,
        }),
        ...(hasImage && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        {!me ? (
          <Avatar
            alt={firstName}
            src={avatarSrc}
            sx={{
              width: 20,
              height: 20,
              mr: 1,
              // alignSelf: 'center',
              ...(hasImage && {
                // mr: 'auto',
                mb: 1,
                color: 'black',
              }),
            }}
          />
        ) : null}
        {renderInfo}
      </div>

      {renderContent()}

      {hasImage && (
        <Box
          component="img"
          alt="attachment"
          src={body}
          // onClick={() => onOpenLightbox(body)}
          sx={{
            // minHeight: 220,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        />
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 2 }}>
      {/* !me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} /> */}

      <Stack alignItems="flex-end">
        {/* renderInfo */}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}

          {/* renderActions */}
        </Stack>
      </Stack>
    </Stack>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  onOpenLightbox: PropTypes.func,
  participants: PropTypes.array,
  pet: PropTypes.array,
  setPet: PropTypes.func,
  onAiLoadingChange: PropTypes.func,
};
