import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
// utils
import { fetcher, fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { useGetZincProducts } from './zinc';

// ----------------------------------------------------------------------

const URL = endpoints.products;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

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

export function useGetProducts(account_id) {
  const { data, isLoading, error, isValidating } = useSWR(
    [URL, { account_id }],
    () => fetcherANYML([URL.getProducts, { account_id }]),
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

// // Function to create an order
// export async function createProduct(eventData) {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   const { products, accountID: account_id } = eventData;


//   try {

//     // Create the formatted order object
//     const formattedProduct = formatProduct(eventData);

//     const thisProduct = {
//       shelter_id: account_id,
//       new_product: { ...formattedProduct }
//     };

//     await postRequestANYML(URL.create, thisProduct, config);

//     // Update the SWR cache
//     mutate(URL, currentData => {
//       const orders = currentData?.products ? [...currentData.products, formattedProduct] : [formattedProduct];
//       return {
//         ...currentData,
//         products,
//       };
//     }, false);

//     return formattedProduct;
//   } catch (error) {
//     console.error('Error creating order:', error);
//     throw error;
//   }
// }

// // Function to format product data
// function formatProduct(productData) {
//   return {
//     id: uuidv4(), // Generate a unique ID for the product
//     gender: productData.gender,
//     publish: productData.publish,
//     category: productData.category,
//     available: productData.available,
//     priceSale: productData.priceSale,
//     taxes: productData.taxes,
//     quantity: productData.quantity,
//     sizes: productData.sizes,
//     inventoryType: productData.inventoryType,
//     images: productData.images,
//     ratings: productData.ratings,
//     reviews: productData.reviews,
//     tags: productData.tags,
//     code: productData.code,
//     description: productData.description,
//     newLabel: productData.newLabel,
//     sku: productData.sku,
//     createdAt: new Date().toISOString(), // Use current date-time for createdAt
//     saleLabel: productData.saleLabel,
//     name: productData.name,
//     price: productData.price,
//     coverUrl: productData.coverUrl,
//     totalRatings: productData.totalRatings,
//     totalSold: productData.totalSold,
//     totalReviews: productData.totalReviews,
//     subDescription: productData.subDescription,
//     colors: productData.colors,
//   };
// }