import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function BookingStatistics({ title, subheader, chart, height, ...other }) {
  const { categories, colors, series, series2, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('Year');

  const chartOptions = useChart({
    // colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    yaxis: [
      {
        title: {
          text: 'New Fetch Users',
        },
      },
      {
        opposite: true,
        title: {
          text: 'New Fetch Users',
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },
    legend: {
      show: true,
      position: 'top',
    },
    // dataLabels: {
    //   enabled: true,
    //   // enabledOnSeries: undefined,

    //   textAnchor: 'top',
    //   // distributed: false,
    //   offsetX: 0,
    //   offsetY: 0,
    //   style: {
    //     fontSize: '14px',
    //     // fontFamily: 'Helvetica, Arial, sans-serif',
    //     fontWeight: 'bold',
    //     colors: undefined,
    //   },
    //   background: {
    //     enabled: true,
    //     foreColor: '#fff',
    //     padding: 4,
    //     borderRadius: 8,
    //     borderWidth: 1,
    //     borderColor: '#fff',
    //     opacity: 0.9,
    //     dropShadow: {
    //       enabled: false,
    //       top: 1,
    //       left: 1,
    //       blur: 1,
    //       color: '#000',
    //       opacity: 0.45,
    //     },
    //   },
    //   dropShadow: {
    //     enabled: false,
    //     top: 1,
    //     left: 1,
    //     blur: 1,
    //     color: '#000',
    //     opacity: 0.45,
    //   },
    // },
    ...options,
  });
  const chartOptions2 = useChart({
    colors: ['#04bcdc', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
    chart: {
      type: 'line',
    },
    stroke: {
      curve: 'stepline',
    },
    xaxis: {
      categories,
    },
    yaxis: [
      {
        title: {
          text: 'Active Shelters',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Active Shelters',
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },

    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,

      textAnchor: 'top',
      // distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: undefined,
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45,
        },
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45,
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
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
        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            {item.type === seriesData && (
              <Chart
                dir="ltr"
                type="bar"
                series={item.data}
                options={chartOptions}
                height={height}
              />
            )}
          </Box>
        ))}
        <Divider sx={{ my: 1 }} /> {/* Add a divider with margin top and bottom */}
        {series2.map((item) => (
          <Box key={item.type} sx={{ mt: 0, mx: 3 }}>
            {item.type === seriesData && (
              <Chart dir="ltr" series={item.data} options={chartOptions2} height={200} />
            )}
          </Box>
        ))}
      </Card>

      {/* <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>
      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series2.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </>
  );
}

BookingStatistics.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  height: PropTypes.number,
};
