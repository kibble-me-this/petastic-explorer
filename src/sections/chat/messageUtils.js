import uuidv4 from 'src/utils/uuidv4';
import { sendToOpenAI, sendMockMessage } from '../../api/openai'; // Your OpenAI API integration

export async function sendLocalMessage(
  openaiMessage,
  selectedConversationId,
  setPet,
  pet,
  user,
  conversationData,
  myContact,
  setConversationData,
  onAiLoadingChange,
  clearOpenaiMessage
) {
  try {
    if (openaiMessage) {
      // Set isLoading to true before making the request
      onAiLoadingChange(true);
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
    onAiLoadingChange(false);
  }
}

export async function sendOpenaiMessage(
  openaiMessage,
  selectedConversationId,
  setPet,
  pet,
  user,
  conversationData,
  myContact,
  setConversationData,
  onAiLoadingChange,
  clearOpenaiMessage
) {
  try {
    if (openaiMessage) {
      // Set isLoading to true before making the request
      onAiLoadingChange(true);
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

      // Clear the input field
      clearOpenaiMessage();

      // Send the user's message to the OpenAI API
      const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

      console.log('------> openaiResponse:', openaiResponse);

      // Handle the OpenAI response
      if (openaiResponse) {
        const petData = {};

        if (openaiResponse?.data?.props?.name) {
          pet.name = openaiResponse?.data?.props?.name;
        }

        if (openaiResponse?.data?.props?.age?.life_stage) {
          pet.lifeStage = openaiResponse?.data?.props?.age?.life_stage;
        }

        if (openaiResponse?.data?.props?.breed) {
          pet.breed = openaiResponse?.data?.props?.breed;
        }

        if (openaiResponse?.data?.props?.avatar) {
          pet.avatar = openaiResponse?.data?.props?.avatar;
        }

        if (Object.keys(pet).length > 0) {
          // Only set petData if it has properties
          setPet(pet);
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

        console.log('User Message:', userMessage);
        console.log('OpenAI Response Message:', openaiResponseMessage);
        console.log('Updated Conversation Data:', conversationData);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Set isLoading to false when you're done
    onAiLoadingChange(false);
  }
}
