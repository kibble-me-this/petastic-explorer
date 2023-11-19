import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton'; // Import Skeleton component
import Box from '@mui/material/Box'; // Import Skeleton component

// utils
import { fNumber } from 'src/utils/format-number';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 390;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentDownload({ title, subheader, chart, loading, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = loading ? [] : series.map((i) => i.value); // Use empty array if loading

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      {loading ? ( // Check if loading
        // Show Circular Skeleton component shaped like a donut while data is loading
        <Box
          width={CHART_HEIGHT}
          height={CHART_HEIGHT}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            variant="circular"
            width={1}
            height={1}
            animation="wave"
            sx={{
              '& circle': {
                stroke: theme.palette.divider,
                strokeWidth: 2,
                strokeDasharray: '6 6',
              },
            }}
          />
        </Box>
      ) : (
        // Render the actual chart when data has loaded
        <StyledChart
          dir="ltr"
          type="donut"
          series={chartSeries}
          options={chartOptions}
          height={280}
        />
      )}
    </Card>
  );
}

AppCurrentDownload.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool, // Add loading prop
};
