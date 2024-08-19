import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import ProductItem from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

export default function ProductList({ products, loading, currentPage, totalPages, onPageChange, ...other }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </>
  );

  return (
    <>
      <Box
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
        {loading ? renderSkeleton : renderList}
      </Box>

      {totalPages > 1 && (
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
};
