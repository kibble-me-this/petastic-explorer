import useSWR from 'swr';
import { useMemo, useEffect } from 'react';
// utils
import { fetcherProduct, dispatchZincOrder, fetcher, endpoints } from 'src/utils/axios-zinc';
import emailjs from '@emailjs/browser';
import { getCacheFlagKey, setCacheFlag, fetcherWithLocalStorage } from './cache';

const ZINC_API_ORDERS = 'https://api.zinc.com/v1/orders';

// Custom SWR hook with localStorage support
export function useCustomSWR(userId, fetcherFunction, fetcherArgs, ...args) {
  return useSWR(fetcherArgs ? [userId, ...fetcherArgs] : null, () => fetcherWithLocalStorage(userId, fetcherFunction, fetcherArgs, ...args));
}

// Hook to get products by product IDs
export function useGetZincProducts(userId, productIds) {
  const { data, isLoading, error, isValidating } = useCustomSWR(userId, fetcherProduct, productIds);

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

// ----------------------------------------------------------------------

export function useGetProduct(productId, callback = () => { }) {
  console.log('useGetProduct productId: ', productId);
  const productURL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  // Fetch data using SWR
  const { data, isLoading, error, isValidating } = useCustomSWR(productId, fetcher, [productURL]);

  console.log('useGetProduct data before useEffect: ', data);

  // Execute the callback function whenever data is fetched or updated
  useEffect(() => {
    console.log('useGetProduct in useEffect: ', data);

    if (data) {
      callback(data);
    }
  }, [data, callback]);

  console.log('useGetProduct data after useEffect: ', data);

  // Memoize the return value to optimize performance
  const memoizedValue = useMemo(
    () => ({
      product: data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  console.log('useGetProduct memoizedValue: ', memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const searchURL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(searchURL, fetcher, {
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

// Function to send an order confirmation email using EmailJS
export async function sendOrderConfirmationEmail(orderDetails) {
  const { request_id, status, items, shippingAddress, subTotal, taxTotal, shippingCost } = orderDetails;

  // Construct the email template parameters
  const templateParams = {
    to_email: "carlos@petastic.com",
    from_name: "Petastic", // Update this if you have a dynamic sender name
    order_id: request_id,
    order_status: status,
    items_list: `<ul>${items.map(item => `<li>${item.product_id} (x${item.quantity})</li>`).join('')}</ul>`,
    shipping_address: `
      <p>
        ${shippingAddress.first_name} ${shippingAddress.last_name},<br>
        ${shippingAddress.address_line1},<br>
        ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipcode}
      </p>
    `,
    order_total: `$${(subTotal / 100).toFixed(2)}`,
    order_tax: `$${(taxTotal / 100).toFixed(2)}`,
    order_shipping: `$${(shippingCost / 100).toFixed(2)}`,
    total: `$${((subTotal + taxTotal + shippingCost) / 100).toFixed(2)}`
  };

  try {
    const result = await emailjs.send(
      'service_2nw5qla', // Replace with your service ID
      'template_rz5namd', // Replace with your template ID
      templateParams, // Template parameters
      'xdL7DKBOnhX6fRDbJ' // Replace with your user ID
    );

    console.log(result.text);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.log(error.text);
    return { success: false, message: 'Email sending failed' };
  }
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

    if (orderResults.request_id) {
      // Pass necessary details along with the request_id
      const orderDetails = {
        request_id: orderResults.request_id,
        status: 'pending', // Or any other status you have
        items,
        shippingAddress,
        subTotal,
        taxTotal: 0, // Replace with actual tax if available
        shippingCost: 0, // Replace with actual shipping cost if available
      };

      await sendOrderConfirmationEmail(orderDetails);
    }

    return orderResults;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}
