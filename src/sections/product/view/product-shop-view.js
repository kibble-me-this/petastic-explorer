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

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9);
  const [loadedPages, setLoadedPages] = useState({}); // Store already loaded pages

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

  const { searchResults, searchLoading, searchError, searchEmpty } = useSearchProducts(debouncedQuery, userId);


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
    inputData: loadedPages[currentPage] || [], // Ensure we're using the correct slice of products for the current page
    filters,
    sortBy,
  });



  const canReset = !isEqual(defaultFilters, filters);
  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-end', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }}>
      <ProductSearch query={debouncedQuery} results={searchResults} onSearch={handleSearch} loading={searchLoading} hrefItem={(id) => paths.product.details(id)} />

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
        key={`page-${currentPage}`}  // Add this key prop to force re-render
        products={dataFiltered} // Use paginatedData instead of dataFiltered
        loading={productsLoading && !loadedPages[currentPage]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}

ProductShopView.propTypes = {
  userId: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];
  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    inputData = orderBy(inputData, ['totalSold'], ['desc']);
  } else if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  } else if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['price'], ['desc']);
  } else if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['price'], ['asc']);
  }

  // FILTERS
  if (gender.length) {
    inputData = inputData.filter((product) => gender.includes(product.gender));
  }

  if (category !== 'all') {
    inputData = inputData.filter((product) => product.category === category);
  }

  if (colors.length) {
    inputData = inputData.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter((product) => product.price >= min && product.price <= max);
  }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
