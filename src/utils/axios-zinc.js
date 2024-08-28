// axios_zinc.js

import axios from 'axios';
import { config } from './config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: config.zincApiUrl });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response?.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

const realOrderData = {
  retailer: 'amazon',
  billing_address: {
    first_name: 'Carlos',
    last_name: 'Herrera',
    address_line1: '360 NW 27th St',
    zip_code: '33127',
    city: 'Miami',
    state: 'FL',
    country: 'US',
    phone_number: '3108808673',
  },
  payment_method: {
    use_account_payment_defaults: true,
    use_gift: false,
  },
  retailer_credentials: {
    email: 'carlos@petastic.com',
    password: 'd7Tll7Xj43Zy',
    totp_2fa_key: 'SPA3 X4TI APGV IMLE BYUV 3HI7 SDS5 6DYM TWEP HY77 Q5BW CY7Q LGIA',
  },
};

const mockOrderData = {
  retailer: 'amazon',
  billing_address: {
    first_name: 'Carlos',
    last_name: 'Herrera',
    address_line1: '360 NW 27th St',
    zip_code: '33127',
    city: 'Miami',
    state: 'FL',
    country: 'US',
    phone_number: '3108808673',
  },
  payment_method: {
    use_account_payment_defaults: true,
    use_gift: false,
  },
  retailer_credentials: {
    email: 'carlos@sn2020a.com',
    password: 'ai61GrQ2F6',
    totp_2fa_key: 'KKCE 4OQK 4EHE 43KH OV6W BM2G D2P2 VOAJ V7B4 M2H4 Y4NP 2OFE QJPQ',
  },
};

// ----------------------------------------------------------------------

// Utility functions
const calculateMaxPrice = (subTotal) => subTotal * 100 * 1.15 + 3000;

const buildShippingAddress = (shippingAddress) => ({
  first_name: shippingAddress.name ?? 'N/A',
  last_name: '',
  address_line1: shippingAddress.address ?? 'N/A',
  address_line2: '',
  zip_code: shippingAddress.zip ?? '00000',
  city: shippingAddress.city ?? 'N/A',
  state: shippingAddress.state ?? 'N/A',
  country: shippingAddress.country ?? 'N/A',
  phone_number: shippingAddress.phone ?? '0000000000',
});

const buildWebhooks = (webhooks) => ({
  request_succeeded: `${config.zincCallbackUrl}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=request_succeeded`,
  request_failed: `${config.zincCallbackUrl}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=request_failed`,
  tracking_obtained: `${config.zincCallbackUrl}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=tracking_obtained`,
  status_updated: `${config.zincCallbackUrl}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=status_updated`,
});

// Main function
const dispatchZincOrder = async (args, products, shippingAddress, subTotal, webhooks, useMockData = false) => {
  const [data, headers, url, requestConfig] = Array.isArray(args) ? args : [args]; // Renamed config to requestConfig

  const maxPrice = calculateMaxPrice(subTotal);
  const orderData = useMockData ? mockOrderData : realOrderData;

  const updatedOrderData = {
    ...orderData,
    max_price: maxPrice,
    products,
    shipping_address: buildShippingAddress(shippingAddress),
    take_buybox_offers: true,
    is_gift: true,
    gift_message: "Petastic! The pet's network.",
    shipping: {
      order_by: "price",
      max_days: 25,
      max_price: 15000,
    },
    webhooks: buildWebhooks(webhooks),
  };

  try {
    const response = await axiosInstance.post('/v1/orders', updatedOrderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${config.zincApiKey}:`)}`, // config is the import
      },
      ...requestConfig, // Applying requestConfig instead of the previously shadowed config variable
    });

    return response.data;
  } catch (error) {
    console.error("Error in dispatchZincOrder:", error);
    throw (error.response?.data) || 'Something went wrong';
  }
};

// ----------------------------------------------------------------------

// fetcherProduct Implementation Example
const fetcherProduct = async (productIds) => {
  try {
    const dataPromises = productIds.map((productId) =>
      axiosInstance.get(`/v1/products/${productId}?retailer=amazon`)
    );

    const productsData = await Promise.all(dataPromises);
    return productsData.map((response) => response.data);
  } catch (error) {
    console.error("Error in fetcherProduct:", error);
    throw (error.response?.data) || 'Something went wrong';
  }
};

// ----------------------------------------------------------------------

const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

export { fetcherProduct, dispatchZincOrder, endpoints };
