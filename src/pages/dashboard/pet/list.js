import { Helmet } from 'react-helmet-async';
// sections
import { UserListView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet List</title>
      </Helmet>

      <UserListView />
    </>
  );
}
