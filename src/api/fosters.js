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

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    () => fetcherANYML([URL.getFosters, { account_id }]),
    options
  );

  const memoizedValue = useMemo(() => ({
    fosters: data?.fosters || [],
    isLoading,
    error,
    isEmpty: !isLoading && !data?.fosters?.length,
  }), [data, error, isLoading]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createFoster(account_id, eventData) {

  console.log("calling createFoster account_id", account_id);
  console.log("calling createFoster eventData", eventData);

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

    console.log("calling createFoster newAddress ", newAddress);


    // Call the backend API to create a new foster
    const response = await postRequestANYML(URL.createFoster, newAddress, config);

    // Extract the newly created foster from the response
    const newFoster = newAddress.new_foster;

    // Update the local data with the new foster
    mutate(
      URL,
      (currentData) => {
        console.log('Current Data:', currentData); // Add this line to log currentData
        return {
          ...currentData,
          fosters: [...(currentData?.fosters || []), newFoster],
        };
      },
      false
    );

    // No need to return newFoster if it's not used elsewhere
  } catch (error) {
    console.error('Error creating foster:', error);
    throw error;
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

