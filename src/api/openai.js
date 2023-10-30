import useSWR, { mutate } from 'swr';
import uuidv4 from '../utils/uuidv4';

import axios, { endpoints, fetcher } from '../utils/axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const API_URL = 'http://localhost:3080/api/ai/petastic/chat';
const API_URL = process.env.REACT_APP_API_URL;

export async function sendToOpenAI(conversationId, message, user) {
  try {
    console.log('Message content:', message[0].content);

    // Update the conversation with the user's message
    const userMessage = {
      id: uuidv4(),
      body: message[0].content,
      contentType: 'text',
      createdAt: new Date(),
      senderId: user.id,
    };

    console.log('userMessage', userMessage);

    // First mutate call to update the conversation with the user's message
    mutate(
      [endpoints.chat, { params: { conversationId, endpoint: 'conversation' } }],
      (currentData) => {
        const { conversation: currentConversation } = currentData;
        const conversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage],
        };
        console.log('convrsation', conversation);
        return {
          conversation,
        };
      },
      false
    );

    // Send a request to the OpenAI API
    const response = await axios.post(API_URL, message, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the response contains a message
    if (response.data.content) {
      console.log(response.data.content);

      // Update the conversation messages for the specified conversationId
      const openaiResponseMessage = {
        id: uuidv4(),
        body: response.data.content,
        contentType: 'text',
        createdAt: new Date(),
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2', // Lucian Obrien
      };

      // Second mutate call to update the conversation with the OpenAI response message
      mutate(
        [endpoints.chat, { params: { conversationId, endpoint: 'conversation' } }],
        (currentData) => {
          const { conversation: currentConversation } = currentData;
          const conversation = {
            ...currentConversation,
            messages: [...currentConversation.messages, openaiResponseMessage],
          };
          return {
            conversation,
          };
        },
        false
      );

      return response;
    }

    // Return a default value (e.g., null) if no message content is found
    return null;
  } catch (error) {
    console.error('Error sending request to OpenAI:', error);
    throw error;
  }
}
