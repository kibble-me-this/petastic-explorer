import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import { sendToOpenAI } from '../../api/openai'; // Your OpenAI API integration

export default function FetchButton({ value }) {
  const { title } = value;
  const [buttonClicked, setButtonClicked] = useState(false);
  const { user, fetchai } = useMockedUser();

  const handleButtonClick = async () => {
    if (!buttonClicked) {
      // Prevent multiple clicks
      setButtonClicked(true);

      try {
        const openaiMessage = '0e189b7ec5ba5eafbe52975f9f14bf40'; // Your predefined message
        const selectedConversationId = 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4';

        // Wrap the message object in an array with the n property
        const messageArray = [
          {
            role: 'user',
            content: openaiMessage,
          },
        ];

        // Make the API request to OpenAI here using sendToOpenAI
        const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, user);

        // Handle the response as needed
        // console.log('OpenAI Response:', openaiResponse);

        // Optionally, you can trigger other actions or update state based on the response

        // Reset the buttonClicked state to false once the API request is complete
        setButtonClicked(false);
      } catch (error) {
        // Handle any errors from the API request
        console.error('OpenAI API Error:', error);

        // Reset the buttonClicked state to false if an error occurs
        setButtonClicked(false);
      }
    }
  };

  return (
    <>
      <Typography>{title}</Typography>
      <Button
        size="small"
        color="inherit"
        variant="outlined"
        sx={{
          borderColor: '#FFF', // Change to your desired color
          mx: 2,
          mb: 2,
        }}
        onClick={handleButtonClick}
        disabled={buttonClicked}
      >
        {buttonClicked ? 'Processing...' : 'Authenticated'}
      </Button>
    </>
  );
}

FetchButton.propTypes = {
  value: PropTypes.string,
};
