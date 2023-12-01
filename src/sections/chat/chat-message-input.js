import PropTypes from 'prop-types';
import { sub } from 'date-fns';
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { set } from 'lodash';
import { sendToOpenAI, sendMockMessage } from '../../api/openai'; // Your OpenAI API integration

const MAX_LINES = 4; // Define your maximum number of lines here

// Define the sendOpenaiMessage function within your component
async function sendLocalMessage(
  openaiMessage,
  selectedConversationId,
  setPet,
  user,
  conversationData,
  myContact,
  setConversationData,
  setAiIsLoading,
  clearOpenaiMessage
) {
  try {
    if (openaiMessage) {
      // Set isLoading to true before making the request
      setAiIsLoading(true);
      console.log(setPet);

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
      // setConversationData((prevConversationData) => ({
      //   ...prevConversationData,
      //   messages: [...prevConversationData.messages, userMessage],
      // }));

      // // Wrap the message object in an array with the n property
      const messageArray = [
        {
          role: 'user',
          content: openaiMessage,
        },
      ];

      sendMockMessage(selectedConversationId, messageArray, user);
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Set isLoading to false when you're done
    setAiIsLoading(false);
  }
}

// Define the sendOpenaiMessage function within your component
async function sendOpenaiMessage(
  openaiMessage,
  selectedConversationId,
  setPet,
  user,
  conversationData,
  myContact,
  setConversationData,
  setAiIsLoading,
  clearOpenaiMessage
) {
  try {
    if (openaiMessage) {
      // Set isLoading to true before making the request
      setAiIsLoading(true);
      console.log(setPet);

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
      // setConversationData((prevConversationData) => ({
      //   ...prevConversationData,
      //   messages: [...prevConversationData.messages, userMessage],
      // }));

      // Wrap the message object in an array with the n property
      const messageArray = [
        {
          role: 'user',
          content: openaiMessage,
        },
      ];

      // Send the user's message to the OpenAI API
      const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

      console.log('------> openaiResponse:', openaiResponse);

      // Handle the OpenAI response
      if (openaiResponse) {
        const petData = {};

        if (openaiResponse?.data?.props?.name) {
          petData.name = openaiResponse?.data?.props?.name;
        }

        if (openaiResponse?.data?.props?.age?.life_stage) {
          petData.lifeStage = openaiResponse?.data?.props?.age?.life_stage;
        }

        if (openaiResponse?.data?.props?.breed) {
          petData.breed = openaiResponse?.data?.props?.breed;
        }

        if (openaiResponse?.data?.props?.avatar) {
          petData.avatar = openaiResponse?.data?.props?.avatar;
        }

        if (Object.keys(petData).length > 0) {
          // Only set petData if it has properties
          setPet(petData);
        }

        // Access participants from conversationData
        const participants = conversationData.participants;

        console.log('------> participants:', participants);
        console.log('------> myContact:', myContact);

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
        clearOpenaiMessage();

        console.log('User Message:', userMessage);
        console.log('OpenAI Response Message:', openaiResponseMessage);
        console.log('Updated Conversation Data:', conversationData);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Set isLoading to false when you're done
    setAiIsLoading(false);
  }
}

export default function ChatMessageInput({
  recipients,
  onAddRecipients,
  //
  disabled,
  selectedConversationId,
  // isAiLoading, // Add the loading prop to the propTypes
  inputMessage, // Receive the prop
  onTyping,
  onInputTyping, // Add this prop
  setPet,
}) {
  const router = useRouter();

  const location = useLocation();

  // Use the URLSearchParams API to extract the petPassport value from the URL
  const petPassport = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('petPassport') || ''; // Provide a default value if not found
  }, [location.search]);

  const { user, fetchai } = useMockedUser();

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  // This state determines whether to show or hide the buttons
  const [showButtons, setShowButtons] = useState(true);

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

  const fetchContact = useMemo(
    () => ({
      id: fetchai.id,
      role: fetchai.role,
      email: fetchai.email,
      address: fetchai.address,
      name: fetchai.displayName,
      lastActivity: new Date(),
      avatarUrl: fetchai.photoURL,
      phoneNumber: fetchai.phoneNumber,
      petPassport,
      status: 'online',
    }),
    [fetchai, petPassport]
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

  // const handleChangeMessage = useCallback((event) => {
  //   setMessage(event.target.value);
  // }, []);

  // const handleSendMessage = useCallback(
  //   async (event) => {
  //     try {
  //       if (event.key === 'Enter') {
  //         if (message) {
  //           if (selectedConversationId) {
  //             await sendMessage(selectedConversationId, messageData);
  //           } else {
  //             const res = await createConversation(conversationData);

  //             router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);

  //             onAddRecipients([]);
  //           }
  //         }
  //         setMessage('');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [conversationData, message, messageData, onAddRecipients, router, selectedConversationId]
  // );

  // New state to store user's input for OpenAI
  const [openaiMessage, setOpenaiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const handleSendMessage = useCallback(async () => {
  //   if (openaiMessage && !isLoading) {
  //     setIsLoading(true);

  //     // Construct the user's message object
  //     const userMessage = {
  //       role: 'user',
  //       content: openaiMessage,
  //     };

  //     // Simulate user sending a message to OpenAI
  //     try {
  //       const response = await sendToOpenAI('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2', [userMessage], {
  //         id: '8864c717-587d-472a-929a-8e5f298024da-0',
  //       });

  //       // Handle the OpenAI response here
  //       console.log('OpenAI Response:', response);
  //     } catch (error) {
  //       // Handle errors here
  //       console.error('Error sending request to OpenAI:', error);
  //     } finally {
  //       setIsLoading(false);
  //       setOpenaiMessage(''); // Clear the input field after sending the message
  //     }
  //   }
  // }, [openaiMessage, isLoading]);

  // const simulateEnterKeyPress = useCallback(() => {
  //   handleSendMessage(); // Simulate sending the message
  // }, [handleSendMessage]);

  // useEffect(() => {
  //   // Simulate pressing the "Enter" key after a 5-second timer
  //   const timer = setTimeout(simulateEnterKeyPress, 5000);

  //   return () => {
  //     clearTimeout(timer); // Clear the timer if the component unmounts before the timer expires
  //   };
  // }, [simulateEnterKeyPress]);

  const handleOpenaiMessageChange = useCallback(
    (event) => {
      const { value } = event.target;
      setOpenaiMessage(value);

      // Clear the inputMessage state in the parent component whenever the user types
      if (onInputTyping) {
        onInputTyping(value);
      }
    },
    [onInputTyping]
  );

  useEffect(() => {
    console.log('Updated Conversation Data:', conversationData);
  }, [conversationData]);

  // Effect hook to update local message state when the prop changes
  useEffect(() => {
    if (inputMessage) {
      setMessage(inputMessage);
    }
  }, [inputMessage]);

  const [isAiLoading, setAiIsLoading] = useState(false);
  // Define sentHelloMessage and setSentHelloMessage
  const [sentHelloMessage, setSentHelloMessage] = useState(false);

  // Add this useEffect to send a predefined message to OpenAI once
  useEffect(() => {
    let timer; // Declare the timer variable

    if (!sentHelloMessage) {
      const predefinedLocalMessage = 'Hey there html login button'; // Your predefined message
      const predefinedMessage = 'Hi, Im FetchAi. Let me turn on your super pawers.'; // Your predefined message

      timer = setTimeout(async () => {
        if (predefinedMessage) {
          setSentHelloMessage(true); // Mark the message as sent

          // await sendLocalMessage(
          //   predefinedLocalMessage,
          //   selectedConversationId,
          //   setPet,
          //   user,
          //   conversationData,
          //   myContact,
          //   setConversationData,
          //   setAiIsLoading,
          //   // clearOpenaiMessage,
          //   () => setOpenaiMessage('') // Callback to clear openaiMessage
          // );

          await sendOpenaiMessage(
            predefinedMessage,
            selectedConversationId,
            setPet,
            fetchContact,
            conversationData,
            myContact,
            setConversationData,
            setAiIsLoading,
            // clearOpenaiMessage,
            () => setOpenaiMessage('') // Callback to clear openaiMessage
          );
        }
      }, 3000); // 3 seconds delay
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    sentHelloMessage,
    selectedConversationId,
    fetchContact,
    conversationData,
    myContact,
    setConversationData,
    setAiIsLoading,
    // clearOpenaiMessage,
    setPet,
  ]);

  // const handleSendOpenaiMessage = useCallback(
  //   async (event) => {
  //     try {
  //       // Set isLoading to true before making the request
  //       setAiIsLoading(true);

  //       if (event.key === 'Enter') {
  //         if (openaiMessage) {
  //           // Construct the user's message object
  //           const userMessage = {
  //             id: uuidv4(),
  //             attachments: [],
  //             body: openaiMessage,
  //             contentType: 'text',
  //             createdAt: new Date(),
  //             senderId: myContact.id,
  //           };

  //           // Update the conversation data to include the user's message
  //           setConversationData((prevConversationData) => ({
  //             ...prevConversationData,
  //             messages: [...prevConversationData.messages, userMessage],
  //           }));

  //           // Wrap the message object in an array with the n property
  //           const messageArray = [
  //             {
  //               role: 'user',
  //               content: openaiMessage,
  //             },
  //           ];

  //           // Send the user's message to the OpenAI API
  //           const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

  //           // Handle the OpenAI response
  //           if (openaiResponse) {
  //             // Access participants from conversationData
  //             const participants = conversationData.participants;
  //             // Determine the ID of the other participant
  //             // const otherParticipantId = participants.find((participant) => participant.id !== myContact.id).id;

  //             console.log('participants:id', participants[0].id);
  //             console.log('participants:name', participants[0].name);

  //             // Generate a new unique ID for the response message
  //             const openaiResponseMessage = {
  //               id: uuidv4(),
  //               body: openaiResponse.data.content,
  //               contentType: 'text',
  //               createdAt: new Date(),
  //               senderId: participants[0].id, // TODO: ref fetchai id
  //             };

  //             // Update the conversation data again to include the OpenAI response
  //             setConversationData((prevConversationData) => ({
  //               ...prevConversationData,
  //               messages: [...prevConversationData.messages, openaiResponseMessage],
  //             }));

  //             // Clear the input field
  //             setOpenaiMessage('');

  //             console.log('User Message:', userMessage);
  //             console.log('OpenAI Response Message:', openaiResponseMessage);
  //             console.log('Updated Conversation Data:', conversationData);

  //             // Set isLoading to false when you're done
  //             setAiIsLoading(false);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       // Set isLoading to false when you're done
  //       setAiIsLoading(false);
  //     }
  //   },
  //   [
  //     openaiMessage,
  //     setConversationData,
  //     user,
  //     conversationData,
  //     myContact.id,
  //     selectedConversationId,
  //   ]
  // );

  const handleSendOpenaiMessage = useCallback(
    async (event) => {
      try {
        // Set isLoading to true before making the request
        setAiIsLoading(true);
        console.log('setPEEEEt: ', setPet);
        // setPet({ name: 'Charlie', lifeStage: 'Adult', breed: 'Shih Tzu' });

        if (event.key === 'Enter') {
          if (openaiMessage) {
            // Call the sendOpenaiMessage function here
            await sendOpenaiMessage(
              openaiMessage,
              selectedConversationId,
              setPet,
              user,
              conversationData,
              myContact,
              setConversationData,
              setAiIsLoading,
              // clearOpenaiMessage,
              () => setOpenaiMessage('') // Callback to clear openaiMessage
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Set isLoading to false when you're done
        setAiIsLoading(false);
      }
    },
    [
      openaiMessage,
      selectedConversationId,
      user,
      conversationData,
      myContact,
      setConversationData,
      setAiIsLoading,
      // clearOpenaiMessage,
      setPet,
    ]
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
        value={openaiMessage || inputMessage} // fallback to inputMessage if openaiMessage is falsy
        // onTyping={handleInputTyping}
        onKeyUp={handleSendOpenaiMessage}
        onChange={handleOpenaiMessageChange} // This will call onInputTyping in the parent
        placeholder="Ask me pet things..."
        disabled={disabled}
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
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
  // isAiLoading: PropTypes.bool,
  inputMessage: PropTypes.string,
  onTyping: PropTypes.func, // This should be func, not bool
  onInputTyping: PropTypes.func, // Add this line
  setPet: PropTypes.func,
};
