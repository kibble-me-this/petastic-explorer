import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import ProductItem from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

export default function ProductList({ products, loading, currentPage, totalPages, onPageChange, selectedProductId, ...other }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = () => {
    if (loading) {
      return renderSkeleton;
    }

    if (products.length === 1) {
      return <ProductItem key={products[0].id} product={products[0]} />;
    }

    return products.map((product) => (
      <ProductItem key={product.id} product={product} />
    ));
  };

  return (
    <>
      <Box
        key={selectedProductId || `page-${currentPage}`} // Ensure re-render on selected product change
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        {...other}
      >
        {renderList()}
      </Box>

      {totalPages > 1 && products.length > 1 && ( // Pagination only when there are multiple pages and products
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          siblingCount={1} // Control the number of pages shown around the current page
          boundaryCount={1} // Control the number of pages shown at the beginning and end of the list
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

ProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  selectedProductId: PropTypes.string, // Added prop to handle selected product
};
