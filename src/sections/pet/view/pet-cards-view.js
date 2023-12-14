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
import { getShelterAccountId } from '../../blog/_mock';

export default function PetCardsView() {
  const settings = useSettingsContext();
  const [apiPets, setApiPets] = useState([]);
  const [filteredAndSortedPets, setFilteredAndSortedPets] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    setIsApiLoading(true);

    // if (userMetadata) {
    const account_id = '5fe93b084e01702187737636'; // carlos@petastic.com
    // const account_id = getShelterAccountId(user.publicAddress);

    const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${account_id}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setApiPets(data.pets);

        setIsApiLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user pets:', error);
        setIsApiLoading(false);
      });
    // }
  }, [user.publicAddress]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="My Pets"
        links={[
          {
            name: 'Dashboard',
            // href: paths.dashboard.root
          },
          {
            name: 'Pet',
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
        <PetCardList users={apiPets} isLoading={isApiLoading} />
      )}
    </Container>
  );
}
