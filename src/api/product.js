import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcherProduct, fetcherOrder, fetcher, endpoints } from 'src/utils/axios';

const zincApiEndpoint = 'https://api.zinc.com/v1/orders';
const zincApiKey = '494887CF5BB27A2600581C3A';

// ----------------------------------------------------------------------

// export function useGetProducts() {
//   const URL = endpoints.product.list;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       products: data?.products || [],
//       productsLoading: isLoading,
//       productsError: error,
//       productsValidating: isValidating,
//       productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.products, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export function useCustomSWR(productIds, ...args) {
  return useSWR(productIds, () => fetcherProduct(productIds, ...args));
}

export function useGetProducts() {
  const productIds = [
    'B01IO8YVX6',
    // 'B006HSSBIW',
    // 'B0002DGL26',
    // 'B09158614F',
    // 'B00B9G3ZJM',
    // 'B07121B839',
    // 'B01M8JT6FT',
    // 'B09LVV5MY6',
    // 'B07MM2N1NL',
    // 'B072FVZ1Z9',
    // 'B08NJJQ1KW',
    // 'B0C1BW323L',
    // 'B0C6D588VS',
    // 'B0BHN7K52L',
    // 'B01KTNNJWI',
    // 'B000634CK0',
    // 'B09NWFJR7P',
    'B07SD8SQWK',
    // 'B01DLS2EX8',
    // 'B01DLS2F0A',
    // 'B01DLS2EYW',
    // 'B08615R732',
    // 'B09VT4JN7W',
    'B07ZGMGTCJ',
    // 'B071RVWGYJ',
    // 'B094FR5R5D',
    // 'B072MPKF5X',
    // 'B079FHJMMG',
    // 'B009WADXCG',
    'B000261OFM',
    // 'B002ZJB4PO',
    // 'B01DCG0GPC',
    // 'B00J4YY0O0',
    // 'B002YD8FK8',
    // 'B0753NHZVQ',
    // 'B018IZAL6G',
  ];
  const { data, isLoading, error, isValidating } = useCustomSWR(productIds);

  const memoizedValue = useMemo(
    () => ({
      products: data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  console.log('useGetProducts memoizedValue: ', memoizedValue);
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

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

export async function placeOrderWithSWR(products, shippingAddress, subTotal) {
  console.log('calling product api placeOrderWithSWR');
  console.log('placeOrderWithSWR parameters:', products, shippingAddress, subTotal);

  const orderResults = await fetcherOrder(
    {
      url: zincApiEndpoint,
      method: 'post',
    },
    products,
    shippingAddress,
    subTotal
  );

  console.log('placeOrderWithSWR results:', orderResults);

  return orderResults;
}

export function usePlaceOrder() {
  return async (items, shippingAddress, subTotal) => {
    console.log('calling product api usePlaceOrder');
    console.log('placeOrder parameters:', items, shippingAddress, subTotal);

    const orderResults = await placeOrderWithSWR(items, shippingAddress, subTotal);

    console.log('placeOrder results:', orderResults);

    return orderResults;
  };
}
