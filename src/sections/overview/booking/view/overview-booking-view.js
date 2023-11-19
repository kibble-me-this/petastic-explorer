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
              title="FetchAi Activations"
              chart={{
                series: [
                  { label: 'Activated', value: 272 },
                  { label: 'Not Activated', value: 11 },
                ],
              }}
            />
          </Grid>
          <Grid container xs={12} md={8}>
            {/** NEW PARENT ENGAGEMENT */}
            <Grid xs={12} md={6}>
              <Stack orientation="column" spacing={1}>
                <BookingCheckInWidgets
                  title="FetchAi Engagement"
                  chart={{
                    series: [
                      {
                        label: 'Time from Adoption --> first engagement',
                        type: 'time',
                        percent: 72,
                        total: 1832,
                      },
                      {
                        label: 'Ave. Session Engagement (time)',
                        type: 'time',
                        percent: 64,
                        total: 363,
                      },
                      {
                        label: 'Ave. Session Engagement (count)',
                        type: 'questions',
                        percent: 64,
                        total: 7,
                      },
                      {
                        label: 'Total Pet Shelters Activated',
                        type: 'shelters',
                        percent: 64,
                        total: 5,
                      },
                      { label: 'Buy it Now Clicks (Food)', type: 'clicks', percent: 72, total: 88 },
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
          <Grid item xs={12}>
            {' '}
            {/* Adjust xs and md values */}
            <BankingExpensesCategories
              title="FetchAi New Parent Interactions (count)"
              chart={{
                series: [
                  { label: 'Get food recommendations', value: 124, guided: true },
                  { label: 'Click food purchase', value: 88, guided: true },
                  { label: 'Get grooming recommendations', value: 115, guided: true },
                  { label: 'Get pet insurance quote', value: 65, guided: true },
                  { label: 'Show pet records', value: 100, guided: true },
                  { label: 'Find local groomer', value: 17, guided: false },
                  { label: 'Find local dog parks', value: 10, guided: false },
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

        <Grid xs={12}>
          <BankingBalanceStatistics
            title="FetchAi Activations Weekly Cohorts"
            // subheader="(+43% Income | +12% Expense) than last year"
            chart={{
              categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9'],
              series: [
                {
                  type: 'Weekly',
                  data: [
                    {
                      name: 'Adoptable Pets',
                      data: [18, 36, 158, 153, 0, 0, 0, 0, 0],
                    },
                    {
                      name: 'Adoptions',
                      data: [18, 30, 150, 85, 0, 0, 0, 0, 0],
                    },
                    {
                      name: 'Activations',
                      data: [18, 30, 148, 76, 0, 0, 0, 0, 0],
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
