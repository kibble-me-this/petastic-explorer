import { Helmet } from 'react-helmet-async';
// sections
import { UserProfileView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet Profile</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
