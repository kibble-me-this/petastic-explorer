import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// components
import { useTable, getComparator, emptyRows, TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useGetOrganizations, useGetAffiliations } from 'src/api/organization';
// local components
import OrganizationTableRow from './organization-table-row'; // create this
import OrganizationTableToolbar from './organization-table-toolbar'; // create this
import OrganizationTableFiltersResult from './organization-table-filters-result'; // create this

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Organization' },
  { id: 'createdAt', label: 'Created At', width: 160 },
  { id: 'role', label: 'Role', width: 160 },
  { id: 'location', label: 'Location', width: 140 },
  { id: '', width: 88 },
];

export default function OrganizationListView() {
  const { user } = useAuthContext();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({ query: '', roles: [], locations: [] });
  const { affiliates } = useGetAffiliations(user.id);
  const accountIds = affiliates.map((aff) => aff.shelterId);
  const { organizations, isLoading, error } = useGetOrganizations(accountIds);

  useEffect(() => {
    if (organizations) {
      setTableData(organizations);
    }
  }, [organizations]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;
  const notFound = !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ query: '', roles: [], locations: [] });
  }, []);

  // Define the handleEditRow and handleDeleteRow functions
  const handleEditRow = (id) => {
    console.log(`Edit row with ID: ${id}`);
  };

  const handleDeleteRow = (id) => {
    console.log(`Delete row with ID: ${id}`);
  };

  return (
    <>
      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading="Organization List"
          links={[{ name: 'Organization' }, { name: 'List' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.org.admin.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Organization
            </Button>
          }
        />

        <Card>
          <OrganizationTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
          />

          <TableContainer>
            <Scrollbar>
              <Table>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />
                <TableBody>
                  {isLoading
                    ? [...Array(table.rowsPerPage)].map((_, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                    : dataInPage.map((row) => (
                      <OrganizationTableRow
                        key={row.id}
                        row={row}
                        onEdit={() => handleEditRow(row.id)}
                        onDelete={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { query, roles, locations } = filters;
  const stabilizedData = inputData.map((el, index) => [el, index]);

  stabilizedData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedData.map((el) => el[0]);

  // Apply filters (query, roles, locations, etc.)
  if (query) {
    filteredData = filteredData.filter((org) =>
      org.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (roles.length) {
    filteredData = filteredData.filter((org) => roles.includes(org.role));
  }

  if (locations.length) {
    filteredData = filteredData.filter((org) =>
      org.location.some((location) => locations.includes(location))
    );
  }

  return filteredData;
}
