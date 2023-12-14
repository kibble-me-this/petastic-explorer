import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
//
import PetCard from './pet-card';

// ----------------------------------------------------------------------

export default function PetCardList({ users }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {users.map((user) => (
        <PetCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

PetCardList.propTypes = {
  users: PropTypes.array,
};
