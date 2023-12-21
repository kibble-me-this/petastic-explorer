import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Chip';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber, fCurrency, fData } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { outlineButton } from 'src/theme/css';
import { Typography } from '@mui/material';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { sendToOpenAI } from '../../api/openai';

// ----------------------------------------------------------------------

export default function PetDNACard({ post, onAiLoadingChange }) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { title, description, coverUrl } = post;

  const { user, fetchai } = useMockedUser();

  const handleButtonClick = async () => {
    // if (!buttonClicked) {
    // Prevent multiple clicks
    onAiLoadingChange(true);

    try {
      const openaiMessage = `${coverUrl}`; // Your predefined message
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
      onAiLoadingChange(false);
    } catch (error) {
      // Handle any errors from the API request
      console.error('OpenAI API Error:', error);

      // Reset the buttonClicked state to false if an error occurs
      // setButtonClicked(false);
      onAiLoadingChange(false);
    }
    // }
  };

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mt: 1.5, mx: 0.5 }}>
        <Button
          onClick={handleButtonClick}
          style={{ display: 'block' }}
          sx={{
            borderRadius: '12px',
            background: '#FFFFFF1F',
            transition: 'background-color 0.3s', // Smooth transition for color change
            '&:hover': {
              background: '#FFFFFF3F', // 10% darker color
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 1.5, ml: 1, mr: 0.5 }}
          >
            <Stack direction="column" alignItems="flex-start" sx={{ flexGrow: 1 }}>
              <TextMaxLine
                line="1"
                variant="chat_body"
                sx={{ width: '230px', fontWeight: '700', textTransform: 'none', textAlign: 'left' }}
              >
                {title}
              </TextMaxLine>
              <TextMaxLine
                variant="chat_body"
                sx={{
                  width: '230px',
                  fontWeight: 'normal',
                  textTransform: 'none',
                  textAlign: 'left',
                }}
              >
                {description}
              </TextMaxLine>
            </Stack>
            <Iconify width={28} icon="eva:arrow-ios-forward-fill" sx={{ color: '#FFF' }} />
          </Stack>
        </Button>
      </Stack>
    </>
  );
}

PetDNACard.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
  }),
  onAiLoadingChange: PropTypes.func,
};
