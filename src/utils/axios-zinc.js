import axios from 'axios';

// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const ZINC_API = 'https://api.zinc.io';
const zincApiKey = '494887CF5BB27A2600581C3A';
const ZINC_CALLBACK = 'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleEditOrderTracking';

const axiosInstance = axios.create({ baseURL: ZINC_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

const orderData = {
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
  is_gift: false,
  gift_message: '',
  shipping: {
    order_by: 'price',
    max_days: 5,
    max_price: 1000,
  },
};

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const fetcherProduct = async (productIds) => {
  const zincAPIClientToken = '494887CF5BB27A2600581C3A';
  const headers = new Headers({
    Authorization: `Basic ${btoa(`${zincAPIClientToken}:`)}`,
  });

  try {
    const dataPromises = productIds.map(async (productId) => {
      const url = `https://api.zinc.io/v1/products/${productId}?retailer=amazon`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Error fetching data for ${productId}: ${response.statusText}`);
      }

      const productData = await response.json();
      return productData;
    });

    const dataArray = await Promise.all(dataPromises);
    return dataArray;
  } catch (error) {
    throw (error.response && error.response.data) || 'Something went wrong';
  }
};

// ----------------------------------------------------------------------

export const dispatchZincOrder = async (args, products, shippingAddress, subTotal, webhooks) => {
  const [data, headers, url, config] = Array.isArray(args) ? args : [args];

  const maxPrice = subTotal * 100 * 1.15;

  const updatedOrderData = {
    ...orderData,
    max_price: maxPrice,
    products,
    shipping_address: {
      first_name: shippingAddress.name,
      last_name: '',
      address_line1: shippingAddress.address,
      address_line2: '',
      zip_code: shippingAddress.zip,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country,
      phone_number: shippingAddress.phone,
    },
    webhooks: {
      request_succeeded: `${ZINC_CALLBACK}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=request_succeeded`,
      request_failed: `${ZINC_CALLBACK}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=request_failed`,
      tracking_obtained: `${ZINC_CALLBACK}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=tracking_obtained`,
      status_updated: `${ZINC_CALLBACK}?shelter_id=${webhooks.account_id}&order_id=${webhooks.order_id}&status=status_updated`
    }
  };

  try {
    const response = await axiosInstance.post('/v1/orders', updatedOrderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${zincApiKey}:`)}`,
      },
    });

    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || 'Something went wrong';
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
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
