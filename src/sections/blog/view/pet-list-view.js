import orderBy from 'lodash/orderBy';
import { useCallback, useState, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// _mock
import { POST_SORT_OPTIONS } from 'src/_mock';
// api
import { useGetPosts, useSearchPosts, useGetPets } from 'src/api/blog';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
// import PostSort from '../post-sort';
// import PostSearch from '../post-search';
import PetListHorizontal from '../pet-list-horizontal';

import { getShelterAccountId1 } from '../_mock';

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function PetListView() {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const { user, logout } = useAuthContext();
  console.log('user', user);
  // console.log('logout', logout);

  // const { posts, postsLoading } = useGetPosts();

  // const { shelterAccountId, setShelterAccountId } = useState('5ee83180f121686526084263');

  const [apiPets, setApiPets] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(true);
  // const [fetchError, setFetchError] = useState(null); // Rename the variable here

  const [filteredAndSortedPets, setFilteredAndSortedPets] = useState([]);
  // Define the callback function to update filteredAndSortedPets
  const updateFilteredAndSortedPets = (newPets) => {
    console.log('Called updateFilteredAndSortedPets');
    setFilteredAndSortedPets(newPets);
    handleFilterPublish(null, 'adopted');
  };

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyFilter({
    inputData: apiPets,
    filters,
    sortBy,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  useEffect(() => {
    setIsApiLoading(true);

    // if (userMetadata) {
    const shelterAccountId = getShelterAccountId1(user.publicAddress);
    // const shelterAccountId = getShelterAccountId(
    //   'fb9b34e032a94707e114023c44698716bef222d36310b48c7af02e5240c2b612'
    // );
    const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${shelterAccountId}`;

    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the API response contains an array of pets
        setApiPets(data.pets); // Update the state with the fetched data
        console.log(data.pets);

        setOwnerName(data.shelter_name_common);
        // setIsApiLoading(false); // Set loading to false after data is fetched

        // Apply filtering and sorting logic to apiPets and store the result in filteredAndSortedPets
        const filteredAndSortedData = applyFilter({
          inputData: data.pets, // Use the fetched data
          filters,
          sortBy,
        });
        setFilteredAndSortedPets(filteredAndSortedData);
        setIsApiLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user pets:', error);
        setIsApiLoading(false);
      });
    // }
  }, [filters, sortBy, user.publicAddress]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Our Pets - ${ownerName}`}
        links={[
          {
            name: 'Dashboard',
            // href: paths.dashboard.root,
          },
          {
            name: 'Pets',
            // href: paths.dashboard.post.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            disabled
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Pet
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/** 
      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title) => paths.dashboard.post.details(title)}
        />

        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>
*/}
      <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'dog', 'cat', 'adopted'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || 'default'}
              >
                {tab === 'all' && apiPets.length}

                {tab === 'dog' && apiPets.filter((post) => post.type.includes('Dog')).length}

                {tab === 'cat' && apiPets.filter((post) => post.type.includes('Cat')).length}

                {tab === 'adopted' && apiPets.filter((post) => post.status === 'adopted').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PetListHorizontal
        posts={dataFiltered}
        loading={isApiLoading}
        filteredAndSortedPets={filteredAndSortedPets}
        updateFilteredAndSortedPets={updateFilteredAndSortedPets}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  const { publish } = filters;

  console.log('Calling applyFilter filters: ', publish);
  console.log('Calling applyFilter inpuData: ', inputData);

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  if (publish !== 'all') {
    const filteredData = [];

    inputData.forEach((post) => {
      // Extract the type from the post
      const type = post.type;
      const status = post.status;

      console.log('Calling applyFilter inpuData.type: ', type);
      console.log('Calling applyFilter inpuData.status: ', status);

      // Check if the post is related to a dog
      if (
        type.includes(
          'Anymal::Carnivora::Canidae::Canis::Canis Lupus Familiars::Domesticated Dog:Dog'
        ) &&
        publish === 'dog'
      ) {
        // Check if the post status does not include 'adopted'
        if (typeof status === 'undefined' || status.includes('adoptable')) {
          filteredData.push(post);
        }
      }

      // Check if the post is related to a cat
      if (
        type.includes('Anymal::Carnivora::Felidae::Felis::Felis Catus::Domesticated Cat::Cat') &&
        publish === 'cat'
      ) {
        // Check if the post status does not include 'adopted'
        if (typeof status === 'undefined' || status.includes('adoptable')) {
          filteredData.push(post);
        }
      }

      // Check if the post is adopted
      if (typeof status !== 'undefined' && status.includes('adopted') && publish === 'adopted') {
        filteredData.push(post);
      }
    });

    // Set inputData to the filteredData
    inputData = filteredData;
  }

  return inputData;
};
