import useSWR, { mutate } from 'swr';
import { useMemo, useState, useEffect } from 'react';
// utils
import { fetcher, fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { useGetZincProducts } from './zinc';
import uuidv4 from '../utils/uuidv4';


// ----------------------------------------------------------------------

const URL = endpoints.products;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;
const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const _URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(_URL, fetcher);

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
    enabled && account_id ? [URL, { account_id }] : null,
    () => fetcherANYML([URL.list, { account_id }]),
    options
  );

  const [productIds, setProductIds] = useState([]);

  useEffect(() => {
    if (data) {
      setProductIds(data.products.map(product => product.id));
    }
  }, [data]);

  const zincProducts = useGetZincProducts(account_id, productIds);

  const combinedState = useMemo(() => ({
    products: zincProducts.products,
    productsLoading: isLoading || zincProducts.productsLoading,
    productsError: error || zincProducts.productsError,
    productsValidating: isValidating || zincProducts.productsValidating,
    productsEmpty: !isLoading && !zincProducts.productsLoading && zincProducts.productsEmpty,
  }), [zincProducts, isLoading, error, isValidating]);

  return combinedState;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const _URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(_URL, fetcher, {
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

// ----------------------------------------------------------------------

// Function to create an order
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

    await postRequestANYML(URL.createProduct, formattedProduct, config);

    // Update the local storage key to true
    console.log('Setting cache flag for account:', account_id);
    setCacheFlag(account_id, true);
    console.log('Cache flag set:', localStorage.getItem(getCacheFlagKey(account_id))); // Add debug statement

    // Update the SWR cache directly
    mutate(
      [URL, { account_id }],
      async (currentData) => {
        const updatedProducts = await fetcherANYML([URL.list, { account_id }]);
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

// Function to format product data
function formatProduct(productData) {
  return {
    id: productData.id || uuidv4(), // Generate a unique ID for the product if not provided
    createdAt: productData.createdAt || new Date().toISOString(), // Use current date-time for createdAt if not provided
    publish: productData.publish || 'draft', // Default publish status to 'draft' if not provided
    ...productData, // Include other product attributes if any
  };
}