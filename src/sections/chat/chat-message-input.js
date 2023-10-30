import PropTypes from 'prop-types';
import { sub } from 'date-fns';
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import uuidv4 from 'src/utils/uuidv4';
// components
import Iconify from 'src/components/iconify';
// api
import { sendMessage, createConversation } from 'src/api/chat';
import { sendToOpenAI } from '../../api/openai'; // Your OpenAI API integration

const MAX_LINES = 4; // Define your maximum number of lines here

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  recipients,
  onAddRecipients,
  //
  disabled,
  selectedConversationId,
}) {
  const router = useRouter();

  const { user } = useMockedUser();

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const renderLoading = (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );

  const myContact = useMemo(
    () => ({
      id: user.id,
      role: user.role,
      email: user.email,
      address: user.address,
      name: user.displayName,
      lastActivity: new Date(),
      avatarUrl: user.photoURL,
      phoneNumber: user.phoneNumber,
      status: 'online',
    }),
    [user]
  );

  const messageData = useMemo(
    () => ({
      id: uuidv4(),
      attachments: [],
      body: message,
      contentType: 'text',
      createdAt: sub(new Date(), { minutes: 1 }),
      senderId: myContact.id,
    }),
    [message, myContact.id]
  );

  // const conversationData = useMemo(
  //   () => ({
  //     id: uuidv4(),
  //     messages: [messageData],
  //     participants: [...recipients, myContact],
  //     type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
  //     unreadCount: 0,
  //   }),
  //   [messageData, myContact, recipients]
  // );

  const [conversationData, setConversationData] = useState({
    id: uuidv4(),
    messages: [messageData],
    participants: [...recipients, myContact],
    type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
    unreadCount: 0,
  });

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      try {
        if (event.key === 'Enter') {
          if (message) {
            if (selectedConversationId) {
              await sendMessage(selectedConversationId, messageData);
            } else {
              const res = await createConversation(conversationData);

              router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);

              onAddRecipients([]);
            }
          }
          setMessage('');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [conversationData, message, messageData, onAddRecipients, router, selectedConversationId]
  );

  // New state to store user's input for OpenAI
  const [openaiMessage, setOpenaiMessage] = useState('');

  // Function to handle user input for OpenAI
  const handleOpenaiMessageChange = useCallback((event) => {
    setOpenaiMessage(event.target.value);
  }, []);

  useEffect(() => {
    console.log('Updated Conversation Data:', conversationData);
  }, [conversationData]);

  const [isAiLoading, setAiIsLoading] = useState(false);

  const handleSendOpenaiMessage = useCallback(
    async (event) => {
      try {
        // Set isLoading to true before making the request
        setAiIsLoading(true);

        if (event.key === 'Enter') {
          if (openaiMessage) {
            // Construct the user's message object
            const userMessage = {
              id: uuidv4(),
              attachments: [],
              body: openaiMessage,
              contentType: 'text',
              createdAt: new Date(),
              senderId: myContact.id,
            };

            // Update the conversation data to include the user's message
            setConversationData((prevConversationData) => ({
              ...prevConversationData,
              messages: [...prevConversationData.messages, userMessage],
            }));

            // Wrap the message object in an array with the n property
            const messageArray = [
              {
                role: 'user',
                content: openaiMessage,
              },
            ];

            // Send the user's message to the OpenAI API
            const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

            // Handle the OpenAI response
            if (openaiResponse) {
              // Access participants from conversationData
              const participants = conversationData.participants;
              // Determine the ID of the other participant
              // const otherParticipantId = participants.find((participant) => participant.id !== myContact.id).id;

              console.log('participants:id', participants[0].id);
              console.log('participants:name', participants[0].name);

              // Generate a new unique ID for the response message
              const openaiResponseMessage = {
                id: uuidv4(),
                body: openaiResponse.data.content,
                contentType: 'text',
                createdAt: new Date(),
                senderId: participants[0].id, // TODO: ref fetchai id
              };

              // Update the conversation data again to include the OpenAI response
              setConversationData((prevConversationData) => ({
                ...prevConversationData,
                messages: [...prevConversationData.messages, openaiResponseMessage],
              }));

              // Clear the input field
              setOpenaiMessage('');

              console.log('User Message:', userMessage);
              console.log('OpenAI Response Message:', openaiResponseMessage);
              console.log('Updated Conversation Data:', conversationData);

              // Set isLoading to false when you're done
              setAiIsLoading(false);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Set isLoading to false when you're done
        setAiIsLoading(false);
      }
    },
    [openaiMessage, setConversationData, user]
  );

  return (
    <>
      {/** 
      <InputBase
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />
      */}

      {/* Show the loading spinner when isAiLoading is true */}
      {isAiLoading && renderLoading}

      {/* New input field for OpenAI */}
      <InputBase
        multiline // Set the multiline prop to true
        value={openaiMessage}
        onKeyUp={handleSendOpenaiMessage}
        onChange={handleOpenaiMessageChange}
        placeholder="Ask me anything..."
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          minHeight: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          maxHeight: `${MAX_LINES * 1.2}em`, // Adjust the line height as needed
          overflowY: 'auto', // Show scrollbar if content exceeds maxHeight
          whiteSpace: 'pre-wrap', // Allow text to wrap to the next line
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onAddRecipients: PropTypes.func,
  recipients: PropTypes.array,
  selectedConversationId: PropTypes.string,
  isAiLoading: PropTypes.bool,
};
