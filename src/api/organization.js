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
  const swrKey = accountIds.length ? [endpoints.organization.list, accountIds, page, pageSize] : null;

  const { data, isLoading, error, isValidating } = useSWR(
    swrKey,
    ([url, ids, pg, pgSize]) =>
      postFetcher(url, {
        account_ids: ids,
        page: pg,
        pageSize: pgSize,
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(() => ({
    organizations: data?.results || [],
    totalCount: data?.totalCount || 0,
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
      try {
        parsedData = JSON.parse(data.body);
      } catch (err) {
        console.error('Failed to parse response body', err);
        parsedData = {};
      }
    } else {
      parsedData = data;
    }

    const affiliations = parsedData?.affiliations || [];

    return {
      affiliates: affiliations,
      isLoading,
      error,
      isEmpty: !isLoading && affiliations.length === 0,
    };
  }, [data, error, isLoading]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchOrganizations(query, accountIds) {
  const { organizations, isLoading, error } = useGetOrganizations(accountIds);

  const searchResults = useMemo(() => {
    if (!query) return organizations;

    const lowercasedQuery = query.toLowerCase();

    return organizations.filter((org) =>
      org.primary_account?.shelter_details?.shelter_name_common.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, organizations]);

  return {
    searchResults,
    searchLoading: isLoading,
    searchError: error,
    searchEmpty: !isLoading && searchResults.length === 0,
  };
}