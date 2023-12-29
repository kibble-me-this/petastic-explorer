import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { EmptyContentLogo } from 'src/components/empty-content';

//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';


// ----------------------------------------------------------------------

export default function ChatMessageList({
  messages = [],
  participants,
  pet,
  setPet,
  onAiLoadingChange,
}) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  const loadingMessages = [
    "Fetching X Blockchain X Pet Care ML X AI",

    // Add more loading messages as needed
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the loading message index in a rotating manner
      setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loadingMessages.length]);

  const loadingMessage = loadingMessages[loadingMessageIndex];

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        {messages.length === 0 ? (
          <EmptyContentLogo title={loadingMessage} />
        ) : (
          // Render messages only if the messages array is not empty
          messages.map((message, index) => (
            // Delay rendering of each message item using setTimeout
            <DelayedMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
              delay={index * 1}
              pet={pet}
              setPet={setPet}
              onAiLoadingChange={onAiLoadingChange}
            />
          ))
        )}
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
  pet: PropTypes.array,
  setPet: PropTypes.func,
  onAiLoadingChange: PropTypes.array,
};

// DelayedMessageItem component to render message items with a delay
function DelayedMessageItem({
  message,
  participants,
  onOpenLightbox,
  delay,
  pet,
  setPet,
  onAiLoadingChange,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return isVisible ? (
    <ChatMessageItem
      key={message.id}
      message={message}
      participants={participants}
      onOpenLightbox={onOpenLightbox}
      pet={pet}
      setPet={setPet}
      onAiLoadingChange={onAiLoadingChange}
    />
  ) : null;
}

DelayedMessageItem.propTypes = {
  message: PropTypes.object,
  participants: PropTypes.array,
  onOpenLightbox: PropTypes.func,
  delay: PropTypes.number,
  pet: PropTypes.array,
  setPet: PropTypes.number,
  onAiLoadingChange: PropTypes.func,
};

// Function to get a random loading message
// function getRandomLoadingMessage() {
//   const loadingMessages = [
//     "Fetching the future of pet care...",
//     "Loading your messages...",
//     "Please wait...",
//     // Add more loading messages as needed
//   ];

//   const randomIndex = Math.floor(Math.random() * loadingMessages.length);
//   return loadingMessages[randomIndex];
// }