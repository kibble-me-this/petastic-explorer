import { useState, useCallback, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
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
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { useGetOrders } from 'src/api/order';
import { useGetAffiliations } from 'src/api/organization';

// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
import OrderTableRow from './order-table-row';
import OrderTableToolbar from './order-table-toolbar';
import OrderTableFiltersResult from './order-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Ordersss', width: 116 },
  { id: 'name', label: 'Customer' },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'totalQuantity', label: 'Items', width: 120, align: 'center' },
  { id: 'totalAmount', label: 'Price', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListAdminView() {
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { user } = useAuthContext();

  const { affiliates, isLoading: isAffiliatesLoading } = useGetAffiliations(user?.pid || null);

  const [accountId, setAccountId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [accountIds, setAccountIds] = useState([]); // Defined accountIds

  // Update accountId when affiliates change
  useEffect(() => {
    if (affiliates && affiliates.length > 0) {
      setAccountId(affiliates[0].shelterId); // Default to the first affiliate if accountId is not set
    }
  }, [affiliates]);

  // Update accountIds based on affiliates
  useEffect(() => {
    const updatedAccountIds = affiliates
      ? affiliates.map(affiliation => ({
        value: affiliation.shelterId,
        label: affiliation.shelterName,
      }))
      : [];
    setAccountIds(updatedAccountIds);
  }, [affiliates]);

  const { orders, isLoading, error } = useGetOrders(accountId, { enabled: !!accountId });

  useEffect(() => {
    if (orders) {
      setTableData(orders);
    } else {
      setTableData([]);
    }
  }, [orders]);

  // Memoize filtered data
  const dataFiltered = useMemo(() => applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  }), [tableData, table.order, table.orderBy, filters]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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
      totalRows: deleteRows.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(accountId, id)); // Pass accountId and id to the URL
    },
    [router, accountId]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleAccountIdChange = useCallback(
    (event) => {
      setAccountId(event.target.value);
    },
    []
  );

  // Error handling for orders fetching
  if (error) {
    console.error("Failed to fetch orders:", error);
    return <div>Error loading orders. Please try again later.</div>;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Order',
              href: paths.dashboard.order.root,
            },
            { name: 'List' },
          ]}
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
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      (tab.value === 'In Transit' && 'info') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && orders.length}
                    {tab.value === 'completed' &&
                      orders.filter((order) => order.status === 'completed').length}
                    {tab.value === 'pending' &&
                      orders.filter((order) => order.status === 'pending').length}
                    {tab.value === 'cancelled' &&
                      orders.filter((order) => order.status === 'cancelled').length}
                    {tab.value === 'refunded' &&
                      orders.filter((order) => order.status === 'refunded').length}
                    {tab.value === 'In Transit' &&
                      orders.filter((order) => order.status === 'In Transit').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            accountId={accountId}
            onAccountIdChange={handleAccountIdChange}
            accountIds={accountIds}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
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
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        accountId={accountId}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((order) => {
      const orderNumber = order.orderNumber || '';
      const customerName = order.customer?.name || '';
      const customerEmail = order.customer?.email || '';

      return (
        orderNumber.toLowerCase().includes(name.toLowerCase()) ||
        customerName.toLowerCase().includes(name.toLowerCase()) ||
        customerEmail.toLowerCase().includes(name.toLowerCase())
      );
    });
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (startDate && endDate) {
    inputData = inputData.filter(
      (order) =>
        fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
        fTimestamp(order.createdAt) <= fTimestamp(endDate)
    );
  }

  return inputData;
}
