import { useMemo, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';

import { useMockUser } from 'src/hooks/use-mocked-user';

// ----------------------------------------------------------------------

const URL = endpoints.organization;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const postFetcher = async (url, data) => postRequestANYML(url, data);

// ----------------------------------------------------------------------

export function useGetOrganizations(accountIds = [], page = 1, pageSize = 10) {
  // Build the SWR key for caching
  const swrKey = accountIds.length ? [endpoints.organization.list, accountIds, page, pageSize] : null;

  // SWR hook to fetch data using postFetcher
  const { data, isLoading, error, isValidating } = useSWR(
    swrKey,
    ([url, ids, pg, pgSize]) =>
      postFetcher(url, {
        account_ids: ids,    // Pass account IDs as array
        page: pg,            // Pagination page
        pageSize: pgSize,    // Number of items per page
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Memoize the result to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => ({
    organizations: data?.results || [],     // Use the `results` from Lambda response
    totalCount: data?.totalCount || 0,      // Use the `totalCount` from Lambda response
    isLoading,
    error,
    isValidating,
  }), [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAffiliations(pid) {
  const { data, isLoading, error } = useSWR(
    pid ? [endpoints.organization.affiliates, { pid }] : null,
    fetcherANYML
  );

  const memoizedValue = useMemo(() => {
    let parsedData;
    if (data && typeof data.body === 'string') {
      // Parse the body if it's a JSON string (as it would be from AWS API Gateway)
      try {
        parsedData = JSON.parse(data.body);
      } catch (err) {
        console.error('Failed to parse response body', err);
        parsedData = {};
      }
    } else {
      parsedData = data;
    }

    const affiliations = parsedData?.affiliations || []; // Extract the affiliations array

    return {
      affiliates: affiliations, // Pass the correct array to affiliates
      isLoading,
      error,
      isEmpty: !isLoading && affiliations.length === 0,
    };
  }, [data, error, isLoading]);

  return memoizedValue;
}


// ----------------------------------------------------------------------

// export function getShelterAccountId(user) {
//   if (!user || !user.email) {
//     return { affiliations: [] };
//   }

//   const userObject = useMockUser.find((u) => u.email === user.email);

//   if (userObject) {
//     return { affiliations: userObject.affiliations };
//   }

//   return { affiliations: [] };
// }

// ----------------------------------------------------------------------

export function useSearchOrganizations(query, accountIds) {
  // Use `useGetOrganizations` to get the organization data, which will be cached by SWR
  const { organizations, isLoading, error } = useGetOrganizations(accountIds);

  // Filter organizations based on the search query
  const searchResults = useMemo(() => {
    if (!query) return organizations;

    const lowercasedQuery = query.toLowerCase();

    return organizations.filter((org) =>
      org.primary_account?.shelter_details?.shelter_name_common.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, organizations]);

  // Return the filtered search results
  return {
    searchResults,
    searchLoading: isLoading,
    searchError: error,
    searchEmpty: !isLoading && searchResults.length === 0,
  };
}