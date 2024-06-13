import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { OrgDetailsView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function OrgDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Organization Details</title>
      </Helmet>

      <OrgDetailsView id={`${id}`} />
    </>
  );
}
