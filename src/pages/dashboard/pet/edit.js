import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { UserEditView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Pet Edit</title>
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
