import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// _mock
import { _socials } from 'src/_mock';
// assets
import { AvatarShape } from 'src/assets/illustrations';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PetCard({ user }) {
  const theme = useTheme();

  const { name, coverUrl, role, totalFollowers, totalPosts, avatarUrl, totalFollowing } = user;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Image
          src={coverUrl}
          alt={coverUrl}
          ratio="1/1"
          // overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 1.5 }}
      >
        <ListItemText
          primary={name}
          secondary={role}
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
        />
        {/* Empty spacer */}
        <div style={{ flex: 1 }} />
        <Image
          src="assets/images/avatars/near.svg"
          // ratio="1/1"
          // overlay={alpha(theme.palette.grey[900], 0.48)}
          sx={{ mr: 2.5, mb: 2.5 }}
        />
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        sx={{ pt: 1, pb: 2.5, typography: 'subtitle1' }}
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
            {totalFollowers}
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
            {totalFollowing}
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
            {totalPosts}
          </Typography>
        </div>
      </Box>
    </Card>
  );
}

PetCard.propTypes = {
  user: PropTypes.object,
};
