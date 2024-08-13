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

export function useGetOrganizations(accountIds, page = 1, pageSize = 10) {
  const idsArray = Array.isArray(accountIds) ? accountIds : [accountIds];

  const { data, isLoading, error, isValidating } = useSWR(
    idsArray.length ? [endpoints.organization.list, idsArray, page, pageSize] : null,
    ([url, ids, pg, pgSize]) => postFetcher(url, { account_ids: ids, page: pg, pageSize: pgSize }),
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

  const memoizedValue = useMemo(() => ({
    affiliates: data?.affiliatePids || [],
    isLoading,
    error,
    isEmpty: !isLoading && !data?.affiliatePids?.length,
  }), [data, error, isLoading]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function getShelterAccountId(user) {
  if (!user || !user.email) {
    return { affiliations: [] };
  }

  const userObject = useMockUser.find((u) => u.email === user.email);

  if (userObject) {
    return { affiliations: userObject.affiliations };
  }

  return { affiliations: [] };
}