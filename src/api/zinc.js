import useSWR from 'swr';
import { useMemo, useEffect } from 'react';
// utils
import { fetcherProduct, dispatchZincOrder, fetcher, endpoints } from 'src/utils/axios-zinc';
import emailjs from '@emailjs/browser';

const ZINC_API_ORDERS = 'https://api.zinc.com/v1/orders';

const getLocalStorageKey = (userId) => `productsCache-${userId}`;
const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;

const getCacheFlag = (userId) => localStorage.getItem(getCacheFlagKey(userId)) === 'true';
const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

// Custom fetcher to handle localStorage
const fetcherWithLocalStorage = async (userId, productIds) => {
  const cachedData = localStorage.getItem(getLocalStorageKey(userId));
  const cacheFlag = getCacheFlag(userId);

  if (cachedData && !cacheFlag) {
    return JSON.parse(cachedData);
  }

  const data = await fetcherProduct(productIds);
  localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(data));
  setCacheFlag(userId, false);
  return data;
};

// Custom SWR hook with localStorage support
export function useCustomSWR(userId, productIds, ...args) {
  return useSWR(productIds, () => fetcherWithLocalStorage(userId, productIds, ...args));
}

// Hook to get products by product IDs
export function useGetZincProducts(userId, productIds) {
  const { data, isLoading, error, isValidating } = useCustomSWR(userId, productIds);

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
