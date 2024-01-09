import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function BookingBooked({ title, subheader, data, ...other }) {
  // Create mock modifiedValues with new values for progress.value
  const modifiedValues = [671110, 185, 96, 90, 54]; // Modify this array as needed

  // Combine the original data with mock modifiedValues
  const modifiedData = data.map((progress, index) => ({
    ...progress,
    value: modifiedValues[index], // Override the progress.value
  }));

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ pb: 6.5 }} />

      <Stack spacing={3} sx={{ p: 3, mb: 3.5 }}>
        {modifiedData.map((progress) => (
          <Stack key={progress.status}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Box sx={{ typography: 'overline' }}>{progress.status}</Box>
              <Box sx={{ typography: 'subtitle1' }}>{fShortenNumber(progress.value)}</Box>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={100}
              color={
                (progress.status === 'Pending' && 'warning') ||
                (progress.status === 'Canceled' && 'error') ||
                'success'
              }
              sx={{
                height: 8,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

BookingBooked.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
