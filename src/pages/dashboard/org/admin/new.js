import { Helmet } from 'react-helmet-async';
// sections
import { OrgCreateAdminView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function JobCreatePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Create a new organization</title>
            </Helmet>

            <OrgCreateAdminView />
        </>
    );
}
