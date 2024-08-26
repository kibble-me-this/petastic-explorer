import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// _mock
import {
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from 'src/_mock';

import { useGetOrganizations, useGetAffiliations } from 'src/api/organization';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import OrganizationList from '../org-list';
import OrganizationSort from '../org-sort';
import OrganizationSearch from '../org-search';
import OrganizationFilters from '../org-filters';
import OrganizationFiltersResult from '../org-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  roles: [],
  locations: [],
  benefits: [],
  experience: 'all',
  employmentTypes: [],
};

// ----------------------------------------------------------------------

export default function OrganizationListView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  // Fetch affiliations based on user PID
  const { affiliates, isLoading: isAffiliatesLoading } = useGetAffiliations(user?.pid || null);

  // State to manage the filters, sorting, and pagination
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12); // Fixed page size

  // State for search query and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);

  const openFilters = useBoolean();

  // Only call useGetOrganizations after affiliates are loaded
  const accountIds = !isAffiliatesLoading ? affiliates.map(aff => aff.shelterId) : [];

  // Fetch organizations based on account IDs, page, and pageSize
  const { organizations, totalCount, isLoading: isOrgLoading, error: orgError, isValidating } =
    useGetOrganizations(accountIds.length > 0 ? accountIds : [], page, pageSize);

  // Filtered data after applying filters and search
  const dataFiltered = applyFilter({
    inputData: organizations,
    filters,
    sortBy,
    searchQuery,
  });

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);  // Update the search query in state
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Organization' },
          { name: 'List' },
        ]}
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
        {/* Render filters and search */}
        <Stack
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <OrganizationSearch
            query={searchQuery}              // Pass the current search query
            onSearch={handleSearch}           // Pass the search handler
            accountIds={accountIds}           // Pass the relevant account IDs
            hrefItem={(id) => `/organization/${id}`}  // Navigation path
          />

          <Stack direction="row" spacing={1} flexShrink={0}>
            <OrganizationFilters
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              filters={filters}
              onFilters={handleFilters}
              canReset={canReset}
              onResetFilters={handleResetFilters}
              locationOptions={countries}
              roleOptions={_roles}
              benefitOptions={JOB_BENEFIT_OPTIONS.map((option) => option.label)}
              experienceOptions={['all', ...JOB_EXPERIENCE_OPTIONS.map((option) => option.label)]}
              employmentTypeOptions={JOB_EMPLOYMENT_TYPE_OPTIONS.map((option) => option.label)}
            />

            <OrganizationSort sort={sortBy} onSort={handleSortBy} sortOptions={JOB_SORT_OPTIONS} />
          </Stack>
        </Stack>

        {canReset && (
          <OrganizationFiltersResult
            filters={filters}
            onResetFilters={handleResetFilters}
            canReset={canReset}
            onFilters={handleFilters}
            results={dataFiltered.length}
          />
        )}
      </Stack>

      {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

      {/* Render organizations */}
      <OrganizationList
        orgs={dataFiltered}
        isApiLoading={isOrgLoading || isAffiliatesLoading} // Account for both loading states
        page={page}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, searchQuery }) => {
  const { employmentTypes, experience, roles, locations, benefits } = filters;

  let filteredData = inputData;

  // SEARCH
  if (searchQuery) {
    filteredData = filteredData.filter(org =>
      org.primary_account?.shelter_details?.shelter_name_common
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }

  // FILTERS
  if (employmentTypes.length) {
    filteredData = filteredData.filter(org =>
      org.employmentTypes.some(item => employmentTypes.includes(item))
    );
  }

  if (experience !== 'all') {
    filteredData = filteredData.filter(org => org.experience === experience);
  }

  if (roles.length) {
    filteredData = filteredData.filter(org => roles.includes(org.role));
  }

  if (locations.length) {
    filteredData = filteredData.filter(org =>
      org.locations.some(item => locations.includes(item))
    );
  }

  if (benefits.length) {
    filteredData = filteredData.filter(org => org.benefits.some(item => benefits.includes(item)));
  }

  // SORT BY
  if (sortBy === 'latest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    filteredData = orderBy(filteredData, ['totalViews'], ['desc']);
  }

  return filteredData;
};
