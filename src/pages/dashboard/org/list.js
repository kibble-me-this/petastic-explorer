import { Helmet } from 'react-helmet-async';
// sections
import { OrgListView } from 'src/sections/org/view';

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
