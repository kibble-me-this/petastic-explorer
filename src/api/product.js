import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcherProduct, fetcherOrder, fetcher, endpoints } from 'src/utils/axios-zinc';

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

export function useGetProducts(orgId) {
  // Define your organizations array with formatted IDs
  const organizations = [
    {
      id: '5ee83180f121686526084263',
      name: 'Animal Haven',
      products: ['B01IO8YVX6', 'B006HSSBIW'], // Example product IDs for Organization 1
    },
    {
      id: '5ee83180fb01683673939629',
      name: 'Strong Paws',
      products: [
        'B0002DGL26',
        'B00FE1CFTE',
        'B00FE1CE9A',
        'B07121B839',
        'B01HGQP7DK',
        'B013JDKGCG',
        'B071R3FM21',
        'B00028MWG0',
        'B01M8JT6FT',
        'B0BGGPM66Z',
        'B09LVV5MY6',
        'B01IUYFBPQ',
        'B00A4JGL1E',
        'B08BW6HPCM',
        'B07MM2N1NL',
        'B072FVZ1Z9',
        'B08NJJQ1KW',
      ],
    },
    {
      id: '5ee83180f8a1683475024978',
      name: 'Second Chance Rescue',
      products: [
        'B01DCG0GPC',
        'B00J4YY0O0',
        'B002YD8FK8',
        'B0753NHZVQ',
        'B018IZAL6G',
        'B018IZAME2',
        'B0751RPD3V',
        'B09NQRD56L',
        'B09FW2R4W1',
        'B000V9YYMK',
        'B005FH7JP2',
        'B00M56E0JO',
        'B00007J6CX',
        'B006OVQV1G',
        'B09F8NLGCD',
        'B09F89LYPN',
        'B09V65VY5J',
        'B07GL8SLKY',
        'B089LLHMQL',
        'B06ZZ4679J',
        'B0BNP527D2',
        'B09P32SSRL',
        'B08749HDV7',
        'B08742YDKK',
        'B08746LRDJ',
        'B0874CH399',
        'B087423VBW',
        'B08WTNQPZP',
        'B08WT8HZZH',
        'B08WTF8Q2S',
        'B0873XV1R7',
        'B0873ZD5HY',
        'B09ZDR3ZK7',
        'B08WTBH61N',
        'B08WTT7HGQ',
        'B08WTFWHB5',
        'B0873WP8VQ',
        'B0874DYTYX',
        'B0873VL5KL',
        'B0874BNKHH',
        'B0873XTSPB',
        'B0873ZZMZ1',
        'B0BLT6PY1P',
        'B002SSIQZI',
        'B0BLTTLG31',
        'B000XS6RJW',
        'B0BLT6XXBZ',
        'B0BHRZMHW3',
        'B0BLT7NXLW',
        'B003YVMUFK',
        'B0CNS61JJZ',
        'B00VRJU2Y2',
        'B0CNS5XLJT',
        'B00063434K',
        'B004P3970C',
        'B004HFRMEQ',
        'B0733LNDFV',
        'B0CNS5FR2N',
        'B01BI31WCC',
        'B083X3WWHT',
        'B083X4GVYF',
      ],
    },
    {
      id: '5ee83180f271685767429993',
      name: 'Muddy Paws Rescue',
      products: [],
    },
    {
      id: '5fe931824271705684215701',
      name: 'Muddy Paws Rescue',
      products: [],
    },
  ];

  // Find the organization by ID
  const organization = organizations.find((org) => org.id === orgId);

  // If organization is not found, return empty array for products
  const productIds = organization ? organization.products : [];

  // Use SWR hook with the product IDs
  const { data, isLoading, error, isValidating } = useCustomSWR(productIds);

  // Memoize the returned value
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
