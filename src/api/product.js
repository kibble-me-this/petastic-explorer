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

  const zincProducts = useGetZincProducts(productIds);

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
