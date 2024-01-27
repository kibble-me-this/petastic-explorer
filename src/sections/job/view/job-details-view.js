import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// _mock
import { _jobs, JOB_PUBLISH_OPTIONS, JOB_DETAILS_TABS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

//
import JobDetailsToolbar from '../job-details-toolbar';
import JobDetailsContent from '../job-details-content';
import JobDetailsCandidates from '../job-details-candidates';
import PetListHorizontal from '../../blog/pet-list-horizontal';

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function JobDetailsView({ id }) {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const currentJob = _jobs.filter((job) => job.id === id)[0];

  const [publish, setPublish] = useState(currentJob?.publish);

  const [currentTab, setCurrentTab] = useState('candidates');

  const [isApiLoading, setIsApiLoading] = useState(true);

  const [apiPets, setApiPets] = useState([]);

  const [ownerName, setOwnerName] = useState('');

  const [filteredAndSortedPets, setFilteredAndSortedPets] = useState([]);

  const updateFilteredAndSortedPets = (newPets) => {
    console.log('Called updateFilteredAndSortedPets');
    setFilteredAndSortedPets(newPets);
    handleFilterPublish(null, 'adopted');
  };

  const dataFiltered = applyFilter({
    inputData: apiPets,
    filters,
    sortBy,
  });

  useEffect(() => {
    setIsApiLoading(true);

    // if (userMetadata) {
    const shelterAccountId = id; // '5ee83180f121686526084263'; // getShelterAccountId1(user.publicAddress);
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
    // }, [filters, sortBy, user.publicAddress]);
  }, [id, filters, sortBy]);
  // }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  const renderTabs = (
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
  );

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

      <JobDetailsToolbar
        backLink={paths.dashboard.org.root}
        editLink={paths.dashboard.org.edit(`${currentJob?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {/* {currentTab === 'content' && <JobDetailsContent job={currentJob} />} */}

      {/* {currentTab === 'candidates' && <JobDetailsCandidates candidates={currentJob?.candidates} />} */}

      <PetListHorizontal
        posts={dataFiltered}
        loading={isApiLoading}
        filteredAndSortedPets={filteredAndSortedPets}
        updateFilteredAndSortedPets={updateFilteredAndSortedPets}
      />
    </Container>
  );
}

JobDetailsView.propTypes = {
  id: PropTypes.string,
};

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
