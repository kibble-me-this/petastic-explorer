import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios_';

// ----------------------------------------------------------------------

export function useGetPosts() {
  const URL = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log("useGetPosts data: ",data);
  console.log("useGetPosts isLoading: ",isLoading);
  console.log("useGetPosts error: ",error);
  console.log("useGetPosts isValidating: ",isValidating);


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

  console.log("useGetPosts memoizedValue: ",memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPost(title) {
  console.log("useGetPost title: ",title);

  const URL = title ? [endpoints.post.details, { params: { title } }] : null;

  console.log("useGetPost URL: ",URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log("useGetPost data: ",data);
  console.log("useGetPost isLoading: ",isLoading);
  console.log("useGetPost error: ",error);
  console.log("useGetPost isValidating: ",isValidating);

  const matchingPost = data?.posts.find(post => post.slug === title);

  console.log("useGetPost matchingPost: ",matchingPost);


  const memoizedValue = useMemo(
    () => ({
      post: matchingPost,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [matchingPost, error, isLoading, isValidating]
  );

  console.log("useGetPost memoizedValue: ",memoizedValue);

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
