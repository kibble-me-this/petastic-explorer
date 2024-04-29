import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AppAreaInstalled({ title, subheader, chart, loading, ...other }) {
  const theme = useTheme();

  const [loadingData1, setLoadingData1] = useState(true);
  const [loadingData2, setLoadingData2] = useState(true);

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const popover = usePopover();
  const [seriesData, setSeriesData] = useState('2023');

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  const handleChangeSeries = (newValue) => {
    popover.onClose();
    setSeriesData(newValue);
  };

  useEffect(() => {
    if (!loading) {
      // Simulate fetching data from the API
      setTimeout(() => {
        // Simulate data fetching
        setLoadingData1(false); // Set loadingData1 to false once data is fetched
      }, 500); // Simulate a 2-second delay for data fetching (you can adjust this)
    }
  }, [loading]);

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={loading ? <Skeleton animation="wave" width={100} /> : subheader}
          // action={
          //   <ButtonBase
          //     onClick={popover.onOpen}
          //     sx={{
          //       pl: 1,
          //       py: 0.5,
          //       pr: 0.5,
          //       borderRadius: 1,
          //       typography: 'subtitle2',
          //       bgcolor: 'background.neutral',
          //     }}
          //   >
          //     {seriesData}
          //     <Iconify
          //       width={16}
          //       icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          //       sx={{ ml: 0.5 }}
          //     />
          //   </ButtonBase>
          // }
        />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart
            dir="ltr"
            type="line"
            series={loadingData1 ? [] : series.find((item) => item.year === seriesData)?.data || []}
            options={chartOptions}
            height={364}
          />
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

AppAreaInstalled.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool, // Add loading prop for handling loading state
};
