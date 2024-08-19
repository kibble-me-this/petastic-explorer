import useSWR, { mutate } from 'swr';
import { useMemo, useCallback, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual'; // Import isEqual from lodash

// utils
import { fetcher, fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { getStorage, removeStorage, setStorage, useLocalStorage } from 'src/hooks/use-local-storage';
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

const mockProducts = [
  {
    product_id: "B07RTB6CKF",
    title: "Dog Crate Dog Kennel Cage 42” Portable Foldable Indoor Outdoor Large Double Door Wire Metal Puppy Cat Pet Dog Cage with ABS Tray LC & Divider, Black",
    price: 5699,
    main_image: "https://m.media-amazon.com/images/I/71vnyUc+rKL.jpg",
    stars: 4.5,
    review_count: 525,
    variants: [
      {
        product_id: "B0CFXC41GG",
        variant_specifics: [
          { dimension: "Size", value: "30\"" },
          { dimension: "Color", value: "Blue" }
        ]
      },
      {
        product_id: "B07RP1LLD2",
        variant_specifics: [
          { dimension: "Size", value: "30\"" },
          { dimension: "Color", value: "Black" }
        ]
      },
      {
        product_id: "B0CFXPFDWL",
        variant_specifics: [
          { dimension: "Size", value: "42\"" },
          { dimension: "Color", value: "Blue" }
        ]
      }
    ]
  },
  {
    product_id: "B07QG7WT8T",
    title: "Amazon Brand – Wag Chicken Flavor Training Treats for Dogs, 1 lb. Bag (16 oz)",
    price: 996,
    main_image: "https://m.media-amazon.com/images/I/71rMd9vxjHL.jpg",
    stars: 4.5,
    review_count: 20026,
    variants: [
      {
        product_id: "B07QG84VC8",
        variant_specifics: [
          { dimension: "Style", value: "Hip & Joint" },
          { dimension: "Flavor Name", value: "Chicken" },
          { dimension: "Size", value: "1 Pound (Pack of 1)" }
        ]
      },
      {
        product_id: "B07QG7WT8T",
        variant_specifics: [
          { dimension: "Style", value: "Standard" },
          { dimension: "Flavor Name", value: "Chicken" },
          { dimension: "Size", value: "1 Pound (Pack of 1)" }
        ]
      },
      {
        product_id: "B07DNQGXQ6",
        variant_specifics: [
          { dimension: "Style", value: "Hip & Joint" },
          { dimension: "Flavor Name", value: "Chicken" },
          { dimension: "Size", value: "2 Pound (Pack of 1)" }
        ]
      }
    ]
  },
  {
    product_id: "B0C5J2Y36Q",
    title: "5 Pack Tough Dog Toys Stuffed Squeaky Dog Toys Assortment Plush Animal Dog Toy Value Bundle Puppy Pet Dog Toys for Small Medium Large Dogs",
    price: 2199,
    main_image: "https://m.media-amazon.com/images/I/81QD4msnnDL.jpg",
    stars: 4.2,
    review_count: 857,
    variants: [
      {
        product_id: "B0C5J2Y36Q",
        variant_specifics: [{ dimension: "Size", value: "5pack" }]
      }
    ]
  },
  {
    product_id: "B0002J1FNK",
    title: "FRONTLINE Plus for Dogs Flea and Tick Treatment (Medium Dog, 23-44 lbs.) 6 Doses (Blue Box)",
    price: 7898,
    main_image: "https://m.media-amazon.com/images/I/71Uzmd62elL.jpg",
    stars: 4.4,
    review_count: 21650,
    variants: [
      {
        product_id: "B07NGRSVLF",
        variant_specifics: [{ dimension: "Size", value: "8 count" }]
      },
      {
        product_id: "B0002J1FNK",
        variant_specifics: [{ dimension: "Size", value: "6 count" }]
      },
      {
        product_id: "B0002J1FN0",
        variant_specifics: [{ dimension: "Size", value: "3 count" }]
      }
    ]
  },
  {
    product_id: "B0CWXNS552",
    title: "Apple AirTag",
    price: 2499,
    main_image: "https://m.media-amazon.com/images/I/71rP7f78eFL.jpg",
    stars: 4.6,
    review_count: 5632,
    variants: [
      {
        product_id: "B0CWXNS552",
        variant_specifics: [{ dimension: "Style", value: "Single" }]
      }
    ]
  },
  {
    product_id: "B0BBV2GRNC",
    title: "Amazon Basics Gel Foam Mattress Dog Pet Bed with Removable Cover, Large, 35.0\"L x 22.0\"W x 3.0\"Th, Grey",
    price: 2369,
    main_image: "https://m.media-amazon.com/images/I/51ytVdkZRuL.jpg",
    stars: 4.1,
    review_count: 300,
    variants: [
      {
        product_id: "B0BBV95QY6",
        variant_specifics: [
          { dimension: "Style", value: "Pillowtop" },
          { dimension: "Size", value: "48.0\"L x 36.0\"W x 8.5\"Th" }
        ]
      },
      {
        product_id: "B0BBV8483Y",
        variant_specifics: [
          { dimension: "Style", value: "Egg Crate Foam" },
          { dimension: "Size", value: "44.0\"L x 35.0\"W x 8.0\"Th" }
        ]
      },
      {
        product_id: "B0BBV1PCMR",
        variant_specifics: [
          { dimension: "Style", value: "Egg Crate Foam" },
          { dimension: "Size", value: "30.0\"L x 20.0\"W x 6.3\"Th" }
        ]
      }
    ]
  },
  {
    product_id: "B0788C5SB9",
    title: "Kirkland Signature Expect More Adult Formula Chicken, Rice and Vegetable Dog Food 40 lb.",
    price: 5980,
    main_image: "https://m.media-amazon.com/images/I/61XJbUP4UXL.jpg",
    stars: 4.5,
    review_count: 176,
    variants: [
      {
        product_id: "B0788C5SB9",
        variant_specifics: []
      }
    ]
  },
  {
    product_id: "B00O690E5W",
    title: "Benebone Wishbone Durable Dog Chew Toy for Aggressive Chewers, Real Chicken, Made in USA, Medium",
    price: 1278,
    main_image: "https://m.media-amazon.com/images/I/71w9ueQxWJL.jpg",
    stars: 4.5,
    review_count: 95948,
    variants: [
      {
        product_id: "B00MHZTKXY",
        variant_specifics: [
          { dimension: "Flavor Name", value: "REAL Bacon" },
          { dimension: "Size", value: "Small" }
        ]
      },
      {
        product_id: "B014JY9E9U",
        variant_specifics: [
          { dimension: "Flavor Name", value: "REAL Bacon" },
          { dimension: "Size", value: "Large" }
        ]
      },
      {
        product_id: "B07YM1ZT2T",
        variant_specifics: [
          { dimension: "Flavor Name", value: "REAL Bacon" },
          { dimension: "Size", value: "Giant" }
        ]
      }
    ]
  },]


export function useGetProducts(account_id, { enabled = true } = {}) {
  const { data, isLoading, error, isValidating } = useSWR(
    enabled && account_id ? [PRODUCTS_URL, { account_id }] : null,
    () => fetcherANYML([PRODUCTS_URL.list, { account_id }]),
    options
  );

  const zincProducts = mockProducts;

  const combinedState = useMemo(() => ({
    products: zincProducts,
    productsLoading: isLoading, // || zincProducts.productsLoading,
    productsError: error || zincProducts.productsError,
    productsValidating: isValidating || zincProducts.productsValidating,
    productsEmpty: !isLoading && !zincProducts.productsLoading && zincProducts.productsEmpty,
    // version,
  }), [zincProducts, isLoading, error, isValidating,
    // version
  ]);

  return combinedState;
}

// ----------------------------------------------------------------------

export function useGetProductDetails(accountId, page = 1, limit = 10) {
  const isValidAccountId = Boolean(accountId);

  // Define the local storage key dynamically based on accountId
  const storageKey = `p_${accountId}`;

  // Use the custom hook to manage local storage state
  const { state: cachedData, update: updateCache } = useLocalStorage(storageKey, {
    products: [],
    lastFetched: 0, // Store a timestamp to manage cache expiration
  });

  // Memoize the cache validation function to prevent it from being redefined on each render
  const isCacheValid = useCallback(() => {
    const cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return Date.now() - cachedData.lastFetched < cacheExpiration;
  }, [cachedData.lastFetched]);

  // Fetch product details using SWR if cache is invalid or expired
  const { data, isLoading, error, isValidating } = useSWR(
    isValidAccountId && !isCacheValid() ? [URL.details, accountId, page, limit] : null,
    async ([url, account_id, currentPage, pageLimit]) => {
      // Send the API request with the pagination parameters
      const response = await postRequestANYML(url, { account_id, page: currentPage, limit: pageLimit });

      // Parse response body
      let responseBody = response?.body;
      if (typeof responseBody === 'string') {
        responseBody = JSON.parse(responseBody);
      }

      // Log the products and response to check if the data is present
      console.log("Fetched products:", responseBody.products);
      console.log("Response Body:", responseBody);

      // Update local cache with the new data and timestamp if data exists
      if (responseBody.products && responseBody.products.length > 0) {
        console.log('Updating cache with new products and pagination metadata:', responseBody.products);
        updateCache({
          products: responseBody.products,
          currentPage: responseBody.currentPage,
          totalProducts: responseBody.totalProducts,
          totalPages: responseBody.totalPages,
          lastFetched: Date.now(),
        });
      } else {
        console.warn("No products found, cache will not be updated.");
      }

      return { ...response, body: responseBody };
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // If cache is valid, return cached data, otherwise return SWR data
  const finalProducts = useMemo(() => isCacheValid() ? cachedData.products : (data?.body?.products || []), [cachedData.products, data, isCacheValid]);

  return useMemo(() => ({
    products: finalProducts,
    currentPage: isCacheValid() ? cachedData.currentPage : (data?.body?.currentPage || page),
    totalProducts: isCacheValid() ? cachedData.totalProducts : (data?.body?.totalProducts || 0),
    totalPages: isCacheValid() ? cachedData.totalPages : (data?.body?.totalPages || 1),
    productsLoading: isLoading,
    productsError: error,
    productsValidating: isValidating,
    productsEmpty: !isLoading && finalProducts.length === 0,
  }), [finalProducts, cachedData, data, error, isLoading, isValidating, page, isCacheValid]);
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