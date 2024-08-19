import { useEffect, useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useLocalStorage(key, initialState) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = getStorage(key);

    if (restored) {
      setState((prevValue) => ({
        ...prevValue,
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue) => {
      setState((prevValue) => {
        setStorage(key, {
          ...prevValue,
          ...updateValue,
        });

        return {
          ...prevValue,
          ...updateValue,
        };
      });
    },
    [key]
  );

  const update = useCallback(
    (name, updateValue) => {
      updateState({
        [name]: updateValue,
      });
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = (key) => {
  let value = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export function useProductCache(accountId) {
  const storageKey = `product_cache_${accountId}`;

  // Initialize state with cached data or empty
  const [cache, setCache] = useState(() => {
    try {
      const cachedData = window.localStorage.getItem(storageKey);
      return cachedData ? JSON.parse(cachedData) : { products: [], lastFetched: 0 };
    } catch (error) {
      console.error('Error reading local storage:', error);
      return { products: [], lastFetched: 0 };
    }
  });

  // Function to update the cache
  const updateProductCache = useCallback((newCache) => {
    try {
      setCache(newCache);
      window.localStorage.setItem(storageKey, JSON.stringify(newCache));
    } catch (error) {
      console.error('Error setting local storage:', error);
    }
  }, [storageKey]);

  // Cache validation
  const isCacheValid = useCallback(() => {
    const cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return Date.now() - cache.lastFetched < cacheExpiration;
  }, [cache]);

  return { cache, updateProductCache, isCacheValid };
}
