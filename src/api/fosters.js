import { useMemo, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.fosters;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// export function useGetFosters(account_id = '5ee83180f121686526084263') {
//   const { data, error } = useSWR([URL, account_id], fetcherANYML);

//   const memoizedValue = useMemo(() => {
//     const processedFosters = data?.fosters.map((foster) => ({
//       ...foster,
//     }));

//     return {
//       fosters: processedFosters || [],
//       isLoading: !data && !error,
//       error,
//       isValidating: !data && !error,
//       isEmpty: !data?.fosters?.length,
//     };
//   }, [data, error]);

//   return memoizedValue;
// }

const mockAddress =
{
  id: 'mockId',
  name: 'Carlos Herrera',
  phoneNumber: '310-880-8673',
  address: '2900 NE 7Th Ave Unit 2006',
  city: 'Miami',
  state: 'FL',
  country: 'US',
  zip: '33137',
  fullAddress: '2900 NE 7TH Ave Unit 2006, Miami, FL, US, 33137',
  addressType: 'HQ',
  primary: true,
};

export function useGetFosters(account_id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (account_id === 'mockId') {
          // If account_id is 'mockId', use the mock address directly
          response = { fosters: [mockAddress] };
        } else {
          // Otherwise, make the endpoint call
          response = await fetcherANYML([URL.getFosters, { account_id }]);
        }
        setData(response);
      } catch (error) {
        setFetchError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [account_id]);

  const memoizedValue = useMemo(() => ({
    fosters: data?.fosters || [],
    isLoading,
    error: fetchError,
    isEmpty: !isLoading && !data?.fosters?.length,
  }), [data, isLoading, fetchError]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createFoster(account_id, eventData) {
  try {

    const { id, name, country, avatarUrl, addressType, address, city, state, zip, phoneNumber } = eventData;

    const fullAddress = `${address}, ${city}, ${state} ${zip}`;

    const newAddress = {
      shelter_id: account_id,
      new_foster: {
        id,
        name,
        country,
        avatarUrl,
        addressType,
        address,
        city,
        state,
        zip,
        fullAddress,
        phoneNumber
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Call the backend API to create a new foster
    const response = await postRequestANYML(URL.createFoster, newAddress, config);

    // Extract the newly created foster from the response
    const newFoster = response.data;

    // Update the local data with the new foster
    // mutate(
    //   URL.createFoster,
    //   (currentData) => ({
    //     ...currentData,
    //     fosters: [...currentData.fosters, mockData],
    //   }),
    //   false
    // );

    // Optionally, return the new foster data for further processing
    return newFoster;
  } catch (error) {
    console.error('Error creating foster:', error);
    throw error; // Rethrow the error for error handling
  }
}

// ----------------------------------------------------------------------

// export async function updateFoster(eventData) {
//   try {
//     // Call the backend API to update the foster
//     await axios.put(`${FOSTERS_URL}/${eventData.id}`, eventData);

//     // Update the local data with the updated foster
//     mutate(
//       FOSTERS_URL,
//       (currentData) => ({
//         ...currentData,
//         fosters: currentData.fosters.map((foster) =>
//           foster.id === eventData.id ? { ...foster, ...eventData } : foster
//         ),
//       }),
//       false
//     );
//   } catch (error) {
//     console.error('Error updating foster:', error);
//     throw error; // Rethrow the error for error handling
//   }
// }

// ----------------------------------------------------------------------

// export async function deleteFoster(eventId) {
//   try {
//     // Call the backend API to delete the foster
//     await axios.delete(`${FOSTERS_URL}/${eventId}`);

//     // Update the local data by removing the deleted foster
//     mutate(
//       FOSTERS_URL,
//       (currentData) => ({
//         ...currentData,
//         fosters: currentData.fosters.filter((foster) => foster.id !== eventId),
//       }),
//       false
//     );
//   } catch (error) {
//     console.error('Error deleting foster:', error);
//     throw error; // Rethrow the error for error handling
//   }
// }

