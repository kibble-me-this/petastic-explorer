import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

// utils
import { fCurrency, fShortenNumber } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AppTopRelated({ title, subheader, list, loading, ...other }) {
  return (
    <Card {...other} >
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} loading={loading} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AppTopRelated.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
};

// ----------------------------------------------------------------------

function ApplicationItem({ app, loading }) {
  const { shortcut, system, price, ratingNumber, totalReviews, name } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {loading ? (
        // Show Skeleton components for Avatar and Typography while data is loading
        <>
          <Avatar>
            <Skeleton variant="circular" width={48} height={48} />
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2">
              <Skeleton variant="text" width={120} />
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Skeleton variant="text" width={60} />
            </Typography>
          </Box>
        </>
      ) : (
        // Render the actual Avatar and Typography when data has loaded
        <>
          <Avatar>
            <Box component="img" src={shortcut} sx={{ width: 48, height: 48 }} />
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              {fShortenNumber(totalReviews)}
            </Typography>
          </Box>
        </>
      )}

      

      {/* <Stack alignItems="flex-end">
         <Rating readOnly size="small" precision={0.5} name="reviews" value={ratingNumber} /> 
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {fShortenNumber(totalReviews)} reviews
        </Typography>
      </Stack> */}
    </Stack>
  );
}

ApplicationItem.propTypes = {
  app: PropTypes.object,
  loading: PropTypes.bool,
};
