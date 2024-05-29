import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useCallback, useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// auth
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import {
  _jobs,
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from 'src/_mock';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { getShelterAccountId } from '../../blog/_mock';

//
import JobList from '../job-list';
import JobSort from '../job-sort';
import JobSearch from '../job-search';
import JobFilters from '../job-filters';
import JobFiltersResult from '../job-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  roles: [],
  locations: [],
  benefits: [],
  experience: 'all',
  employmentTypes: [],
};

// ----------------------------------------------------------------------

export default function OrgListView() {
  const settings = useSettingsContext();

  const [isApiLoading, setIsApiLoading] = useState(true);

  const [apiShelters, setApiShelters] = useState([]);

  const { user, logout } = useAuthContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    // inputData: _jobs,
    inputData: apiShelters,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const numberOfSkeletonItems = 5;

  useEffect(() => {
    setIsApiLoading(true);

    const shelterAccountIds = getShelterAccountId(user);
    console.log('shelterAccountIds: ', shelterAccountIds);

    const fetchShelterData = (shelterAccountId) => {
      const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${shelterAccountId}`;

      console.log('in here');
      console.log('apiUrl:', apiUrl);

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
              shelterAccountId,
              commonName: responseData.shelter_name_common,
              numPets: responseData.pets.length,
              pets: responseData.pets,
            };
            return shelterData;
          }

          // Handle unexpected response structure
          console.error('Unexpected API response structure:', responseData);
          // Handle this case as needed, e.g., set default values or show an error message.
          return null;
        })
        .catch((error) => {
          console.error('Error fetching user pets:', error);
          return null;
        });
    };

    const shelterAccountIdsArray = Array.isArray(shelterAccountIds)
      ? shelterAccountIds
      : [shelterAccountIds];

    const fetchPromises = shelterAccountIdsArray.map(fetchShelterData);

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
  }, [user]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = _jobs.filter(
          (job) => job.title.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <JobSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.job.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <JobFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          locationOptions={countries}
          roleOptions={_roles}
          benefitOptions={JOB_BENEFIT_OPTIONS.map((option) => option.label)}
          experienceOptions={['all', ...JOB_EXPERIENCE_OPTIONS.map((option) => option.label)]}
          employmentTypeOptions={JOB_EMPLOYMENT_TYPE_OPTIONS.map((option) => option.label)}
        />

        <JobSort sort={sortBy} onSort={handleSortBy} sortOptions={JOB_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <JobFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Orgs"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'My Orgs',
            href: paths.dashboard.org.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            disabled
            component={RouterLink}
            href={paths.dashboard.org.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Org
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {/* {renderFilters} */}

        {canReset && renderResults}
      </Stack>

      <JobList jobs={isApiLoading ? [] : dataFiltered} isApiLoading={isApiLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  // const { employmentTypes, experience, roles, locations, benefits } = filters;

  console.log('JobsListView applyFilter inputData: ', inputData);

  // SORT BY
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
  // }

  // // FILTERS
  // if (employmentTypes.length) {
  //   inputData = inputData.filter((job) =>
  //     job.employmentTypes.some((item) => employmentTypes.includes(item))
  //   );
  // }

  // if (experience !== 'all') {
  //   inputData = inputData.filter((job) => job.experience === experience);
  // }

  // if (roles.length) {
  //   inputData = inputData.filter((job) => roles.includes(job.role));
  // }

  // if (locations.length) {
  //   inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
  // }

  // if (benefits.length) {
  //   inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
  // }

  return inputData;
};
