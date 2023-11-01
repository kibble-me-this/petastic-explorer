import { useCallback, useEffect, useRef, useState } from 'react';

export default function useMessagesScroll(messages) {
  const messagesEndRef = useRef(null);
  const [websiteScrollTop, setWebsiteScrollTop] = useState(0);
  const scrollSpeedFactor = 0.5; // Adjust the scroll speed factor as needed

  const scrollMessagesToStart = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = 0; // Scroll to the top
    }
  }, []);

  useEffect(() => {
    // Delay the scroll to start by 1 second
    const delay = setTimeout(() => {
      scrollMessagesToStart(); // Scroll to the start after 1 second
    }, 1000);

    return () => {
      clearTimeout(delay);
    };
  }, [scrollMessagesToStart]);

  const handleWebsiteScroll = useCallback(() => {
    setWebsiteScrollTop(window.pageYOffset);
  }, []);

  useEffect(() => {
    handleWebsiteScroll(); // Set the initial scroll position
  }, [handleWebsiteScroll]);

  // Synchronize chat message list's scroll position with website's scroll position
  useEffect(() => {
    if (messagesEndRef.current) {
      // Adjust the scroll speed using scrollSpeedFactor
      messagesEndRef.current.scrollTop = websiteScrollTop * scrollSpeedFactor;
    }
  }, [websiteScrollTop]);

  useEffect(() => {
    const handleScroll = () => {
      handleWebsiteScroll(); // Update the website scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleWebsiteScroll]);

  const scrollMessagesToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   scrollMessagesToBottom();
  // }, [messages]);

  return {
    messagesEndRef,
  };
}
