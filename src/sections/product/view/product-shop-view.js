import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useCallback, useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
// routes
import { paths } from 'src/routes/paths';
// _mock
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from 'src/_mock';
// api
import { useGetProducts, useSearchProducts, useGetProductDetails } from 'src/api/product';
// components
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import { useCheckoutContext } from '../../checkout/context';
import CartIcon from '../common/cart-icon';
import ProductList from '../product-list';
import ProductSort from '../product-sort';
import ProductSearch from '../product-search';
import ProductFilters from '../product-filters';
import ProductFiltersResult from '../product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView({ userId }) {
  const settings = useSettingsContext();
  const checkout = useCheckoutContext();

  useEffect(() => {
    if (userId) {
      checkout.onUpdateAccountID(userId);
    }
  }, [userId, checkout]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9);
  const [loadedPages, setLoadedPages] = useState({}); // Store already loaded pages
  const [selectedProductId, setSelectedProductId] = useState(null); // Track selected product from search

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const {
    products,
    productsLoading,
    productsError,
    productsEmpty,
    totalPages,
  } = useGetProductDetails(userId, currentPage, limit);

  const { searchResults, searchLoading, searchError } = useSearchProducts('', userId); // Use search without query to access all products

  useEffect(() => {
    if (products && products.length > 0) {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;

      setLoadedPages((prev) => ({
        ...prev,
        [currentPage]: products.slice(startIndex, endIndex), // Correctly slice products for the current page
      }));
    }
  }, [products, currentPage, limit]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const dataFiltered = applyFilter({
    inputData: loadedPages[currentPage] || [],
    filters,
    sortBy,
    selectedProductId, // Pass selectedProductId to applyFilter
    searchResults, // Pass all products to applyFilter for fetching single product
  });

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
    if (inputValue === '') {
      setSelectedProductId(null); // Clear selected product
      setFilters(defaultFilters); // Reset all filters
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedProductId(null); // Clear selected product on reset
  }, []);

  const handleSelectProduct = useCallback((productId) => {
    setSelectedProductId(productId);
    setFilters(defaultFilters); // Optionally reset filters when selecting a product
  }, []);

  const renderFilters = (
    <Stack spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-end', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }}>
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        onSelectProduct={handleSelectProduct} // Pass handleSelectProduct
        loading={searchLoading}
        hrefItem={(id) => paths.product.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={['all', ...PRODUCT_CATEGORY_OPTIONS]}
        />
        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult filters={filters} onFilters={handleFilters} canReset={canReset} onResetFilters={handleResetFilters} results={dataFiltered.length} />
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>Shop</Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList
        key={`page-${currentPage}-${selectedProductId}`}  // Add selectedProductId to force re-render
        products={dataFiltered} // Handle either single or multiple products
        loading={productsLoading && !loadedPages[currentPage]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        selectedProductId={selectedProductId} // Pass selected product ID
      />
    </Container>
  );
}

ProductShopView.propTypes = {
  userId: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy, selectedProductId, searchResults }) {
  let filteredData = inputData;

  // Check if a specific product has been selected by product_id
  if (selectedProductId) {
    // Check if the selected product is already in the current inputData
    const selectedProduct = searchResults.find((product) => product.product_id === selectedProductId);

    // If found, render only the selected product
    if (selectedProduct) {
      filteredData = [selectedProduct];
    }
  } else {
    // Apply other filters like gender, category, priceRange, etc.
    const { gender, category, colors, priceRange, rating } = filters;

    if (gender.length) {
      filteredData = filteredData.filter((product) => gender.includes(product.gender));
    }

    if (category !== 'all') {
      filteredData = filteredData.filter((product) => product.category === category);
    }

    if (colors.length) {
      filteredData = filteredData.filter((product) =>
        product.colors.some((color) => colors.includes(color))
      );
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 200) {
      filteredData = filteredData.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);
    }

    if (rating) {
      filteredData = filteredData.filter((product) => {
        const convertRating = (value) => {
          if (value === 'up4Star') return 4;
          if (value === 'up3Star') return 3;
          if (value === 'up2Star') return 2;
          return 1;
        };
        return product.totalRatings > convertRating(rating);
      });
    }
  }

  // Apply sorting logic
  if (sortBy === 'featured') {
    filteredData = orderBy(filteredData, ['totalSold'], ['desc']);
  } else if (sortBy === 'newest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  } else if (sortBy === 'priceDesc') {
    filteredData = orderBy(filteredData, ['price'], ['desc']);
  } else if (sortBy === 'priceAsc') {
    filteredData = orderBy(filteredData, ['price'], ['asc']);
  }

  return filteredData;
}
