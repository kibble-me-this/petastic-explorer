// @mui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
// _mock
import {
  _bookings,
  _bookingNew,
  _bookingsOverview,
  _bookingReview,
  _analyticOrderTimeline,
  _bankingRecentTransitions,
} from 'src/_mock';
// assets
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';
// components
import { useSettingsContext } from 'src/components/settings';
//
import BookingBooked from '../booking-booked';
import BookingNewest from '../booking-newest';
import BookingDetails from '../booking-details';
import BookingAvailable from '../booking-available';
import BookingStatistics from '../booking-statistics';
import BookingTotalIncomes from '../booking-total-incomes';
import BookingWidgetSummary from '../booking-widget-summary';
import BookingCheckInWidgets from '../booking-check-in-widgets';
import BookingCustomerReviews from '../booking-customer-reviews';

import AnalyticsOrderTimeline from '../../analytics/analytics-order-timeline';

import BankingBalanceStatistics from '../../banking/banking-balance-statistics';
import BankingRecentTransitions from '../../banking/banking-recent-transitions';
import BankingExpensesCategories from '../../banking/banking-expenses-categories';

// ----------------------------------------------------------------------

const SPACING = 3;

export default function OverviewBookingView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableEqualOverflow>
        {/** TOP ROW */}
        <Grid xs={12} md={4}>
          <BookingTotalIncomes
            title="FetchAi Total Activations"
            total={490}
            percent={31}
            chart={{
              series: [
                { x: 'W1', y: 18 },
                { x: 'W2', y: 48 },
                { x: 'W3', y: 196 },
                { x: 'W4', y: 336 },
                { x: 'W5', y: 444 },
                { x: 'W6', y: 490 },
                { x: 'W7', y: 0 },

              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingTotalIncomes
            title="Total Revenue"
            total={0}
            percent={0}
            chart={{
              series: [
                { x: 2016, y: 0 },
                { x: 2017, y: 0 },
                { x: 2018, y: 0 },
                { x: 2019, y: 0 },
                { x: 2020, y: 0 },
                { x: 2021, y: 0 },
                { x: 2022, y: 0 },
                { x: 2023, y: 0 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingTotalIncomes
            title="Total Revenue"
            total={0}
            percent={0}
            chart={{
              series: [
                { x: 2016, y: 111 },
                { x: 2017, y: 136 },
                { x: 2018, y: 76 },
                { x: 2019, y: 108 },
                { x: 2020, y: 74 },
                { x: 2021, y: 54 },
                { x: 2022, y: 57 },
                { x: 2023, y: 84 },
              ],
            }}
          />
        </Grid>

        {/** SECOND ROW */}
        <Grid container xs={12}>
          {/** NEW PARENT ACTIVATIONS */}
          <Grid xs={12} md={4}>
            <BookingAvailable
              title="FetchAi Activations (all time)"
              chart={{
                series: [
                  { label: 'Activated', value: 490 },
                  { label: 'Not Activated', value: 37 },
                ],
              }}
            />
          </Grid>
          <Grid container xs={12} md={8}>
            {/** NEW PARENT ENGAGEMENT */}
            <Grid xs={12} md={6}>
              <Stack orientation="column" spacing={1}>
                <BookingCheckInWidgets
                  title="FetchAi Engagement (all time)"
                  chart={{
                    series: [
                      {
                        label: 'Cost per Activation ($)',
                        type: 'USD',
                        percent: 'N/A',
                        total: 0.58,
                      },
                      {
                        label: 'Time from Adoption >> Activation',
                        type: 'time',
                        percent: -1,
                        total: 1812,
                      },
                      {
                        label: 'Ave. Session Engagement (time)',
                        type: 'time',
                        percent: 1,
                        total: 364,
                      },
                      {
                        label: 'Ave. Session Engagement (count)',
                        type: 'questions',
                        percent: -1,
                        total: 7.1,
                      },

                      { label: 'Buy it Now Clicks (Food)', type: 'clicks', percent: 1, total: 246 },
                    ],
                  }}
                />
              </Stack>
            </Grid>
            {/** NEW PARENT PIPELINE */}
            <Grid xs={12} md={6}>
              <BookingBooked title="New Parent Pipeline (current wk)" data={_bookingsOverview} />
            </Grid>
          </Grid>
        </Grid>

        {/** THIRD ROW */}
        <Grid container xs={12}>
          <Grid item xs={8}>
            {' '}
            {/* Adjust xs and md values */}
            <BankingExpensesCategories
              title="Top Parent Requests (all time)"
              chart={{
                series: [
                  { label: 'Get food recommendations', value: 256, guided: true },
                  { label: 'Get grooming recommendations', value: 129, guided: true },
                  { label: 'Register location + microchip', value: 195, guided: true },
                  { label: 'Click food purchase', value: 199, guided: true },
                  { label: 'Get pet insurance quote', value: 178, guided: true },
                  { label: 'Show pet records', value: 109, guided: true },
                  { label: 'Find local groomer', value: 44, g2ided: false },
                  { label: 'Find local dog parks', value: 22, guided: false },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.dark,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.info.main,
                ],
              }}
            />
          </Grid>
          {/** 
          <Grid item xs={12} md={4}>
            <AnalyticsOrderTimeline title="New Parent Journey" list={_analyticOrderTimeline} />
          </Grid> */}
        </Grid>

        <Grid xs={8}>
          <BankingBalanceStatistics
            title="FetchAi Activations Weekly Cohorts"
            subheader="Activated shelters = 5 | Activated States = 1 [NY]"
            chart={{
              categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6(*)', 'W7', 'W8', 'W9'],
              series: [
                {
                  type: 'Weekly',
                  data: [
                    {
                      name: 'Adoptable Pets',
                      data: [18, 36, 158, 153, 185, 161, 0, 0, 0],
                    },
                    {
                      name: 'Adoptions',
                      data: [18, 30, 150, 148, 156, 25, 0, 0, 0],
                    },
                    {
                      name: 'Activations',
                      data: [18, 30, 148, 138, 141, 15, 0, 0, 0],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
