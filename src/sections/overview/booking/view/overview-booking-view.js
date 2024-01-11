// @mui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _bookings, _bookingNew, _bookingsOverview, _bookingReview } from 'src/_mock';
// assets
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
  AvatarShape,
  SeoIllustration,
  UploadIllustration,
  ForbiddenIllustration,
  MotivationIllustration,
  SeverErrorIllustration,
  ComingSoonIllustration,
  MaintenanceIllustration,
  PageNotFoundIllustration,
  OrderCompleteIllustration,
  UpgradeStorageIllustration,
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

// ----------------------------------------------------------------------

const SPACING = 3;

const shelterAdoptionsCategories = [
  'w1',
  'w2',
  'w3',
  'w4',
  'w5',
  'w6',
  'w7',
  'w8',
  'w9',
  'w10',
  'w11',
];
const adoptedData = [18, 18, 31, 34, 34, 35, 36, 12, 18, 28, 28];
const onboardedData = [18, 18, 30, 31, 33, 28, 27, 5, 16, 22, 25];
const activeSheltersData = [1, 2, 5, 5, 5, 10, 10, 10, 10, 12, 12];

const petsAdopted = adoptedData.map((value, index) => value * activeSheltersData[index]);
const fetchNewUsers = onboardedData.map((value, index) => value * activeSheltersData[index]);

const maxActiveShelters = Math.max(...activeSheltersData); // Find the maximum value

const totalPetsAdopted = petsAdopted.reduce((acc, value) => acc + value, 0); // Sum of petsAdopted
const totalFetchNewUsers = fetchNewUsers.reduce((acc, value) => acc + value, 0); // Sum of fetchNewUsers

export default function OverviewBookingView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Fetch Users (active)"
            total={totalFetchNewUsers}
            icon={<img alt="icon" src="/assets/icons/components/ic_avatar.svg" />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Shelters (active)"
            total={maxActiveShelters}
            icon={<img alt="icon" src="/assets/icons/components/ic_icons.svg" />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Shelters (registered)"
            total={14338}
            icon={<img alt="icon" src="/assets/icons/components/ic_tabs.svg" />}
          />
        </Grid>

        <Grid container xs={12}>
          <Grid container xs={12} md={8}>
            <Grid xs={12} md={6}>
              <BookingTotalIncomes
                title="Total Revenue"
                total={18765}
                percent={346}
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
              <BookingTotalIncomes
                title="MRR"
                total={16548}
                percent={100}
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
                sx={{my:1}}
              />
            </Grid>



            <Grid xs={12} md={6}>
            <BookingAvailable
              title="Fetch Activation Rate"
              chart={{
                series: [
                  { label: 'Adopted', value: totalPetsAdopted },
                  { label: 'Onboarded', value: totalFetchNewUsers },
                ],
              }}
            />

            {/* <BookingCustomerReviews
              title="Customer Reviews"
              subheader={`${_bookingReview.length} Reviews`}
              list={_bookingReview}
              sx={{ mt: SPACING }}
            /> */}
          </Grid>

            {/* <Grid xs={12}>
              <BookingCheckInWidgets
                chart={{
                  series: [
                    { label: 'Sold', percent: 72, total: 38566 },
                    { label: 'Pending for payment', percent: 64, total: 18472 },
                  ],
                }}
              />
            </Grid> */}

            {/* <Grid xs={12}>
              <BookingStatistics
                title="Shelter Adoptions"
                subheader="(+43% Sold | +12% Canceled) than last year"
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.light],
                  categories: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11'],

                  series: [
                    // {
                    //   type: 'Week',
                    //   data: [
                    //     {
                    //       name: 'Sold',
                    //       data: [10, 41, 35, 151, 49, 62, 69, 91, 100, 55, 66],
                    //     },
                    //     {
                    //       name: 'Canceled',
                    //       data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 66, 77],
                    //     },
                    //   ],
                    // },
                    // {
                    //   type: 'Month',
                    //   data: [
                    //     {
                    //       name: 'Sold',
                    //       data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                    //     },
                    //     {
                    //       name: 'Canceled',
                    //       data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                    //     },
                    //   ],
                    // },
                    {
                      type: 'Year',
                      data: [
                        {
                          name: 'Adopted',
                          data: [10, 41, 35, 151, 49, 62, 69, 91, 100, 55, 66],
                        },
                        {
                          name: 'Onboarded',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 66, 77],
                        },
                        {
                          name: 'Active Shelters',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 66, 77],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Grid> */}
          </Grid>

          <Grid xs={12} md={4}>
              <BookingBooked title="Fetch User KPIs" data={_bookingsOverview} />
            </Grid>
        </Grid>

        {/* <Grid xs={12}>
          <BookingNewest title="Newest Booking" subheader="12 Booking" list={_bookingNew} />
        </Grid> */}

        <Grid xs={12}>
          {/* <BookingDetails
            title="Booking Details"
            tableData={_bookings}
            tableLabels={[
              { id: 'destination', label: 'Destination' },
              { id: 'customer', label: 'Customer' },
              { id: 'checkIn', label: 'Check In' },
              { id: 'checkOut', label: 'Check Out' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          /> */}

          <BookingStatistics
            title="Shelter Network Launch"
            // subheader="(+43% Sold | +12% Canceled) than last year"
            chart={{
              colors: [theme.palette.primary.main, theme.palette.error.light],
              categories: shelterAdoptionsCategories,

              series: [
                {
                  type: 'Year',
                  data: [
                    {
                      name: 'Adopted Pets',
                      data: petsAdopted, // Use the global array here
                    },
                    {
                      name: 'Onboarded Users',
                      data: fetchNewUsers, // Use the global array here
                    },
                    {
                      name: 'Active Shelters',
                      data: [], // Use the global array here
                    },
                  ],
                },
              ],
              series2: [
                {
                  type: 'Year',
                  data: [
                    {
                      name: 'Active Shelters',
                      data: activeSheltersData, // Use the global array here
                    },
                  ],
                },
              ],
            }}
            height="365"
          />
          {/* <BookingStatistics
            title="Active Shelters"
            subheader="(+43% Sold | +12% Canceled) than last year"
            chart={{
              colors: [theme.palette.primary.main, theme.palette.error.light],
              categories: shelterAdoptionsCategories,

              series: [
                {
                  type: 'Year',
                  data: [
                    {
                      name: 'Active Shelters',
                      data: activeSheltersData, // Use the global array here
                    },
                  ],
                },
              ],
              series2: [
                {
                  type: 'Year',
                  data: [
                    {
                      name: 'Active Shelters',
                      data: activeSheltersData, // Use the global array here
                    },
                  ],
                },
              ],
            }}
            height="200"
          /> */}
        </Grid>
      </Grid>
    </Container>
  );
}
