import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPosts() {
  const URL = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log('useGetPosts executed');

  const memoizedValue = useMemo(
    () => ({
      posts: data?.posts || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.posts.length,
    }),
    [data?.posts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPost(title) {
  const URL = title ? [endpoints.post.details, { params: { title } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      post: data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.post, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title) {
  const URL = title ? [endpoints.post.latest, { params: { title } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPets(shelterAccountId) {
  const [apiPets, setApiPets] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); // Rename the variable here

  const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${shelterAccountId}`;

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setApiPets(data.pets);
      setOwnerName(data.shelter_name_common);
      setIsApiLoading(false);
    } catch (error) {
      console.error('Error fetching user pets:', error);
      setFetchError(error); // Update the renamed variable here
      setIsApiLoading(false);
    }
  };

  // Log the initial execution
  console.log('useGetPets executed');

  // Call fetchData directly when the hook is executed
  fetchData();

  const memoizedValue = useMemo(
    () => ({
      pets: apiPets,
      ownerName,
      petsLoading: isApiLoading,
      petsError: fetchError, // Update the variable here
      petsEmpty: !isApiLoading && apiPets.length === 0,
    }),
    [apiPets, ownerName, isApiLoading, fetchError] // Update the dependency here
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query) {
  const URL = query ? [endpoints.post.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
