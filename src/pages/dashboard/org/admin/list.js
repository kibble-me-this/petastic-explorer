import { Helmet } from 'react-helmet-async';
// sections
import { OrgListAdminView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Org List</title>
      </Helmet>

      <OrgListAdminView />
    </>
  );
}
