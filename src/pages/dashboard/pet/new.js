import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new pet</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
