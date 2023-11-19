import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

// hooks
import { fNumber } from 'src/utils/format-number';
import { format_seconds } from 'src/utils/format-time';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_SIZE = { width: 106, height: 106 };

function format_count(total, type) {
  // Check if both total and type are defined
  if (total) {
    // Convert total to a string and make it all capital letters
    return `${total.toString().toUpperCase()} ${type}`;
  } // else {
    // Handle the case where either total or type is undefined
    return 'N/A'; // Or any other default value you prefer
  // }
}


export default function BookingCheckInWidgets({ title, chart, ...other }) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    series,
    options,
  } = chart;

  const chartOptionsCheckIn = useChart({
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0][0] },
          { offset: 100, color: colors[0][1] },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
    ...options,
  });

  const chartOptionsCheckout = {
    ...chartOptionsCheckIn,
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[1][0] },
          { offset: 100, color: colors[1][1] },
        ],
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader title={title} sx={{ mb: 8 }} />
      <Stack
        direction={{ xs: 'column', sm: 'column' }}
        divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {series.map((item, index) => (
          <Stack
            key={item.label}
            direction="row"
            alignItems="center"
            justifyContent="left"
            spacing={3}
            sx={{
              width: 1,
              py: 1,
              pl: 3,
              // Apply extra padding to the last item in the array
              pb: index === series.length - 1 ? 3 : undefined,
            }}
          >
            <div>
              <Typography variant="overline">{item.label}</Typography>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  {item.type === 'time' ? format_seconds(item.total) : format_count(item.total, item.type)}
                </Typography>{' '}
              </Typography>
            </div>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

BookingCheckInWidgets.propTypes = {
  title: PropTypes.string,
  chart: PropTypes.object,
};
