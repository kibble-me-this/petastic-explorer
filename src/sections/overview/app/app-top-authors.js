import PropTypes, { bool } from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

// utils
import { fShortenNumber } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppTopAuthors({ title, subheader, list, loading, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {orderBy(list, ['totalFavorites'], ['desc']).map((author, index) => (
          <AuthorItem key={author.id} author={author} index={index} loading={loading} />
        ))}
      </Stack>
    </Card>
  );
}

AppTopAuthors.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
};

// ----------------------------------------------------------------------

function AuthorItem({ author, index, loading }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {loading ? (
        // Show Skeleton components for Avatar and Typography while data is loading
        <>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack orientation="column">
            {' '}
            <Skeleton variant="text" width={220} height={20} />
            <Skeleton variant="text" width={220} height={20} />
          </Stack>
        </>
      ) : (
        // Render the actual Avatar and Typography when data has loaded
        <>
          <Avatar alt={author.name} src={author.avatarUrl} />

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{author.name}</Typography>

            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              {/* <Iconify icon="solar:heart-bold" width={14} sx={{ mr: 0.5 }} /> */}
              {fShortenNumber(author.totalFavorites)}
            </Typography>
          </Box>
        </>
      )}

      {/** 
      <Iconify
        icon="solar:cup-star-bold"
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          ...(index === 1 && {
            color: 'primary.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'primary.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      />
      */}
    </Stack>
  );
}

AuthorItem.propTypes = {
  author: PropTypes.object,
  index: PropTypes.number,
  loading: PropTypes.bool,
};
