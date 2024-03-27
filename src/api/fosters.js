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

export function useGetFosters(account_id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetcherANYML([URL.getFosters, { account_id }]);
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

export async function createFoster(eventData) {
  try {

    const { id, name, country, avatarUrl, addressType, city, state, fullAddress, phoneNumber } = eventData;

    const mockData = {
      shelter_id: "5ee83180f121686526084263",
      new_foster: {
        id,
        name,
        country,
        avatarUrl,
        addressType,
        city,
        state,
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
    const response = await postRequestANYML(URL.createFoster, mockData, config);

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

