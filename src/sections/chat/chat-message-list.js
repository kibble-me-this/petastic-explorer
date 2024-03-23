import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, and useRef

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
  const { messagesEndRef, scrollMessagesToBottom } = useMessagesScroll(messages);

  useEffect(() => {
    // Scroll to the bottom whenever the messages array changes
    scrollMessagesToBottom();
  }, [messages, scrollMessagesToBottom]);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  const loadingTitleText = ["CONFIDENTIAL :: INVESTOR DEMO"];
  const loadingMessages = ["I'm Fetch. Your pet care concierge ❣️"];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingTitleIndex, setLoadingTitleIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1000);

    const titleInterval = setInterval(() => {
      setLoadingTitleIndex((prevIndex) => (prevIndex + 1) % loadingTitleText.length);
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(titleInterval);
    };
  }, [loadingMessages.length, loadingTitleText.length]);

  const loadingMessage = loadingMessages[loadingMessageIndex];
  const loadingTitle = loadingTitleText[loadingTitleIndex];


  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 2, py: 2, height: 1 }}>
        {messages.length === 0 ? (
          <EmptyContentLogo title={loadingMessage} description={loadingTitle} />
        ) : (
          messages.map((message, index) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
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
