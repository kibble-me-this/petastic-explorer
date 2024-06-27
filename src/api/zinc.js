import useSWR from 'swr';
import { useMemo, useEffect } from 'react';
// utils
import { fetcherProduct, dispatchZincOrder } from 'src/utils/axios-zinc';
import { setCacheFlag, fetcherWithLocalStorage } from './cache';

const ZINC_API_ORDERS = 'https://api.zinc.com/v1/orders';

// const getLocalStorageKey = (userId) => `productsCache-${userId}`;
// const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;
// const getVersionKey = (userId) => localStorage.getItem(`version-${userId}`);
// const setVersionKey = (userId, version) => localStorage.setItem(`version-${userId}`, version);

// const getCacheFlag = (userId) => localStorage.getItem(getCacheFlagKey(userId)) === 'true';
// const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

// Custom fetcher to handle localStorage
// const fetcherWithLocalStorage = async (userId, productIds, version) => {
//   const cachedData = localStorage.getItem(getLocalStorageKey(userId));
//   const cacheFlag = getCacheFlag(userId);
//   const localVersion = getVersionKey(userId);

//   if (cachedData && !cacheFlag && localVersion === version) {
//     return JSON.parse(cachedData);
//   }

//   const data = await fetcherProduct(productIds);
//   localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(data));
//   setCacheFlag(userId, false);
//   setVersionKey(userId, version);
//   return data;
// };

// const getLocalStorageKey = (userId) => `productsCache-${userId}`;

export function useCustomSWR(userId, productIds, version, ...args) {
  return useSWR(productIds, () => fetcherWithLocalStorage(userId, fetcherProduct, [productIds, ...args], version));
}

export function useGetZincProducts(userId, productIds, version) {
  const { data, isLoading, error, isValidating } = useCustomSWR(userId, productIds, version);

  const memoizedValue = useMemo(
    () => ({
      products: data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !(data && data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// Function to update the cache flag when the database changes
export function updateDatabaseChangeFlag(flag) {
  setCacheFlag(flag);
}

// Function to place a Zinc order and send a confirmation email
export async function placeZincOrder(items, shippingAddress, subTotal, webhooks) {
  try {
    const orderResults = await dispatchZincOrder(
      {
        url: ZINC_API_ORDERS,
        method: 'post',
      },
      items,
      shippingAddress,
      subTotal,
      webhooks
    );

    console.log('Order placed successfully:', orderResults);

    return orderResults;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}
