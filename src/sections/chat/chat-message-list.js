import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

// @mui
import Box from '@mui/material/Box';
// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';

// ----------------------------------------------------------------------

export default function ChatMessageList({ messages = [], participants }) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages.map((message, index) => (
            // Delay rendering of each message item using setTimeout
            <DelayedMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
              delay={index * 1} // Adjust the delay duration (in milliseconds) as needed
            />
          ))}
        </Box>
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
};

// DelayedMessageItem component to render message items with a delay
function DelayedMessageItem({ message, participants, onOpenLightbox, delay }) {
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
    />
  ) : null;
}

DelayedMessageItem.propTypes = {
  message: PropTypes.object,
  participants: PropTypes.array,
  onOpenLightbox: PropTypes.func,
  delay: PropTypes.number, // Delay duration in milliseconds
};
