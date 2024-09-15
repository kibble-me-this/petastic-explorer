import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useMemo } from 'react';
// @mui
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
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { useTable, getComparator, emptyRows, TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedAction, TablePaginationCustom } from 'src/components/table';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetProductDetails, updateProduct } from 'src/api/product';
import { useGetAffiliations } from 'src/api/organization';
// components
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductTableRow from '../../product-table-row';
import ProductTableToolbar from '../../product-table-toolbar';
import ProductTableFiltersResult from '../../product-table-filters-result';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product' },
  { id: 'createdAt', label: 'Create at', width: 160 },
  { id: 'inventoryType', label: 'Stock', width: 160 },
  { id: 'price', label: 'Price', width: 140 },
  { id: 'publish', label: 'Publish', width: 110 },
  { id: '', width: 88 },
];

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters = {
  name: '',
  publish: [],
  stock: [],
};

// ----------------------------------------------------------------------

export default function ProductListAdminView() {
  const router = useRouter();

  const { user } = useAuthContext();

  const table = useTable();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [accountId, setAccountId] = useState('');

  // Fetch affiliations using the useGetAffiliations hook
  const { affiliates, isLoading: isAffiliatesLoading } = useGetAffiliations(user?.pid || null);

  const accountIds = useMemo(() =>
    affiliates ? affiliates.map(affiliation => ({
      value: affiliation.shelterId,
      label: affiliation.shelterName,
    })) : [],
    [affiliates]
  );

  // Fetch products based on selected accountId (only if accountId is selected)
  const { products, productsLoading, productsEmpty } = useGetProductDetails(accountId);

  // Clear previous data and load new products when accountId changes
  useEffect(() => {
    if (accountId) {
      setTableData([]);  // Clear previous table data
    }
  }, [accountId]);

  useEffect(() => {
    if (products && products.length) {
      setTableData(products);
    }
  }, [products]);

  const dataFiltered = useMemo(() => applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  }), [tableData, table.order, table.orderBy, filters]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || productsEmpty;

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

  const handleEnableProduct = useCallback(
    async (productId, currentEnabled) => {
      try {
        // Toggle the enabled state
        const newEnabled = !currentEnabled;

        // Assuming you already have access to `accountId` and you want to enable/disable the product
        await updateProduct(productId, accountId, { enabled: newEnabled });

        // Optionally, update the local table data or refetch the updated products
        const updatedData = tableData.map((row) =>
          row.product_id === productId ? { ...row, enabled: newEnabled } : row
        );
        setTableData(updatedData);
      } catch (error) {
        console.error(`Error toggling enabled state for product ${productId}:`, error);
      }
    },
    [accountId, tableData]
  );

  const handleDeleteRow = useCallback(
    async (productId) => {
      try {
        // Assuming you already have access to `account_id`
        await updateProduct(accountId, productId);

        // Filter the table data to remove the deleted product
        const deleteRow = tableData.filter((row) => row.product_id !== productId);
        setTableData(deleteRow);

        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
      }
    },
    [dataInPage.length, accountId, table, tableData]
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
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleAccountIdChange = useCallback((newAccountId) => {
    setAccountId(newAccountId); // Only set when user chooses an account
    table.onResetPage(); // Reset the table pagination
  }, [table]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Product',
              href: paths.dashboard.product.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProductTableToolbar
            filters={filters}
            onFilters={handleFilters}
            accountId={accountId}
            onAccountIdChange={handleAccountIdChange}
            publishOptions={PUBLISH_OPTIONS}
            accountIds={accountIds}
          />

          {/* Only render the table if an accountId is selected */}
          {accountId && (
            <>
              {canReset && (
                <ProductTableFiltersResult
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
                      {productsLoading ? (
                        [...Array(table.rowsPerPage)].map((_, index) => (
                          <TableSkeleton key={index} sx={{ height: denseHeight }} />
                        ))
                      ) : (
                        <>
                          {dataFiltered
                            .slice(
                              table.page * table.rowsPerPage,
                              table.page * table.rowsPerPage + table.rowsPerPage
                            )
                            .map((row) => (
                              <ProductTableRow
                                key={row.id}
                                row={row}
                                selected={table.selected.includes(row.id)}
                                onSelectRow={() => table.onSelectRow(row.id)}
                                onDeleteRow={() => handleDeleteRow(row.product_id)}
                                onEditRow={() => handleEditRow(row.id)}
                                onEnableRow={() => handleEnableProduct(row.product_id, row.enabled)}
                                onViewRow={() => handleViewRow(row.id)}
                              />
                            ))}
                        </>
                      )}

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
            </>
          )}
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
  const { name, stock, publish } = filters;

  let filteredData = [...inputData];

  // Apply comparator for sorting
  filteredData.sort(comparator);

  // Apply filters by name
  if (name) {
    filteredData = filteredData.filter(
      (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // Apply stock filter
  if (stock.length) {
    filteredData = filteredData.filter((product) => stock.includes(product.inventoryType));
  }

  // Apply publish filter
  if (publish.length) {
    filteredData = filteredData.filter((product) => publish.includes(product.publish));
  }

  return filteredData;
}
