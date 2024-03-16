import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, postRequest, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.fosters;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetFosters() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    // Process the data if needed
    const processedFosters = data?.fosters.map((foster) => ({
      ...foster,
      textColor: foster.color,
    }));

    return {
      fosters: processedFosters || [],
      isLoading,
      error,
      isValidating,
      isEmpty: !isLoading && !data?.fosters.length,
    };
  }, [data?.fosters, isLoading, error, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createFoster(eventData) {
  try {
    // Call the backend API to create a new foster
    const response = await axios.post(URL, eventData);

    // Extract the newly created foster from the response
    const newFoster = response.data;

    // Update the local data with the new foster
    mutate(
      FOSTERS_URL,
      (currentData) => ({
        ...currentData,
        fosters: [...currentData.fosters, newFoster],
      }),
      false
    );

    // Optionally, return the new foster data for further processing
    return newFoster;
  } catch (error) {
    console.error('Error creating foster:', error);
    throw error; // Rethrow the error for error handling
  }
}

// ----------------------------------------------------------------------

export async function updateFoster(eventData) {
  try {
    // Call the backend API to update the foster
    await axios.put(`${FOSTERS_URL}/${eventData.id}`, eventData);

    // Update the local data with the updated foster
    mutate(
      FOSTERS_URL,
      (currentData) => ({
        ...currentData,
        fosters: currentData.fosters.map((foster) =>
          foster.id === eventData.id ? { ...foster, ...eventData } : foster
        ),
      }),
      false
    );
  } catch (error) {
    console.error('Error updating foster:', error);
    throw error; // Rethrow the error for error handling
  }
}

// ----------------------------------------------------------------------

export async function deleteFoster(eventId) {
  try {
    // Call the backend API to delete the foster
    await axios.delete(`${FOSTERS_URL}/${eventId}`);

    // Update the local data by removing the deleted foster
    mutate(
      FOSTERS_URL,
      (currentData) => ({
        ...currentData,
        fosters: currentData.fosters.filter((foster) => foster.id !== eventId),
      }),
      false
    );
  } catch (error) {
    console.error('Error deleting foster:', error);
    throw error; // Rethrow the error for error handling
  }
}

