import { Helmet } from 'react-helmet-async';
// sections
import { JobCreateView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function JobCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new job</title>
      </Helmet>

      <JobCreateView />
    </>
  );
}
