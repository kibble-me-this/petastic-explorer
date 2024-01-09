import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';


// utils
import { fCurrency, fPercent } from 'src/utils/format-number';


// hooks
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
        divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'solid', color:'black' }} />}
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

  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
    <Typography variant="h4" sx={{ mb: 0.5 }}>
  <Typography variant="h4" sx={{ mb: 0.5 }}>
    {(() => {
      if (item.type === 'time') {
        return format_seconds(item.total);
      }
      if (item.type === 'USD') {
        return fCurrency(item.total);
      }
      return format_count(item.total, item.type);
    })()}
  </Typography>{' '}
</Typography>
    </div>
  
    <div style={{ display: 'flex', alignItems: 'right' }}>
      <Iconify
        icon={item.percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          ml: 4,
          mr: 1,
          p: 0.5,
          width: 20,
          height: 20,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: alpha(theme.palette.success.main, 0.16),
          ...(item.percent < 0 && {
            color: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />
  
      <Typography variant="subtitle2" component="div" noWrap>
        {item.percent > 0 && '+'}
  
        {fPercent(item.percent)}
  
        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          {' than last week'}
        </Box>
      </Typography>
    </div>
  </div>
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
  percent: PropTypes.number,
};
