import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function BankingExpensesCategories({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const smUp = useResponsive('up', 'sm');

  const { colors, series, options } = chart;
  const guidedLabels = []; // List of guided series labels
  const nonGuidedLabels = []; // List of non-guided series labels

  // Separate series into guided and non-guided categories
  series.forEach((i) => {
    if (i.guided) {
      guidedLabels.push(i.label);
    } else {
      nonGuidedLabels.push(i.label);
    }
  });

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    labels: series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    fill: {
      opacity: 0.8,
    },
    legend: {
      position: 'right',
      itemMargin: {
        horizontal: 10,
        vertical: 7,
      },
      columnWidth: 140, // Adjust the width as needed
      // Custom formatter for legend
      formatter: (seriesName, opts) => {
        if (guidedLabels.includes(seriesName)) {
          return `<b>Guided:</b> ${seriesName}`;
        } // else if (nonGuidedLabels.includes(seriesName)) {
            return `<b>Non-Guided:</b> ${seriesName}`;
        // }
        // return seriesName; // Handle other cases if needed
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'left',
          },
        },
      },
    ],
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          my: 5,
          '& .apexcharts-legend': {
            m: 'auto',
            // height: { sm: 160 },
            flexWrap: { sm: 'wrap' },
            width: { xs: 240, sm: '50%' },
          },
          '& .apexcharts-datalabels-group': {
            display: 'none',
          },
        }}
      >
        <Chart
          dir="ltr"
          type="polarArea"
          series={chartSeries}
          options={chartOptions}
          height={smUp ? 340 : 460}
        />
      </Box>
    </Card>
  );
}

BankingExpensesCategories.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
