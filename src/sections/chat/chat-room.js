import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { useEffect, useCallback } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
//
import { useCollapseNav } from './hooks';
import ChatRoomGroup from './chat-room-group';
import ChatRoomSingle from './chat-room-single';
import ChatRoomAttachments from './chat-room-attachments';

import { useCheckoutContext } from '../checkout/context';
import CartIcon from '../product/common/cart-icon';

// ----------------------------------------------------------------------

const NAV_WIDTH = 240;

export default function ChatRoom({ participants, user, conversation, pet }) {

  const checkout = useCheckoutContext();

  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  // Define your local conversations data
  const localConversations = [
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      participants: [
        {
          status: 'online',
          id: '8864c717-587d-472a-929a-8e5f298024da-0',
          role: 'admin',
          email: 'demo@minimals.cc',
          name: 'Jaydon Frankie',
          lastActivity: '2023-10-23T14:45:15.279Z',
          address: '90210 Broadway Blvd',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg',
          phoneNumber: '+40 777666555',
        },
        {
          status: 'online',
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
          role: 'UX/UI Designer',
          email: 'violet.ratke86@yahoo.com',
          name: 'Harrison Stein',
          lastActivity: '2023-10-20T11:45:15.279Z',
          address: '110 Lamar Station Apt. 730 - Hagerstown, OK / 49808',
          avatarUrl: `${process.env.PUBLIC_URL}/assets/images/avatars/frenchie.jpg`,
          phoneNumber: '692-767-2903',
        },
      ],
      type: 'ONE_TO_ONE',
      unreadCount: 0,
      messages: [
        {
          id: '9574ce4a-27ab-4eec-9dd2-ea369f418722',
          body: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
          contentType: 'text',
          attachments: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'vaccination-cards.pdf',
              path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              size: 48000000,
              createdAt: '2024-02-23T14:38:44.497Z',
              modifiedAt: '2024-02-23T14:38:44.497Z',
              type: 'pdf',
            },
          ],
          createdAt: '2023-10-23T06:45:15.280Z',
          senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        },
        {
          id: '356342c6-49be-4d7f-be93-78e89f1f5d97',
          body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
          contentType: 'text',
          attachments: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
              name: 'adoption-contract.pdf',
              path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              size: 12000000,
              createdAt: '2024-02-23T11:38:44.497Z',
              modifiedAt: '2024-02-23T11:38:44.497Z',
              type: 'pdf',
            },
          ],
          createdAt: '2024-02-23T12:30:15.280Z',
          senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
        },
        {
          id: '356342c6-49be-4d7f-be93-78e89f1f5d97',
          body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
          contentType: 'text',
          attachments: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
              name: 'behavioral-notes.pdf',
              path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              size: 12000000,
              createdAt: '2024-02-23T11:38:44.497Z',
              modifiedAt: '2024-02-23T11:38:44.497Z',
              type: 'pdf',
            },
          ],
          createdAt: '2023-10-23T12:30:15.280Z',
          senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
        },
        {
          id: '356342c6-49be-4d7f-be93-78e89f1f5d97',
          body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
          contentType: 'text',
          attachments: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
              name: 'Feeding Profile',
              path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
              size: 12000000,
              createdAt: '2024-02-23T11:38:44.497Z',
              modifiedAt: '2024-02-23T11:38:44.497Z',
              type: 'pdf',
            },
          ],
          createdAt: '2023-10-23T12:30:15.280Z',
          senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
        },
      ],
    },
  ];

  const {
    collapseDesktop,
    onCloseDesktop,
    onCollapseDesktop,
    //
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();

  useEffect(() => {
    if (!lgUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, lgUp]);

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const group = participants.length > 1;

  const attachments = uniq(
    flatten(localConversations[0].messages.map((messages) => messages.attachments))
  );

  console.log('attachments: ', attachments);

  const renderContent = (
    <>
      {group ? (
        <ChatRoomGroup participants={participants} />
      ) : (
        <ChatRoomSingle user={user} participant={participants[0]} pet={pet} />
      )}

      <ChatRoomAttachments attachments={attachments} pet={pet} />
    </>
  );

  const renderToggleBtn = (
    <IconButton
      onClick={handleToggleNav}
      sx={{
        top: 10,
        right: 0,
        zIndex: 9,
        width: 32,
        height: 32,
        borderRight: 0,
        position: 'absolute',
        borderRadius: `12px 0 0 12px`,
        boxShadow: theme.customShadows.z8,
        bgcolor: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        '&:hover': {
          bgcolor: theme.palette.background.neutral,
        },
        ...(lgUp && {
          ...(!collapseDesktop && {
            right: NAV_WIDTH,
          }),
        }),
      }}
    >
      {lgUp ? (
        <Iconify
          width={16}
          icon={collapseDesktop ? 'eva:folder-add-fill' : 'eva:folder-add-fill'}
        />
      ) : (
        <Iconify width={16} icon="eva:folder-add-fill" />
      )}
    </IconButton>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {renderToggleBtn}
      <CartIcon totalItems={checkout.totalItems} />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: collapseDesktop ? 0 : NAV_WIDTH, // This line controls the width directly
            borderLeft: `solid 1px ${theme.palette.divider}`,
            // transition: theme.transitions.create(['width'], {
            //   duration: theme.transitions.duration.shorter,
            // }),
            // ...(collapseDesktop && {
            //   width: 0,
            // }),
          }}
        >
          {!collapseDesktop && renderContent}
        </Stack>
      ) : (
        <Drawer
          anchor="right"
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

ChatRoom.propTypes = {
  conversation: PropTypes.object,
  user: PropTypes.array,
  participants: PropTypes.array,
  pet: PropTypes.array,
};
