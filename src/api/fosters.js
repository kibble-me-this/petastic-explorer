import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetFosters() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const fosters = data?.fosters.map((foster) => ({
      ...foster,
      textColor: foster.color,
    }));

    return {
      fosters: fosters || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.fosters.length,
    };
  }, [data?.fosters, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createFoster(eventData) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.post(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const fosters = [...currentData.fosters, eventData];

      return {
        ...currentData,
        fosters,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateFoster(eventData) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.put(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const fosters = currentData.fosters.map((foster) =>
        foster.id === eventData.id ? { ...foster, ...eventData } : foster
      );

      return {
        ...currentData,
        fosters,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteFoster(eventId) {
  /**
   * Work on server
   */
  // const data = { eventId };
  // await axios.patch(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const fosters = currentData.fosters.filter((foster) => foster.id !== eventId);

      return {
        ...currentData,
        fosters,
      };
    },
    false
  );
}
