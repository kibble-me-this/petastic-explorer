import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// components
import Image from 'src/components/image';
import { use } from 'i18next';

// ----------------------------------------------------------------------

export default function PetCard({ user }) {
  const theme = useTheme();

  console.log(user);

  const mockUser = {
    pet_name: user.name,
    pet_avatar: user.avatar_file_name,
    pet_breed: user.breed,
    pet_gender: user.gender,
    pet_age: user.age.life_stage,
    pet_weight: user.weight,
  };

  const { pet_name, pet_avatar, pet_breed, pet_gender, pet_age, pet_weight } = mockUser;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Image src={pet_avatar} alt={pet_avatar} ratio="1/1" />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 1.5 }}
      >
        <ListItemText
          primary={pet_name}
          secondary={pet_breed}
          primaryTypographyProps={{
            typography: 'chat_body',
            textAlign: 'left',
            color: '#345BFF',
            fontWeight: '800',
          }}
          secondaryTypographyProps={{
            typography: 'chat_author',
            component: 'span',
            textAlign: 'left',
            fontWeight: '400',
          }}
          sx={{ ml: 2 }}
        />{' '}
        {/* Empty spacer */}
        <div style={{ flex: 1 }} />
        <Image src="/assets/images/avatars/near.svg" sx={{ mr: 2.5, mb: 2.5 }} />
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        sx={{ py: 3, typography: 'subtitle1' }}
      >
        <div>
          <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
            GENDER
          </Typography>
          <Typography
            variant="chat_author"
            component="div"
            sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
          >
            {pet_gender}
          </Typography>
        </div>

        <div>
          <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
            LIFE STAGE
          </Typography>

          <Typography
            variant="chat_author"
            component="div"
            sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
          >
            {pet_age}
          </Typography>
        </div>

        <div>
          <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
            WEIGHT{' '}
          </Typography>
          <Typography
            variant="chat_author"
            component="div"
            sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
          >
            {fShortenNumber(pet_weight)}
          </Typography>
        </div>
      </Box>
    </Card>
  );
}

PetCard.propTypes = {
  user: PropTypes.object,
};
