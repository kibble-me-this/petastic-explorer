import isEqual from 'lodash/isEqual';
import { useEffect, useState, useCallback } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
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


// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _roles, _usaStates, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
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
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, 0),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
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
  { id: 'name', label: 'Pet' },
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

// ----------------------------------------------------------------------

export default function UserListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(_userList);

  const [filters, setFilters] = useState({
    role: [],
    status: 'all', // Initialize the status filter as 'all'
    // other filters...
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
  // const [resultCount, setResultCount] = useState(0); // New state for result count
  const pageSize = 25; // Number of items per page
  
  const [totalCount, setTotalCount] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const [totalCats, setTotalCats] = useState(0);
  const [totalMaxPets, setTotalMaxPets] = useState(0);
  const [totalMaxDogs, setTotalMaxDogs] = useState(0);
  const [totalMaxCats, setTotalMaxCats] = useState(0);

  const [country, setCountry] = useState('US');
  const [petType, setPetType] = useState('');

  const [loading, setLoading] = useState(true);


  const fetchPetData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching data

    try {
      const response = await fetch(
        `${apiUrl}?name=${petName}&page=${currentPage}&pageSize=${pageSize}&country=US&states=${filters.role.join(',')}&type=${petType}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPetData(data.pets);
      setTotalCount(data.totalCount); 
      setTotalDogs(data.totalDogs); 
      setTotalCats(data.totalCats); 
      setTotalMaxPets(data.totalMaxPets); 
      setTotalMaxDogs(data.totalMaxDogs); 
      setTotalMaxCats(data.totalMaxCats); 

      console.log(data.pets);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setLoading(false); // Set loading to false if there's an error
    }
  }, [petName, currentPage, pageSize, filters.role, petType]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1); // Add +1 to match the API's page numbering
  };

  useEffect(() => {
    fetchPetData();
  }, [fetchPetData, currentPage]);

  return (
    <>    
    <StyledRoot>

      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          marginTop: (theme) => theme.spacing(14), // Adjust the spacing value as needed
        }}
      >
        {' '}
        <CustomBreadcrumbs
          heading="Explorer"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>


          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
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
                  tab.value === 'all' && loading ? (
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                  ) : (
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && totalMaxPets}
                    {tab.value === '' &&
                      _userList.filter((user) => user.status === 'active').length}

                    {tab.value === 'pending' &&
                      _userList.filter((user) => user.status === 'pending').length}
                    {tab.value === 'banned' &&
                      _userList.filter((user) => user.status === 'banned').length}
                    {tab.value === 'rejected' &&
                      _userList.filter((user) => user.status === 'rejected').length}
                  </Label>
                   )
                }
              />
            ))}
          </Tabs>
           

          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_usaStates.map((state) => state.abbreviation)}
            petName={petName} // Pass petName prop
            setPetName={setPetName} // Pass setPetName prop
            fetchPetData={fetchPetData} // Pass fetchPetData prop
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={totalCount} // {dataFiltered.length}
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
                {loading ? (
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
                ) : (
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    {console.log(petData.length)} {/* Add this line */}
                    {petData.map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)} // Update this based on your data structure
                        onSelectRow={() => table.onSelectRow(row.id)} // Update this based on your data structure
                        onDeleteRow={() => handleDeleteRow(row.id)} // Update this based on your data structure
                        onEditRow={() => handleEditRow(row.id)} // Update this based on your data structure
                      />
                    ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, petData.length)} // Update this
                    />
                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
                )}
              </div>
            </Scrollbar>
            
          </TableContainer>

          <TablePaginationCustom
            count={totalCount} // Use the resultCount state
            page={currentPage - 1} // Update the page number to match 0-based indexing
            rowsPerPage={table.rowsPerPage}
            onPageChange={handlePageChange} // Pass the handler for page change
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
       
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
