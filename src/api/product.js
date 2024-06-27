import useSWR, { mutate } from 'swr';
import { useMemo, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual'; // Import isEqual from lodash

// utils
import { fetcher, fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { useGetZincProducts } from './zinc';
import uuidv4 from '../utils/uuidv4';
import { getCacheFlagKey, setCacheFlag, fetcherWithLocalStorage, getVersionKey, setVersionKey } from './cache';

// ----------------------------------------------------------------------

const PRODUCTS_URL = endpoints.products;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;
// const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

// // In-memory cache
// const cache = {};

// // Custom fetcher to check cache first
// const fetcherWithCache = async (key, query) => {
//   // Check if data is already in cache
//   if (cache[key]) {
//     return cache[key];
//   }

//   // If not in cache, fetch data from API
//   const data = await fetcher(query);
//   // Save the fetched data in cache
//   cache[key] = data;

//   return data;
// };

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const productURL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(productURL, fetcher);

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

export function useGetProducts(account_id, { enabled = true } = {}) {
  const { data, isLoading, error, isValidating } = useSWR(
    enabled && account_id ? [PRODUCTS_URL, { account_id }] : null,
    () => fetcherANYML([PRODUCTS_URL.list, { account_id }]),
    options
  );

  const [productIds, setProductIds] = useState([]);
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (data) {
      const newProductIds = data.products.map(product => product.id);
      console.log("Fetched product IDs:", newProductIds);

      if (!isEqual(productIds, newProductIds)) {
        console.log("Updating product IDs");
        setProductIds(newProductIds);
      } else {
        console.log("Product IDs unchanged");
      }

      const localVersion = getVersionKey(account_id);
      if (data.version_products !== version) {
        setVersion(data.version_products);
        if (!localVersion) {
          setVersionKey(account_id, data.version_products);
        }
      }
    }
  }, [data, productIds, version, account_id]);

  const zincProducts = useGetZincProducts(account_id, productIds, version);

  const combinedState = useMemo(() => ({
    products: zincProducts.products,
    productsLoading: isLoading || zincProducts.productsLoading,
    productsError: error || zincProducts.productsError,
    productsValidating: isValidating || zincProducts.productsValidating,
    productsEmpty: !isLoading && !zincProducts.productsLoading && zincProducts.productsEmpty,
    version,
  }), [zincProducts, isLoading, error, isValidating, version]);

  return combinedState;
}


// ----------------------------------------------------------------------

// export function useSearchProducts(query) {
//   const searchURL = query ? [endpoints.product.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(
//     searchURL ? JSON.stringify(searchURL) : null,
//     searchURL ? () => fetcherWithLocalStorage(searchURL) : null,
//     {
//       keepPreviousData: true,
//     }
//   );

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: (data && data.results) ? data.results : [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && (!data || !data.results || data.results.length === 0),
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export async function createProduct(eventData) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { product, account_id } = eventData;

  try {
    const formattedProduct = {
      shelter_id: account_id,
      new_products: [
        formatProduct(product) // Use the formatProduct function to format the product data
      ]
    };

    await postRequestANYML(PRODUCTS_URL.createProduct, formattedProduct, config);

    // Update the local storage key to true
    console.log('Setting cache flag for account:', account_id);
    setCacheFlag(account_id, true);
    console.log('Cache flag set:', localStorage.getItem(getCacheFlagKey(account_id))); // Add debug statement

    // Update the SWR cache directly
    mutate(
      [PRODUCTS_URL, { account_id }],
      async (currentData) => {
        const updatedProducts = await fetcherANYML([PRODUCTS_URL.list, { account_id }]);
        return {
          ...currentData,
          products: updatedProducts.products,
        };
      },
      false
    );

  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

function formatProduct(productData) {
  return {
    id: productData.id || uuidv4(), // Generate a unique ID for the product if not provided
    createdAt: productData.createdAt || new Date().toISOString(), // Use current date-time for createdAt if not provided
    publish: productData.publish || 'draft', // Default publish status to 'draft' if not provided
    ...productData, // Include other product attributes if any
  };
}
