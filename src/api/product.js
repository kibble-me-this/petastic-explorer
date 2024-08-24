import useSWR, { mutate } from 'swr';
import { useMemo, useCallback, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual'; // Import isEqual from lodash

// utils
import { fetcher, fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { getStorage, removeStorage, setStorage, useLocalStorage, useProductCache } from 'src/hooks/use-local-storage';
import { useGetZincProducts } from './zinc';
import uuidv4 from '../utils/uuidv4';
import { getCacheFlagKey, setCacheFlag, fetcherWithLocalStorage, getVersionKey, setVersionKey } from './cache';

// ----------------------------------------------------------------------

const PRODUCTS_URL = endpoints.products;
const URL = endpoints.product;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

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

export function useGetProductDetails(accountId, page = 1, limit = 10) {
  const isValidAccountId = Boolean(accountId);

  const { cache, updateProductCache, isCacheValid } = useProductCache(accountId); // Use the custom hook

  const { data, isLoading, error: swrError, isValidating } = useSWR(
    isValidAccountId && !isCacheValid() ? [URL.details, accountId, page, limit] : null,
    async ([url, account_id, currentPage, pageLimit]) => {
      try {
        const response = await postRequestANYML(url, { account_id, page: currentPage, limit: pageLimit });

        let responseBody = response?.body;
        if (typeof responseBody === 'string') {
          responseBody = JSON.parse(responseBody);
        }

        if (responseBody.products && responseBody.products.length > 0) {
          console.log('Fetched products:', responseBody.products);

          // Update the product cache with the new data, including brand and categories
          updateProductCache({
            products: responseBody.products.map(product => ({
              ...product,
              brand: product.brand, // Add the brand attribute to each product
              categories: product.categories, // Add the categories attribute to each product
            })),
            currentPage: responseBody.currentPage,
            totalProducts: responseBody.totalProducts,
            totalPages: responseBody.totalPages,
            lastFetched: Date.now(),
          });
        } else {
          console.warn('No products found, cache will not be updated.');
        }
      } catch (fetchError) {
        console.error('Error fetching products:', fetchError);
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Extract the final products from the cache or the API response
  const finalProducts = useMemo(() => isCacheValid() ? cache.products : (data?.body?.products || []), [cache.products, data, isCacheValid]);

  return useMemo(() => ({
    products: finalProducts,
    currentPage: isCacheValid() ? cache.currentPage : (data?.body?.currentPage || page),
    totalProducts: isCacheValid() ? cache.totalProducts : (data?.body?.totalProducts || 0),
    totalPages: isCacheValid() ? cache.totalPages : (data?.body?.totalPages || 1),
    productsLoading: isLoading,
    productsError: swrError,
    productsValidating: isValidating,
    productsEmpty: !isLoading && finalProducts.length === 0,
  }), [finalProducts, cache, data, swrError, isLoading, isValidating, page, isCacheValid]);
}


// ----------------------------------------------------------------------

export function useFetchAndMergeVariants(productId) {
  const fetchAndMergeVariants = async () => {
    if (!productId) return;

    try {
      // Fetch the variant details from your Lambda function
      const response = await postRequestANYML(URL.variants, { productIds: [productId] });
      const data = response?.products?.[0];

      if (data) {
        // Update the SWR cache with the new variant data
        mutate(
          [URL.details, productId],
          (currentData) => {
            if (!currentData || !currentData.product) return currentData;

            // Merge the variant data with the current product data
            const updatedProduct = {
              ...currentData.product,
              variants: data.variants, // Overwrite the variants with the new data
              // Optionally update other fields like price, image, etc.
              price: data.price,
              main_image: data.main_image,
              stars: data.stars,
              review_count: data.review_count,
            };

            return {
              ...currentData,
              product: updatedProduct,
            };
          },
          false // Do not revalidate
        );
      }
    } catch (error) {
      console.error('Error fetching and merging variant details:', error);
    }
  };

  return {
    fetchAndMergeVariants,
  };
}

// ----------------------------------------------------------------------

export async function createProduct(eventData) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { products, account_id } = eventData;

  try {
    const formattedProducts = products.map(product => formatProduct(product));

    const requestData = {
      shelter_id: account_id,
      new_products: formattedProducts,
    };

    await postRequestANYML(PRODUCTS_URL.createProduct, requestData, config);

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
    console.error('Error creating products:', error);
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

// ----------------------------------------------------------------------

export function useSearchProducts(query, accountId) {
  // Use `useGetProductDetails` to get the product data, which will be cached by SWR
  const { products, productsLoading, productsError } = useGetProductDetails(accountId);

  // Filter products based on the search query
  const searchResults = useMemo(() => {
    if (!query) return products;

    const lowercasedQuery = query.toLowerCase();

    return products.filter((product) =>
      product.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, products]);

  // Return the filtered search results
  return {
    searchResults,
    searchLoading: productsLoading,
    searchError: productsError,
    searchEmpty: !productsLoading && searchResults.length === 0,
  };
}