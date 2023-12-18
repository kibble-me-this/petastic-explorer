import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMockedUser } from 'src/hooks/use-mocked-user';

// auth
import { Magic } from 'magic-sdk';
import { NearExtension } from '@magic-ext/near';
import { OAuthExtension } from '@magic-ext/oauth';

import { sendToOpenAI, sendMockMessage } from '../../api/openai';
// import { sendOpenaiMessage, sendLocalMessage } from './messageUtils'; // Adjust the import path

import { handleCreateAccount, handlePetPassportTransfer } from '../../api/petastic-api';

export default function FetchAcceptPetButton({ value, pet, setPet, onAiLoadingChange }) {
  const { title } = value;
  const [buttonClicked, setButtonClicked] = useState(false);
  const { user, fetchai } = useMockedUser();
  const [conversationID, setConversationID] = useState('');
  const [petPassport, setPetPassport] = useState('');
  const [email, setEmail] = useState('');
  const [buttonText, setButtonText] = useState('Activate Super Pawers 🦸‍♂️🐾');

  useEffect(() => {
    // Extract parameters from the URL when the component mounts
    const params = new URLSearchParams(window.location.search);

    setConversationID(params.get('id'));
    setPetPassport(params.get('petPassport'));
    setEmail(params.get('email'));
  }, []);

  const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, {
    extensions: [new NearExtension({ rpcUrl: '' }), new OAuthExtension()],
  });

  const handleButtonClick = async () => {
    if (!buttonClicked) {
      // Prevent multiple clicks
      setButtonClicked(true);
      onAiLoadingChange(true);

      try {
        await magic.auth.loginWithMagicLink({ email });

        const magicIsLoggedIn = await magic.user.isLoggedIn();
        if (magicIsLoggedIn) {
          const magic_user = await magic.user.getMetadata();
          const publicAddress = magic_user.publicAddress;
          const magic_email = magic_user.email;

          console.log('magic_user: ', magic_user);

          const accountExists = await handleCreateAccount(magic_user);
          console.log('accountExists: ', accountExists);

          if (accountExists) {
            const account_id = accountExists.account_id;
            await handlePetPassportTransfer(account_id, petPassport);
          }

          const openaiMessage = `petPassport: ${petPassport}`;
          const selectedConversationId = conversationID;

          // Wrap the message object in an array with the n property
          const messageArray = [
            {
              role: 'user',
              content: openaiMessage,
            },
          ];

          // Make the API request to OpenAI here using sendToOpenAI
          const openaiResponse = await sendToOpenAI(selectedConversationId, messageArray, fetchai);
          // pet.name = 'cooper';
          // setPet(pet);
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
          }

          const predefinedLocalMessage = `<b>Paws Before Profits</b> html login button`;
          const messageArray2 = [
            {
              role: 'user',
              content: predefinedLocalMessage,
            },
          ];

          await sendMockMessage(selectedConversationId, messageArray2, fetchai);

          // Update the state to show "Transfer Complete" and disable the button
          setButtonClicked(false);
          onAiLoadingChange(false);
          // Update the button text to "Transfer Complete"
          setButtonText('Transfer Complete');
        }

        // Optionally, you can trigger other actions or update state based on the response
      } catch (error) {
        // Handle any errors from the API request
        console.error('OpenAI API Error:', error);

        // Reset the buttonClicked state to false if an error occurs
        setButtonClicked(false);
        onAiLoadingChange(false);
      }
    }
  };

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        sx={{
          borderColor: '#FFF',
          mt: 2,
          width: '100%',
          '&:disabled': {
            color: '#FFF',
            borderColor: '#FFF',
            background: 'none',
          },
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        onClick={handleButtonClick}
        disabled={buttonClicked}
      >
        {buttonClicked ? (
          <div
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              animation: 'scrollText 5s linear infinite',
            }}
          >
            Transferring Pet Passport...
          </div>
        ) : (
          buttonText
        )}
      </Button>
      <style>
        {`
          @keyframes scrollText {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </>
  );
}

FetchAcceptPetButton.propTypes = {
  value: PropTypes.string,
  pet: PropTypes.array,
  setPet: PropTypes.func,
  onAiLoadingChange: PropTypes.func,
};
