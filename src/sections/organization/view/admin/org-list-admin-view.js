import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import { useTable, getComparator, TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';

// hooks
import { useGetOrganizations } from 'src/api/organization';
// local components
import OrganizationTableRow from './organization-table-row';
import OrganizationTableToolbar from './organization-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Organization' },
  { id: 'createdAt', label: 'Created At', width: 160 },
  { id: 'location', label: 'Location', width: 160 },
  { id: 'petCount', label: 'PetCount', width: 140 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

export default function OrganizationListView() {
  const table = useTable();

  // Track the current page and rows per page
  const [page, setPage] = useState(0); // Page is zero-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Set the default filters
  const [filters, setFilters] = useState({ query: '', roles: [], locations: [] });

  // Fetch organizations with pagination
  const { organizations, totalCount, isLoading, error } = useGetOrganizations([], page + 1, rowsPerPage);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (organizations) {
      setTableData(organizations);
    }
  }, [organizations]);

  const dataFiltered = tableData;

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;
  const notFound = !dataFiltered.length && !isLoading;

  const handleFilters = useCallback(
    (name, value) => {
      setPage(0); // Reset to first page on filter change
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ query: '', roles: [], locations: [] });
  }, []);

  const handleEditRow = (id) => {
    console.log(`Edit row with ID: ${id}`);
  };

  const handleDeleteRow = (id) => {
    console.log(`Delete row with ID: ${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  return (
    <>
      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading="Organization List"
          links={[{ name: 'Organization' }, { name: 'List' }]}
          action={
            <Button
              disabled
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
                  {isLoading
                    ? [...Array(rowsPerPage)].map((_, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                    : dataInPage.map((row) => (
                      <OrganizationTableRow
                        key={row._id}
                        row={row}
                        onEdit={() => handleEditRow(row._id)}
                        onDelete={() => handleDeleteRow(row._id)}
                      />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
