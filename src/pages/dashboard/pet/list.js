import { Helmet } from 'react-helmet-async';
// sections
import { PetListView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet List</title>
      </Helmet>

      <PetListView />
    </>
  );
}
