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
import { sendOpenaiMessage, sendLocalMessage } from './messageUtils'; // Adjust the import path

const MAX_LINES = 4; // Define your maximum number of lines here

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  recipients,
  onAddRecipients,
  //
  disabled,
  selectedConversationId,
  inputMessage, // Receive the prop
  onTyping,
  onInputTyping, // Add this prop
  pet,
  setPet,
  isAiLoading,
  onAiLoadingChange,
}) {
  const router = useRouter();

  const location = useLocation();

  // Use the URLSearchParams API to extract the petPassport value from the URL
  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    const params = Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    return params;
  }, [location.search]);

  const petPassport = queryParams.petPassport;
  const petName = queryParams.pet_name;
  const shelterName = queryParams.shelter_name;

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

  // const [isAiLoading, onAiLoadingChange] = useState(false);
  // Define sentHelloMessage and setSentHelloMessage
  const [sentHelloMessage, setSentHelloMessage] = useState(false);

  // Add this useEffect to send a predefined message to OpenAI once
  useEffect(() => {
    let timer; // Declare the timer variable

    console.log('pet in useEffect', pet);

    if (!sentHelloMessage) {
      const predefinedLocalMessage = `<b>Paws Before Profits</b> html login button`;

      const predefinedMessage1 = `<p><b>Hi, I'm Fetch, your pet concierge. </b></p> 
      <p>All pets are unique, and I've cracked the code on personalized pet care. 🤖</p> 
      <p>I see you have a new addition to the family, congratulations!</p> 
      <p>Click below to get your journey started.🤍 </p> html accept pet button
      `;

      const predefinedMessage2 = `<b>👋 Hi there!</b> I just received a notification from <b>${shelterName}</b> that you've added a new member to your family. 
      I'm here and ready to assist you with personalized pet care for <b>${petName}</b> and to help fund other pets in need through Petastic's shared giving community of shelters and rescues. 🤍
      <p><b>Click below to get started.</b></p> html accept pet button
    `;

      timer = setTimeout(async () => {
        if (predefinedMessage2) {
          setSentHelloMessage(true);

          await sendLocalMessage(
            predefinedMessage2,
            selectedConversationId,
            setPet,
            pet,
            fetchContact,
            conversationData,
            myContact,
            setConversationData,
            onAiLoadingChange,
            // clearOpenaiMessage,
            () => setOpenaiMessage('') // Callback to clear openaiMessage
          );

          // await sendLocalMessage(
          //   predefinedLocalMessage,
          //   selectedConversationId,
          //   setPet,
          //   pet,
          //   fetchContact,
          //   conversationData,
          //   myContact,
          //   setConversationData,
          //   onAiLoadingChange,
          //   // clearOpenaiMessage,
          //   () => setOpenaiMessage('') // Callback to clear openaiMessage
          // );
        }
      }, 5000); // 3 seconds delay
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
    onAiLoadingChange,
    // clearOpenaiMessage,
    setPet,
    pet,
    petName,
    shelterName,
  ]);

  // const handleSendOpenaiMessage = useCallback(
  //   async (event) => {
  //     try {
  //       // Set isLoading to true before making the request
  //       onAiLoadingChange(true);

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
  //             onAiLoadingChange(false);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       // Set isLoading to false when you're done
  //       onAiLoadingChange(false);
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
        onAiLoadingChange(true);

        if (event.key === 'Enter') {
          // Prevent the "Enter" key from creating a new line
          event.preventDefault();

          if (openaiMessage) {
            // Call the sendOpenaiMessage function here
            await sendOpenaiMessage(
              openaiMessage,
              selectedConversationId,
              setPet,
              pet,
              user,
              conversationData,
              myContact,
              setConversationData,
              onAiLoadingChange,
              // clearOpenaiMessage,
              () => setOpenaiMessage('') // Callback to clear openaiMessage
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Set isLoading to false when you're done
        onAiLoadingChange(false);
      }
    },
    [
      openaiMessage,
      selectedConversationId,
      user,
      conversationData,
      myContact,
      setConversationData,
      onAiLoadingChange,
      // clearOpenaiMessage,
      setPet,
      pet,
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
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleSendOpenaiMessage(event);
          }
        }}
        // onTyping={handleInputTyping}
        // onKeyUp={handleSendOpenaiMessage}
        onChange={handleOpenaiMessageChange}
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
  inputMessage: PropTypes.string,
  onTyping: PropTypes.func,
  onInputTyping: PropTypes.func,
  pet: PropTypes.array,
  setPet: PropTypes.func,
  isAiLoading: PropTypes.bool,
  onAiLoadingChange: PropTypes.func,
};

// Define the sendOpenaiMessage function within your component
// async function sendLocalMessage(
//   openaiMessage,
//   selectedConversationId,
//   setPet,
//   pet,
//   user,
//   conversationData,
//   myContact,
//   setConversationData,
//   onAiLoadingChange,
//   clearOpenaiMessage
// ) {
//   try {
//     if (openaiMessage) {
//       // Set isLoading to true before making the request
//       onAiLoadingChange(true);
//       console.log(setPet);

//       // Construct the user's message object
//       const userMessage = {
//         id: uuidv4(),
//         attachments: [],
//         body: openaiMessage,
//         contentType: 'text',
//         createdAt: new Date(),
//         senderId: myContact.id,
//       };

//       // Update the conversation data to include the user's message
//       // setConversationData((prevConversationData) => ({
//       //   ...prevConversationData,
//       //   messages: [...prevConversationData.messages, userMessage],
//       // }));

//       // // Wrap the message object in an array with the n property
//       const messageArray = [
//         {
//           role: 'user',
//           content: openaiMessage,
//         },
//       ];

//       sendMockMessage(selectedConversationId, messageArray, user);
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     // Set isLoading to false when you're done
//     onAiLoadingChange(false);
//   }
// }

// Define the sendOpenaiMessage function within your component
// async function sendOpenaiMessage(
//   openaiMessage,
//   selectedConversationId,
//   setPet,
//   pet,
//   user,
//   conversationData,
//   myContact,
//   setConversationData,
//   onAiLoadingChange,
//   clearOpenaiMessage
// ) {
//   try {
//     if (openaiMessage) {
//       // Set isLoading to true before making the request
//       onAiLoadingChange(true);
//       console.log(setPet);

//       // Construct the user's message object
//       const userMessage = {
//         id: uuidv4(),
//         attachments: [],
//         body: openaiMessage,
//         contentType: 'text',
//         createdAt: new Date(),
//         senderId: myContact.id,
//       };

//       // Update the conversation data to include the user's message
//       // setConversationData((prevConversationData) => ({
//       //   ...prevConversationData,
//       //   messages: [...prevConversationData.messages, userMessage],
//       // }));

//       // Wrap the message object in an array with the n property
//       const messageArray = [
//         {
//           role: 'user',
//           content: openaiMessage,
//         },
//       ];

//       // Clear the input field
//       clearOpenaiMessage();

//       // Send the user's message to the OpenAI API
//       const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

//       console.log('------> openaiResponse:', openaiResponse);

//       // Handle the OpenAI response
//       if (openaiResponse) {
//         const petData = {};

//         if (openaiResponse?.data?.props?.name) {
//           pet.name = openaiResponse?.data?.props?.name;
//         }

//         if (openaiResponse?.data?.props?.age?.life_stage) {
//           pet.lifeStage = openaiResponse?.data?.props?.age?.life_stage;
//         }

//         if (openaiResponse?.data?.props?.breed) {
//           pet.breed = openaiResponse?.data?.props?.breed;
//         }

//         if (openaiResponse?.data?.props?.avatar) {
//           pet.avatar = openaiResponse?.data?.props?.avatar;
//         }

//         if (Object.keys(pet).length > 0) {
//           // Only set petData if it has properties
//           setPet(pet);
//         }

//         // Access participants from conversationData
//         const participants = conversationData.participants;

//         console.log('------> participants:', participants);
//         console.log('------> myContact:', myContact);

//         // Generate a new unique ID for the response message
//         const openaiResponseMessage = {
//           id: uuidv4(),
//           body: openaiResponse.data.content,
//           contentType: 'text',
//           createdAt: new Date(),
//           senderId: participants[0].id, // TODO: ref fetchai id
//         };

//         // Update the conversation data again to include the OpenAI response
//         setConversationData((prevConversationData) => ({
//           ...prevConversationData,
//           messages: [...prevConversationData.messages, openaiResponseMessage],
//         }));

//         console.log('User Message:', userMessage);
//         console.log('OpenAI Response Message:', openaiResponseMessage);
//         console.log('Updated Conversation Data:', conversationData);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     // Set isLoading to false when you're done
//     onAiLoadingChange(false);
//   }
// }
