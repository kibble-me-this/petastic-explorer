import { useCallback, useState, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// routes
import { paths } from 'src/routes/paths';
// auth
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { getShelterAccountId } from '../blog/_mock';

// ----------------------------------------------------------------------

export default function PermissionDeniedView() {
  const settings = useSettingsContext();

  const [isApiLoading, setIsApiLoading] = useState(true);
  const [apiPets, setApiPets] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [apiShelters, setApiShelters] = useState([]);

  const { user, logout } = useAuthContext();

  const [role, setRole] = useState('admin');

  const handleChangeRole = useCallback((event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  }, []);

  useEffect(() => {
    setIsApiLoading(true);

    // if (userMetadata) {
    const shelterAccountIds = getShelterAccountId(user.publicAddress);

    console.log('shelterAccountIds: ', shelterAccountIds);

    // Create an array to store promises for fetching data
    const fetchPromises = shelterAccountIds.map((shelterAccountId) => {
      const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${shelterAccountId}`;

      console.log('in here');
      console.log('apiUrl:', apiUrl);

      // Fetch data from the API and return the promise
      return fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response
        })
        .then((responseData) => {
          console.log('responseData: ', responseData);

          // Check if responseData has the expected structure
          if (responseData && responseData.pets && Array.isArray(responseData.pets)) {
            // Inside your useEffect, update how you set the state
            const shelterData = {
              commonName: responseData.shelter_name_common,
              numPets: responseData.pets.length,
              pets: responseData.pets,
            };
            return shelterData;
          } // else {
          // Handle unexpected response structure
          console.error('Unexpected API response structure:', responseData);
          // Handle this case as needed, e.g., set default values or show an error message.
          return null;
          // }
        })
        .catch((error) => {
          console.error('Error fetching user pets:', error);
          return null;
        });
    });

    console.log('fetchPromises: ', fetchPromises);

    // Use Promise.all to wait for all API calls to complete
    Promise.all(fetchPromises)
      .then((results) => {
        // Filter out any null values (responses that had errors)
        const validShelters = results.filter((shelterData) => shelterData !== null);

        // Set the shelter links in your component state
        setApiShelters(validShelters); // Update the state with the shelter links
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
        heading="Permission Denied"
        links={[
          {
            name: 'Dashboard',
            // href: paths.dashboard.root,
          },
          {
            name: 'Permission Denied',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ToggleButtonGroup
        exclusive
        value={role}
        size="small"
        onChange={handleChangeRole}
        sx={{ mb: 5 }}
      >
        <ToggleButton value="admin" aria-label="admin role">
          isAdmin
        </ToggleButton>

        <ToggleButton value="user" aria-label="user role">
          isUser
        </ToggleButton>
      </ToggleButtonGroup>
      {/* <RoleBasedGuard hasContent roles={[role]} sx={{ py: 10 }}>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {[...Array(8)].map((_, index) => (
            <Card key={index}>
              <CardHeader title={`Card ${index + 1}`} subheader="Proin viverra ligula" />

              <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
                Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo,
                rhoncus ut, imperdiet a, venenatis vitae, justo. Vestibulum fringilla pede sit amet
                augue.
              </Typography>
            </Card>
          ))}
        </Box>
      </RoleBasedGuard> */}
      <RoleBasedGuard hasContent roles={[role]} sx={{ py: 10 }}>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {console.log('apiShelters: ', apiShelters)}
          {apiShelters.map((shelterData, index) => (
            <Card key={index}>
              <CardHeader
                title={`Shelter Name: ${shelterData.commonName}`}
                subheader={`Number of Pets: ${shelterData.numPets}`}
              />

              <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
                {/* Display individual pet information here */}
                {/* For example: */}
                {Array.isArray(shelterData.pets) ? (
                  shelterData.pets.map((pet, petIndex) => (
                    <div key={petIndex}>
                      {pet.name}: {pet.breed}
                    </div>
                  ))
                ) : (
                  <div>No pets available for this shelter.</div>
                )}
              </Typography>
            </Card>
          ))}
        </Box>
      </RoleBasedGuard>
    </Container>
  );
}
