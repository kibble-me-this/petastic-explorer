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

// Custom fetcher using postRequestANYML
const postFetcher = async (url, data) => postRequestANYML(url, data);

// ----------------------------------------------------------------------

export function useGetOrganizations(accountIds) {
  // Ensure accountIds is an array
  const idsArray = Array.isArray(accountIds) ? accountIds : [accountIds];

  const { data, isLoading, error, isValidating } = useSWR(
    idsArray.length ? [URL.list, idsArray] : null,
    ([url, ids]) => postFetcher(url, { account_ids: ids }),
    options
  );

  const memoizedValue = useMemo(() => ({
    organizations: data || [], // Adjust based on the expected data structure
    isLoading,
    error,
    isValidating,
  }), [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function getShelterAccountId(user) {
  if (!user || !user.email) {
    return { affiliations: [] }; // Return empty affiliations array if user or email is missing
  }

  const userObject = useMockUser.find((u) => u.email === user.email);

  if (userObject) {
    return { affiliations: userObject.affiliations };
  }

  return { affiliations: [] }; // Return empty affiliations array if no matching user object is found
}

export function getShelterAccountId1(user) {
  // Search for the object in the array with the matching publicAddress
  const userObject = emailPublicAddressArray1.find((u) => u.publicAddress === user.email);

  // If a matching user object is found, return its shelterAccountId; otherwise, return null
  return userObject ? userObject.shelterAccountId : null;
}

export const emailPublicAddressArray1 = [
  {
    publicAddress: 'fb9b34e032a94707e114023c44698716bef222d36310b48c7af02e5240c2b612',
    email: 'carlos+fetch@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '45bc1ecbfd50a5777f5c4dfe41e09e64d0cef8ab2930218d78cb4d00e4702bf1',
    email: 'carlos+haven@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '416fb87e70e19cc52fd9ff28ce43cc8c3f3af33feae03a4d7ac73d6f6e9f36a1',
    email: 'carlos@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: 'e43f2104635c62f96227ce5dc039d4cd28cc3b94f34b3935f26d972376c00c54',
    email: 'nicolec@animalhaven.org',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'kristink@animalhaven.org',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'adena+today@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: 'e505362fd476dd644fd6b16ac1b4437626d1c2e6fb1f6de08adf03505cb1bb18',
    email: 'adena@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
];