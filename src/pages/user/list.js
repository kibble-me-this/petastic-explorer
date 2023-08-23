import { Helmet } from 'react-helmet-async';
// sections
import { UserListView } from 'src/sections/user/view';
import MapView from 'src/sections/_examples/extra/map-view'; // Import the MapView component

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet Explorer</title>
      </Helmet>

      <UserListView />
      <MapView />
    </>
  );
}
