import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';

// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// api
import { useGetContacts, useGetConversation, useGetConversations } from 'src/api/chat';
// components
import { useSettingsContext } from 'src/components/settings';
//
import ChatNav from '../chat-nav';
import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';

// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();
  const navigate = useNavigate();

  const { user } = useMockedUser();

  const [pet, setPet] = useState({
    name: '',
    lifeStage: '',
    breed: '',
    avatar: '',
  });

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [showButton1, setShowButton1] = useState(true);
  const [showButton2, setShowButton2] = useState(true);
  const [userTyped, setUserTyped] = useState(false);
  const [inputFieldFocused, setInputFieldFocused] = useState(false);

  const [recipients, setRecipients] = useState([]);

  const { contacts } = useGetContacts();

  const { conversations, conversationsLoading } = useGetConversations();

  const { conversation, conversationError } = useGetConversation(`${selectedConversationId}`);

  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiLoadingChange = (isLoading) => {
    setIsAiLoading(isLoading);
  };

  // Step 1: State to hold the message text
  const [inputMessage, setInputMessage] = useState('');

  const participants = conversation
    ? conversation.participants.filter((participant) => participant.id !== user.id)
    : [];

  // useEffect(() => {
  //   // Navigate to the desired URL when the component loads
  //   navigate('/?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4');
  // }, [navigate]);

  // useEffect(() => {
  //   if (conversationError || !selectedConversationId) {
  //     router.push(paths.dashboard.chat);
  //   }
  // }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  const [button1Text, setButton1Text] = useState('');

  const handleButton1Click = () => {
    setInputMessage(`i need a food recommendation for a ${pet.breed}`);

    // Call the function to set the button text
    setShowButton1(false);
    setShowButton2(false);
  };

  const handleButton2Click = () => {
    setInputMessage(`i need an html list of training tips for a ${pet.breed}`);
    setShowButton1(false);
    setShowButton2(false);
  };
  const handleInputTyping = (text) => {
    // When the user is typing, clear the inputMessage to prevent it from being reset
    setInputMessage('');

    if (text.trim() !== '') {
      setShowButton1(false);
      setShowButton2(false);
    } else {
      setShowButton1(true);
      setShowButton2(true);
    }
  };

  const details = !!conversation;

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
    >
      {selectedConversationId ? (
        <>{details && <ChatHeaderDetail pet={pet} participants={participants} />}</>
      ) : (
        <ChatHeaderCompose
          contacts={contacts}
          onAddRecipients={handleAddRecipients}
          onInputTyping={handleInputTyping}
        />
      )}
    </Stack>
  );

  const renderNav = (
    <ChatNav
      contacts={contacts}
      conversations={conversations}
      loading={conversationsLoading}
      selectedConversationId={selectedConversationId}
      pet={pet}
    />
  );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <ChatMessageList
        messages={conversation?.messages}
        participants={participants}
        pet={pet}
        setPet={setPet}
        onAiLoadingChange={handleAiLoadingChange}
      />
      {/** 
      <Stack direction="column" spacing={1} sx={{ mx: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleButton1Click}
          style={{ display: showButton1 ? 'block' : 'none' }}
          sx={{
            borderRadius: '12px', // You can adjust the value as needed
            border: '1px solid #D0C0BD',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onClick={handleButton1Click}
            style={{ display: showButton1 ? 'flex' : 'none' }}
            sx={{ my: 1.5, ml: 1.5, mr: 0.5 }}
          >
            <Stack direction="column" alignItems="flex-start">
              <Typography variant="chat_author">Find food recommendations</Typography>
              <Typography
                variant="chat_author"
                sx={{ fontWeight: 'normal', textTransform: 'none' }}
              >
                for your {pet.breed}
              </Typography>
            </Stack>
            <Iconify width={24} icon="eva:arrow-ios-forward-fill" sx={{ color: '#808080' }} />{' '}
          </Stack>
        </Button>

        <Button
          variant="outlined"
          onClick={handleButton2Click}
          style={{ display: showButton1 ? 'block' : 'none' }}
          sx={{
            borderRadius: '12px', // You can adjust the value as needed
            border: '1px solid #D0C0BD',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onClick={handleButton2Click}
            style={{ display: showButton1 ? 'flex' : 'none' }}
            sx={{ my: 1.5, ml: 1.5, mr: 0.5 }}
          >
            <Stack direction="column" alignItems="flex-start">
              <Typography variant="chat_author">Get training advice</Typography>
              <Typography variant="chat_author" sx={{ fontWeight: 'normal' }}>
                for your {pet.breed}
              </Typography>
            </Stack>
            <Iconify width={24} icon="eva:arrow-ios-forward-fill" sx={{ color: '#808080' }} />{' '}
          </Stack>
        </Button>
      </Stack>
      */}
      <ChatMessageInput
        recipients={recipients}
        onAddRecipients={handleAddRecipients}
        //
        selectedConversationId={selectedConversationId}
        disabled={!recipients.length && !selectedConversationId}
        onInputTyping={handleInputTyping}
        inputMessage={inputMessage}
        pet={pet}
        setPet={setPet}
        isAiLoading={isAiLoading}
        onAiLoadingChange={handleAiLoadingChange}
      />
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Stack
        component={Card}
        direction="row"
        sx={{
          mt: 1,
          height: '90vh',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          backgroundImage: 'url(/assets/background/overlay_5.jpg)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          borderRadius: 0,

        }}
      >
        {renderNav}

        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          {renderHead}
          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {renderMessages}

            {details && (
              <ChatRoom conversation={conversation} user={user} participants={participants} pet={pet} />
            )}
          </Stack>{' '}
        </Stack>
      </Stack>
    </Container>
  );
}
