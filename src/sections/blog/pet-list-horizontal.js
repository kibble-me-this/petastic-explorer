import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import { PetItemSkeleton } from './pet-skeleton';
import PetItemHorizontal from './pet-item-horizontal';
import PetCard from './pet-card';

// ----------------------------------------------------------------------

export default function PostListHorizontal({
  posts,
  loading,
  filteredAndSortedPets,
  updateFilteredAndSortedPets,
}) {
  console.log('PostListHorizontal', posts);

  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <PetItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post) => (
        <PetCard
          key={post.id}
          user={post}
          filteredAndSortedPets={filteredAndSortedPets}
          updateFilteredAndSortedPets={updateFilteredAndSortedPets}
        />
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
          md: 'repeat(3, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
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

PostListHorizontal.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
  filteredAndSortedPets: PropTypes.array,
  updateFilteredAndSortedPets: PropTypes.func,
};
