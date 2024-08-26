import { useMemo, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcherANYML, postRequestANYML, patchRequestANYML, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.user;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetUsers({ page = 1, pageSize = 10, email = null }) {
  const queryParams = email ? { email } : { page, pageSize };

  const queryUrl = email ? `${URL.list}?email=${email}` : URL.list;

  const { data, error } = useSWR([queryUrl, queryParams], (fetchUrl, fetchParams) =>
    fetcherANYML(fetchUrl, fetchParams), options);

  const memoizedValue = useMemo(() => {
    if (email) {
      return {
        users: data?.user ? [data.user] : [],
        statusCounts: data?.statusCounts || {},
        totalCount: data?.totalCount || 0,
        isLoading: !data && !error,
        error,
        isEmpty: !data?.user,
      };
    }

    return {
      users: data?.users || [],
      statusCounts: data?.statusCounts || {},
      totalCount: data?.totalCount || 0,
      isLoading: !data && !error,
      error,
      isEmpty: !data?.users?.length,
    };
  }, [data, error, email]);

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

// ----------------------------------------------------------------------

export async function updateUser(accountId, updateFields) {

  const url = `${URL.update}?pid=${accountId}`;

  const config = {};

  const response = await patchRequestANYML(url, updateFields, config);
  await mutate([URL.list, {}]);
  return response;
}

// ----------------------------------------------------------------------

export async function createUser(userData) {
  const url = URL.create;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await postRequestANYML(url, userData, config);
  await mutate([URL.list, {}]);
  return response;
}