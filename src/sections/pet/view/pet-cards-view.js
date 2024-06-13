import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content';

// auth
import { useAuthContext } from 'src/auth/hooks';
import PetCardList from '../pet-card-list';
import { getShelterAccountId } from '../../../api/organization';
import { getPetsByAccountId } from '../../../api/petastic-api';

export default function PetCardsView() {
  const settings = useSettingsContext();
  const [apiPets, setApiPets] = useState([]);
  const [filteredAndSortedPets, setFilteredAndSortedPets] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { user } = useAuthContext();

  // Usage example in a useEffect
  useEffect(() => {
    setIsApiLoading(true);
    getPetsByAccountId(user.email)
      .then((data) => {
        // Handle the fetched data here
        console.log('Fetched pets:', data);
        setApiPets(data.pets);
        setIsApiLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error fetching pets:', error);
        setIsApiLoading(false);
      });
  }, [user]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="My Pets"
        links={[
          // {
          //   name: 'Dashboard',
          //   // href: paths.dashboard.root
          // },
          {
            name: 'My Pets',
            // href: paths.dashboard.user.root
          },
          { name: 'Cards' },
        ]}
        action={
          <Button
            disabled
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Pet
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {apiPets.length === 0 ? (
        <EmptyContent filled title="No pets found." />
      ) : (
        <PetCardList key={apiPets.id} users={apiPets} isLoading={isApiLoading} />
      )}
    </Container>
  );
}
