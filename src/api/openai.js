import useSWR, { mutate } from 'swr';
import uuidv4 from '../utils/uuidv4';

import axios, { endpoints, fetcher } from '../utils/axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// const API_URL = 'http://localhost:3080/api/ai/petastic/chat';
const API_URL = process.env.REACT_APP_API_URL;

export async function sendToOpenAI(conversationId, message, user) {
  try {
    // Check if the message is of the first type (text message)
    if (message[0]?.role === 'user' && message[0]?.content) {
      console.log('Text Message content:', message[0].content);

      // Update the conversation with the user's text message
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

      // Send a request to the OpenAI API for text message
      const response = await axios.post(API_URL, message, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if the response contains a message
      if (response.data.content) {
        // Normal message with content attribute
        const openaiResponseMessage = {
          id: uuidv4(),
          body: response.data.content,
          contentType: 'text',
          createdAt: new Date(),
          senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2', // Lucian Obrien
        };

        // Update the conversation with the OpenAI response message
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
      } else if (response.data.message && response.data.message.content) {
        // Message with content nested within a "message" object
        const openaiResponseMessage = {
          id: uuidv4(),
          body: response.data.message.content,
          prop: response.data.products,
          contentType: 'text',
          createdAt: new Date(),
          senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2', // Lucian Obrien
        };

        // Update the conversation with the OpenAI response message
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
      }

      return response;
    }

    // Return null for unsupported message types
    return null;
  } catch (error) {
    console.error('Error sending request to OpenAI:', error);
    throw error;
  }
}
