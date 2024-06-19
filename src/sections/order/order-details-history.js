import PropTypes from 'prop-types';
// @mui
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// utils
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function OrderDetailsHistory({ history }) {
  if (!history || !history.length) {
    return null;
  }

  const allTracking = history.flatMap(item => item.tracking || []);
  const allDeliveryDates = history.flatMap(item => item.delivery_dates || []);
  const createdAtTimes = history.map(item => item._created_at);

  const latestCreatedAt = createdAtTimes[createdAtTimes.length - 1];
  const latestDeliveryDate = allDeliveryDates[allDeliveryDates.length - 1];

  const renderSummary = (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: 260,
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      {/* <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Order time</Box>
        {fDateTime(history.orderTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Payment time</Box>
        {fDateTime(history.paymentTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Delivery time for the carrier</Box>
        {fDateTime(history.deliveryTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Completion time</Box>
        {fDateTime(history.completionTime)}
      </Stack> */}

      {latestCreatedAt && (
        <Stack spacing={0.5}>
          <Box sx={{ color: 'text.disabled' }}>Order approved</Box>
          {fDateTime(latestCreatedAt)}
        </Stack>
      )}

      {latestDeliveryDate && (
        <Stack spacing={0.5}>
          <Box sx={{ color: 'text.disabled' }}>Estimated delivery</Box>
          {fDateTime(latestDeliveryDate.delivery_date)}
        </Stack>
      )}
    </Stack>
  );

  const renderTimeline = (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {/* {history.timeline.map((item, index) => {
        const firstTimeline = index === 0;
        const lastTimeline = index === history.timeline.length - 1;

        return (
          <TimelineItem key={item.title}>
            <TimelineSeparator>
              <TimelineDot color={(firstTimeline && 'primary') || 'grey'} />
              {lastTimeline ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                {fDateTime(item.time)}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })} */}

      {allTracking.length > 0 ? (
        allTracking.map((item, index) => {
          const firstTimeline = index === 0;
          const lastTimeline = index === allTracking.length - 1;

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={(firstTimeline && 'primary') || 'grey'} />
                {lastTimeline ? null : <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Typography variant="subtitle2">{item.delivery_status}</Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(item.obtained_at)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })
      ) : (
        <Typography variant="body2" sx={{ color: 'text.disabled', mt: 2 }}>
          No tracking information available.
        </Typography>
      )}
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title="History" />
      <Stack
        spacing={3}
        alignItems={{ md: 'flex-start' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ p: 3 }}
      >
        {renderTimeline}
        {renderSummary}
      </Stack>
    </Card>
  );
}

OrderDetailsHistory.propTypes = {
  history: PropTypes.array.isRequired,
};
