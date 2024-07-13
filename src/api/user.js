import { useMemo, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.user;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetUsers() {
  const { data, error } = useSWR([URL.list, {}], fetcherANYML, options);

  const memoizedValue = useMemo(() => ({
    users: data?.users || [],
    statusCounts: data?.statusCounts || {},
    isLoading: !data && !error,
    error,
    isEmpty: !data?.users?.length,
  }), [data, error]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUserRoles({ email, id }) {
  const params = email ? { email } : { id };
  const { data, error } = useSWR([URL.roles, params], fetcherANYML, options);

  const memoizedValue = useMemo(() => ({
    roles: [data?.role] || [],
    isLoading: !data && !error,
    error,
    isEmpty: !data?.role,
  }), [data, error]);

  return memoizedValue;
}