import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// utils
import { fPercent } from 'src/utils/format-number';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function BookingAvailable({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  console.log(series);

  const adoptedPets = series.find((item) => item.label === 'Adopted');
  const fetchNewUsers = series.find((item) => item.label === 'Onboarded');
  const activationRate = (fetchNewUsers.value / adoptedPets.value) * 100;

  const total = sumBy(series, 'value');

  const chartSeries =
    (series.filter((i) => i.label === 'Onboarded')[0].value / adoptedPets.value) * 100;

  const chartOptions = useChart({
    legend: {
      show: false,
    },
    // grid: {
    //   padding: { top: -32, bottom: -32 },
    // },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 100, color: colors[1] },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        dataLabels: {
          name: { offsetY: -16 },
          value: { offsetY: 8 },
          total: {
            label: 'Activation Rate',
            formatter: () => fPercent(activationRate),
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Chart type="radialBar" series={[chartSeries]} options={chartOptions} height={235} />

      {/* <Stack spacing={2} sx={{ p: 5 }}>
        {series.map((item) => (
          <Stack
            key={item.label}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              typography: 'subtitle2',
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: alpha(theme.palette.grey[500], 0.16),
                borderRadius: 0.75,
                ...(item.label === 'Adopted' && {
                  bgcolor: colors[1],
                }),
              }}
            />
            <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>{item.label}</Box>
            {item.value} Tours
          </Stack>
        ))}
      </Stack> */}
    </Card>
  );
}

BookingAvailable.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
