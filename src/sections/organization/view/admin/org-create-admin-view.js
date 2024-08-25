// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import OrganizationNewEditForm from './organization-new-edit-form';

// ----------------------------------------------------------------------

export default function OrganizationCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create a new organization"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root,
                    },
                    {
                        name: 'Organizations',
                        href: paths.dashboard.organization.root,
                    },
                    { name: 'New organization' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <OrganizationNewEditForm />
        </Container>
    );
}
