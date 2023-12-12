import PropTypes from 'prop-types';
// @mui
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function PetItemSkeleton({ variant = 'vertical', sx, ...other }) {
  return (
    <Paper elevation={3} sx={{ p: 2, ...sx }} {...other}>
      <Stack direction="column" alignItems="center">
        <Skeleton variant="rectangular" sx={{ width: '100%', height: 0, paddingTop: '100%' }} />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          <Skeleton width={200} />
        </Typography>
        <Typography variant="body2">
          <Skeleton width={150} />
        </Typography>
        <Typography variant="body2">
          <Skeleton width={100} />
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
          <Skeleton variant="circular" sx={{ width: 24, height: 24, flexShrink: 0 }} />
          <Skeleton variant="circular" sx={{ width: 24, height: 24, flexShrink: 0 }} />
          <Skeleton variant="circular" sx={{ width: 24, height: 24, flexShrink: 0 }} />
        </Stack>
      </Stack>
    </Paper>
  );
}
PetItemSkeleton.propTypes = {
  sx: PropTypes.object,
  variant: PropTypes.string,
};

// ----------------------------------------------------------------------

export function PostDetailsSkeleton({ ...other }) {
  return (
    <Stack {...other}>
      <Skeleton variant="rectangular" sx={{ height: 480 }} />

      <Stack sx={{ width: 1, maxWidth: 720, mx: 'auto' }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{ my: 8 }}>
          <Skeleton variant="circular" sx={{ width: 64, height: 64, flexShrink: 0 }} />

          <Stack spacing={1} flexGrow={1}>
            <Skeleton height={10} />
            <Skeleton height={10} sx={{ width: 0.9 }} />
            <Skeleton height={10} sx={{ width: 0.8 }} />
          </Stack>
        </Stack>

        <Skeleton sx={{ height: 720 }} />
      </Stack>
    </Stack>
  );
}
