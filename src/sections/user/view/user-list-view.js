import isEqual from 'lodash/isEqual';
import { useEffect, useState, useCallback } from 'react';
// @mui
import { useTheme, styled, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import {
  _userList,
  _roles,
  _usaStates,
  USER_STATUS_OPTIONS,
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
  _topStates,
  _topDogs,
  _topCats,
} from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { bgGradient } from 'src/theme/css';



import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { SeoIllustration } from 'src/assets/illustrations';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';
import AppWelcome from '../../overview/app/app-welcome';
import AppFeatured from '../../overview/app/app-featured';
import AppWidgetSummary from '../../overview/app/app-widget-summary';
import AppCurrentDownload from '../../overview/app/app-current-download';
import AppAreaInstalled from '../../overview/app/app-area-installed';
import BankingBalanceStatistics from '../../overview/banking/banking-balance-statistics';

import AppNewInvoice from '../../overview/app/app-new-invoice';
import AppTopRelated from '../../overview/app/app-top-related';
import AppTopInstalledCountries from '../../overview/app/app-top-installed-countries';
import AppTopAuthors from '../../overview/app/app-top-authors';
import AppWidget from '../../overview/app/app-widget';

import AnalyticsWidgetSummary from '../../overview/analytics/analytics-widget-summary';
import AnalyticsWebsiteVisits from '../../overview/analytics/analytics-website-visits';
import AnalyticsCurrentVisits from '../../overview/analytics/analytics-current-visits';
import AnalyticsConversionRates from '../../overview/analytics/analytics-conversion-rates';
import AnalyticsCurrentSubject from '../../overview/analytics/analytics-current-subject';








// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  // ...bgGradient({
  //   color: alpha(theme.palette.background.default, 0),
  //   imgUrl: '/assets/background/overlay_4.jpg',
  // }),
  position: 'relative',
  overflow: 'hidden',

  // [theme.breakpoints.up('md')]: {
  //   height: `calc(100vh - ${HEADER.H_MAIN_DESKTOP}px)`,
  // },
}));

// ----------------------------------------------------------------------
const apiUrl =
  'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/pt-indxr-pets-api-dev';

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'project', label: 'Project' },
  { id: 'name', label: 'Pet', width: 75 },
  { id: 'petBreed', label: 'Pet Breed', width: 220 },
  { id: 'country', label: 'Country', width: 75 },
  { id: 'state', label: 'State', width: 75 },
  { id: 'city', label: 'City', width: 125 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};



export default function UserListView() {
  const { user } = useMockedUser();

  const theme2 = useTheme();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(_userList);

  const [filters, setFilters] = useState({
    role: [],
    status: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
      if (newValue === 'dog') {
        setPetType('dog');
      } else if (newValue === 'cat') {
        setPetType('cat');
      }
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const [petData, setPetData] = useState([]);
  const [petName, setPetName] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 25;

  const [totalCount, setTotalCount] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const [totalCats, setTotalCats] = useState(0);
  const [totalMaxPets, setTotalMaxPets] = useState(0);
  const [totalMaxDogs, setTotalMaxDogs] = useState(0);
  const [totalMaxCats, setTotalMaxCats] = useState(0);

  const salesGrowth = ((229513 - 164506) / 164506) * 100;
  const dataFeesGrowth = ((15844 - 9711) / 9711) * 100;
  const marketplaceFeesGrowth = ((6742 - 4832) / 4832) * 100;

  const seriesData = [
    0,
    0,
    0,
    0,
    0,
    32000,
    51500,
    86500,
    158500,
    238500,
    338500,
    428503,
    527703, // jan
    618368, // feb
    690606, // mar
    773941, // apr
    863200, // may
    947901,  // jun
    1040302, // jul
    1110102, // aug
    1218600, // sep
    1334205, // oct
    1430381, // nov
    1529011, // dec
    1649801,
    totalMaxPets,
    totalMaxPets,
  ];

  const lastValue = seriesData[seriesData.length - 1]; // December 2024
  const value60DaysAgo = seriesData[seriesData.length - 4]; // September 2024

  const percentageGrowth = ((lastValue - value60DaysAgo) / value60DaysAgo) * 100;
  const subheader = `(+${percentageGrowth.toFixed(1)}%) than last 60 days`;

  console.log(subheader); // Outputs: (+17.4%) than last 60 days


  const [country, setCountry] = useState('US');
  const [petType, setPetType] = useState('');

  const [loading, setLoading] = useState(true);

  const [loadingPetData, setLoadingPetData] = useState(true);
  const [loadingMaxValues, setLoadingMaxValues] = useState(true);

  const [backgroundImage, setBackgroundImage] = useState('');

  const fetchPetData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}?name=${petName}&page=${currentPage}&pageSize=${pageSize}&country=us&states=${filters.role.join(
          ','
        )}&type=${petType}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API response data:', data);

      setPetData(data.pets);
      setTotalCount(data.totalCount);
      setTotalDogs(data.totalDogs);
      setTotalCats(data.totalCats);

      console.log('Pet data:', data.pets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setLoading(false);
    }
  }, [petName, currentPage, pageSize, filters.role, petType]);

  const fetchMaxValues = useCallback(async () => {
    setLoadingMaxValues(true);

    try {
      const response = await fetch(
        'https://jr4plu4hdb.execute-api.us-east-1.amazonaws.com/default/mongo'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setTotalMaxPets(data.totalMaxPets || 0);
      setTotalMaxDogs(data.totalMaxDogs || 0);
      setTotalMaxCats(data.totalMaxCats || 0);

      setLoadingMaxValues(false);
    } catch (error) {
      console.error('Error fetching max values:', error);
      setLoadingMaxValues(false);
    }
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  useEffect(() => {
    fetchPetData();
  }, [fetchPetData, currentPage]);

  useEffect(() => {
    fetchMaxValues();
  }, [fetchMaxValues]);

  const TABS = [
    { value: 'pets', label: 'Marketplace' },
    // { value: 'marketplace', label: 'Marketplace' },
  ];

  const [currentTab, setCurrentTab] = useState('pets');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <StyledRoot
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <Container
          maxWidth={settings.themeStretch ? false : 'lg'}
          sx={{
            marginTop: (theme) => theme.spacing(14),
          }}
        >
          <CustomBreadcrumbs
            heading="The Pet's Network Explorer"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              mb: 2,
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          {currentTab === 'pets' && (
            <>
              {/* Render the App components here */}
              <Grid container spacing={3} mb={2}>

                {/* <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Total Sales"
                    total={844731}
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Opt-In Pets"
                    total={11788}
                    color="info"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Pet Customers"
                    total={1514}
                    color="warning"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Mo. Sales per Pet"
                    total={151.60}
                    color="error"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
                  />
                </Grid> */}

                {/* <Grid xs={12} md={6} lg={8}>
                  <AnalyticsWebsiteVisits
                    title="Network Sales"
                    subheader={`MoM Growth: Sales ${salesGrowth.toFixed(2)}%, Data Fees ${dataFeesGrowth.toFixed(2)}%, Marketplace Fees ${marketplaceFeesGrowth.toFixed(2)}%`}
                    chart={{
                      labels: [
                        '12/01/2023', '01/01/2024', '02/01/2024', '03/01/2024',
                        '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024'
                      ],
                      series: [
                        {
                          name: 'Sales',
                          type: 'column',
                          fill: 'solid',
                          data: [4956, 42340, 85951, 94962, 98278, 124225, 164506, 229513],
                        },
                        {
                          name: 'Data Fees',
                          type: 'area',
                          fill: 'gradient',
                          data: [243, 2073, 4230, 4656, 4819, 7333, 9711, 15844],
                        },
                        {
                          name: 'Marketplace Fees',
                          type: 'line',
                          fill: 'solid',
                          data: [124, 1038, 2102, 2315, 2887, 3649, 4832, 6742],
                        },
                      ],
                    }}
                  />
                </Grid> */}

                {/* <Grid xs={12} md={6} lg={4}>
                  <AnalyticsCurrentVisits
                    title="Sales by State"
                    chart={{
                      series: [
                        { label: 'New York', value: 5435 },
                        { label: 'California', value: 4443 },
                        { label: 'Texas', value: 4344 },
                        { label: 'Other', value: 1443 },
                      ],
                    }}
                  />
                </Grid> */}

                <Grid xs={12} md={4}>
                  <AppWidgetSummary
                    title="Total Pets"
                    percent={((totalMaxPets - 1218600) / 1218600) * 100}
                    total={totalMaxPets}
                    chart={{
                      series: [90665, 72238, 83335, 89259, 84701, 92401, 98630],
                    }}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <AppWidgetSummary
                    title="Total Dogs"
                    percent={((totalMaxDogs - 731693) / 731693) * 100}
                    total={totalMaxDogs}
                    chart={{
                      colors: [theme2.palette.info.light, theme2.palette.info.main],
                      series: [52664, 35193, 45355, 51107, 59366, 59373, 58192],
                    }}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <AppWidgetSummary
                    title="Total Cats"
                    percent={((totalMaxCats - 484214) / 484214) * 100}
                    total={totalMaxCats}
                    chart={{
                      colors: [theme2.palette.warning.light, theme2.palette.warning.main],
                      series: [38001, 37045, 37980, 38152, 30637, 39827, 40438],
                    }}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                  <AppAreaInstalled
                    title="The Pet's Network (population growth)"
                    subheader={subheader}
                    chart={{
                      categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                        'Jan',
                        'Feb',
                        'Mar25'
                      ],
                      series: [
                        {
                          year: '2023',
                          data: [
                            {
                              name: 'Total Pets',
                              data: seriesData,
                            },
                          ],
                        },
                      ],
                    }}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                  <AppCurrentDownload
                    title="Species Demographic"
                    chart={{
                      series: [
                        { label: 'Dog', value: totalMaxDogs },
                        { label: 'Cat', value: totalMaxCats },
                      ],
                    }}
                    loading={loadingMaxValues}
                  />
                </Grid>



                <Grid xs={12} md={6} lg={4}>
                  <AppTopRelated
                    title="Top US Pet States"
                    list={_appRelated}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                  <AppTopAuthors
                    title="Top Dog Breeds"
                    list={_topDogs}
                    loading={loadingMaxValues}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                  <AppTopAuthors
                    title="Top Cat Breeds"
                    list={_topCats}
                    loading={loadingMaxValues}
                  />
                </Grid>
              </Grid>

              <Card
                sx={{
                  mb: 10,
                }}
              >
                <Tabs
                  value={filters.status}
                  onChange={handleFilterStatus}
                  sx={{
                    px: 2.5,
                    boxShadow: (theme) =>
                      `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                  }}
                >
                  {STATUS_OPTIONS.map((tab) => (
                    <Tab
                      key={tab.value}
                      iconPosition="end"
                      value={tab.value}
                      label={tab.label}
                      disabled={tab.value === 'disabledValue'}
                      icon={
                        (tab.value === 'all' || tab.value === 'dog' || tab.value === 'cat') &&
                          loading ? (
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                        ) : (
                          <Label
                            variant={
                              ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                              'soft'
                            }
                            color={
                              (tab.value === 'active' && 'success') ||
                              (tab.value === 'pending' && 'warning') ||
                              (tab.value === 'banned' && 'error') ||
                              'default'
                            }
                          >
                            {(tab.value === 'all' && totalMaxPets) ||
                              (tab.value === 'dog' && totalMaxDogs) ||
                              (tab.value === 'cat' && totalMaxCats)}
                          </Label>
                        )
                      }
                    />
                  ))}
                </Tabs>

                <UserTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  roleOptions={_usaStates.map((state) => state.abbreviation)}
                  petName={petName}
                  setPetName={setPetName}
                  fetchPetData={fetchPetData}
                />

                {canReset && (
                  <UserTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    onResetFilters={handleResetFilters}
                    results={totalCount}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                  <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                    action={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={confirm.onTrue}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    }
                  />

                  <Scrollbar>
                    <div style={{ height: '100%', width: '100%' }}>
                      <Table
                        size={table.dense ? 'small' : 'medium'}
                        sx={{ minWidth: 960 }}
                      >
                        <TableHeadCustom
                          order={table.order}
                          orderBy={table.orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={tableData.length}
                          numSelected={table.selected.length}
                          onSort={table.onSort}
                          onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                              checked,
                              tableData.map((row) => row.id)
                            )
                          }
                        />

                        <TableBody>
                          {petData.length === 0
                            ? Array.from({ length: 25 }, (_, index) => (
                              <TableRow hover key={index}>
                                <TableCell padding="checkbox">
                                  <Skeleton
                                    variant="circular"
                                    width={16}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={16}
                                  />
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ px: 1 }}
                                >
                                  <Skeleton
                                    variant="rectangular"
                                    width={40}
                                    height={16}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                            : petData.map((row) => (
                              <UserTableRow
                                key={row.id}
                                row={row}
                                selected={table.selected.includes(
                                  row.id
                                )}
                                loading={loading}
                                onSelectRow={() =>
                                  table.onSelectRow(row.id)
                                }
                                onDeleteRow={() =>
                                  handleDeleteRow(row.id)
                                }
                                onEditRow={() =>
                                  handleEditRow(row.id)
                                }
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                  count={totalCount}
                  page={currentPage - 1}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                  dense={table.dense}
                  onChangeDense={table.onChangeDense}
                />
              </Card>
            </>
          )}

          {currentTab === 'marketplace' && (
            <>
              {/* Render the Analytics components here */}
              <Grid container spacing={3} mb={2}>
                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Total Sales"
                    total={844731}
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Opt-In Pets"
                    total={11788}
                    color="info"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Pet Customers"
                    total={1514}
                    color="warning"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                    title="Mo. Sales per Pet"
                    total={151.60}
                    color="error"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                  <AnalyticsWebsiteVisits
                    title="Network Sales"
                    subheader={`MoM Growth: Sales ${salesGrowth.toFixed(2)}%, Data Fees ${dataFeesGrowth.toFixed(2)}%, Marketplace Fees ${marketplaceFeesGrowth.toFixed(2)}%`}
                    chart={{
                      labels: [
                        '12/01/2023', '01/01/2024', '02/01/2024', '03/01/2024',
                        '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024'
                      ],
                      series: [
                        {
                          name: 'Sales',
                          type: 'column',
                          fill: 'solid',
                          data: [4956, 42340, 85951, 94962, 98278, 124225, 164506, 229513],
                        },
                        {
                          name: 'Data Fees',
                          type: 'area',
                          fill: 'gradient',
                          data: [243, 2073, 4230, 4656, 4819, 7333, 9711, 15844],
                        },
                        {
                          name: 'Marketplace Fees',
                          type: 'line',
                          fill: 'solid',
                          data: [124, 1038, 2102, 2315, 2887, 3649, 4832, 6742],
                        },
                      ],
                    }}
                  />
                </Grid>




                <Grid xs={12} md={6} lg={4}>
                  <AnalyticsCurrentVisits
                    title="Sales by State"
                    chart={{
                      series: [
                        { label: 'New York', value: 5435 },
                        { label: 'California', value: 4443 },
                        { label: 'Texas', value: 4344 },
                        { label: 'Other', value: 1443 },
                      ],
                    }}
                  />
                </Grid>

                {/* <Grid xs={12} md={6} lg={8}>
                  <AnalyticsConversionRates
                    title="Conversion Rates"
                    subheader="(+43%) than last year"
                    chart={{
                      series: [
                        { label: 'Italy', value: 400 },
                        { label: 'Japan', value: 430 },
                        { label: 'China', value: 448 },
                        { label: 'Canada', value: 470 },
                        { label: 'France', value: 540 },
                        { label: 'Germany', value: 580 },
                        { label: 'South Korea', value: 690 },
                        { label: 'Netherlands', value: 1100 },
                        { label: 'United States', value: 1200 },
                        { label: 'United Kingdom', value: 1380 },
                      ],
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                  <AnalyticsCurrentSubject
                    title="Current Subject"
                    chart={{
                      categories: [
                        'English',
                        'History',
                        'Physics',
                        'Geography',
                        'Chinese',
                        'Math',
                      ],
                      series: [
                        { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                        { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                        { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                      ],
                    }}
                  />
                </Grid> */}
              </Grid>
            </>
          )}
        </Container>

        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content={
            <>
              Are you sure want to delete <strong>{table.selected.length}</strong> items?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRows();
                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </StyledRoot>
    </>
  );
}



// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  console.log(inputData); // Add this line to log filtered data

  return inputData;
}
