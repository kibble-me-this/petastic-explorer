import { Helmet } from 'react-helmet-async';
// sections
import { OrgListView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Org List</title>
      </Helmet>

      <OrgListView />
    </>
  );
}
