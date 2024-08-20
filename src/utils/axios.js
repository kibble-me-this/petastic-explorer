import React, { useState } from 'react';

import axios from 'axios';
// config
import {
  HOST_API,
  ANYML_HOST_API,
  ANYML_HOST_API_LOCAL,
  ZINC_HOST_API,
  ZINC_HOST_API_KEY
} from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });
const axiosInstanceANYML = axios.create({
  baseURL: process.env.REACT_APP_ENVIRONMENT === 'local' ? ANYML_HOST_API_LOCAL : ANYML_HOST_API_LOCAL
});
const axiosInstanceZINC = axios.create({ baseURL: ZINC_HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrongs')
);

// export default axiosInstance;
export { axiosInstance, axiosInstanceANYML, axiosInstanceZINC };


// ----------------------------------------------------------------------

// const orderData = {
//   retailer: 'amazon',
//   billing_address: {
//     first_name: 'Carlos',
//     last_name: 'Herrera',
//     address_line1: '360 NW 27th St',
//     zip_code: '33127',
//     city: 'Miami',
//     state: 'FL',
//     country: 'US',
//     phone_number: '3108808673',
//   },
//   payment_method: {
//     use_account_payment_defaults: true,
//     use_gift: false,
//   },
//   retailer_credentials: {
//     email: 'carlos@petastic.com',
//     password: 'd7Tll7Xj43Zy',
//     totp_2fa_key: 'SPA3 X4TI APGV IMLE BYUV 3HI7 SDS5 6DYM TWEP HY77 Q5BW CY7Q LGIA',
//   },
//   // is_gift: false,
//   // gift_message: '',
//   // shipping: {
//   //   order_by: 'price',
//   //   max_days: 5,
//   //   max_price: 1000,
//   // },
// };

// ====================
// MINIMAL API
// ====================

export const fetcherOpenAI = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const fetcher = async (url, ...args) => {
  const { id, params, ...config } = args[0];

  const res = await axiosInstance.get(url, {
    params,
    ...config
  });
  return res.data;
};

export const postRequest = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || 'Something went wrong';
  }
};

// ====================
// ANYMAL API
// ====================

export const fetcherANYML = async (args) => {
  const [url, params, config] = Array.isArray(args) ? args : [args, null, {}];

  const res = await axiosInstanceANYML.get(url, {
    params,
    ...config
  });

  return res.data;
};


export const postRequestANYML = async (url, data, config = {}) => {
  try {
    const response = await axiosInstanceANYML.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || 'Something went wrong';
  }
};


export const patchRequestANYML = async (url, data, config = {}) => {
  try {
    const response = await axiosInstanceANYML.patch(url, data, {
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || 'Something went wrong';
  }
};




// ====================
// ZINC API
// ====================

// export const fetcherProduct = async (productIds) => {
//   const headers = new Headers({
//     Authorization: `Basic ${btoa(`${ZINC_HOST_API_KEY}:`)}`,
//   });

//   try {
//     const dataPromises = productIds.map(async (productId) => {
//       const url = `${ZINC_HOST_API}/v1/products/${productId}?retailer=amazon`;
//       const response = await fetch(url, { headers });

//       if (!response.ok) {
//         throw new Error(`Error fetching data for ${productId}: ${response.statusText}`);
//       }

//       const productData = await response.json();
//       return productData;
//     });

//     const dataArray = await Promise.all(dataPromises);
//     return dataArray;
//   } catch (error) {
//     throw (error.response && error.response.data) || 'Something went wrong';
//   }
// };
// const zincApiKey = '494887CF5BB27A2600581C3A';

// export const fetcherOrder = async (args, products, shippingAddress, subTotal) => {
//   const [data, headers, url, config] = Array.isArray(args) ? args : [args];

//   const maxPrice = subTotal * 1.15;
//   const maxPriceInCents = Math.ceil(maxPrice * 100);

//   // Update orderData with productData and billingAddressData
//   const updatedOrderData = {
//     ...orderData,
//     max_price: maxPriceInCents,
//     products,
//     shipping_address: {
//       first_name: shippingAddress.name,
//       last_name: '',
//       address_line1: shippingAddress.address,
//       address_line2: '',
//       zip_code: shippingAddress.zip,
//       city: shippingAddress.city,
//       state: shippingAddress.state,
//       country: shippingAddress.country,
//       phone_number: '', // Add the phone number if required
//     },
//   };

//   try {
//     const response = await axiosInstance.post('/v1/orders', updatedOrderData, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Basic ${btoa(`${ZINC_HOST_API_KEY}:`)}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     throw (error.response && error.response.data) || 'Something went wrong';
//   }
// };

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
    // details: '/api/product/details',
    details: '/default/getZincProductDetails',
    variants: 'details/getZincProductDetailsByID',
    search: '/api/product/search',
  },
  // fosters: '/default/handleGetFosters',
  organization: {
    list: '/default/handleGetOrganizations', // Endpoint to get a list of fosters
    affiliates: '/default/handleGetAffiliates',
    createFoster: '/default/handleCreateFoster', // Endpoint to create a new foster
    editFoster: '/api/fosters/{id}', // Endpoint to edit a foster by ID (PUT or PATCH)
    deleteFoster: '/api/fosters/{id}', // Endpoint to delete a foster by ID
  },
  fosters: {
    getFosters: '/default/handleGetFosters',
    createFoster: '/default/handleCreateFoster',
    editFoster: '/api/fosters/{id}',
    deleteFoster: '/api/fosters/{id}',
  },
  user: {
    list: '/default/handleGetUsers',
    roles: '/default/handleGetUserRoles',
    update: '/default/handleEditUser',
    create: '/default/handleCreateUser',
  },
  products: {
    list: '/default/handleGetProducts', // Endpoint to get a list of fosters
    createProduct: '/default/handleCreateProduct', // Endpoint to get a list of fosters
  },
  orders: {
    list: '/default/handleGetOrders', // '/api/orders/list',      // Endpoint to list all orders
    updateTracking: '/default/updateOrderTracking',
    details: '/api/orders/{id}',   // Endpoint to get details of a specific order
    create: '/default/handleCreateOrder',  // Endpoint to create a new order
    update: '/api/orders/update/{id}', // Endpoint to update a specific order
    delete: '/api/orders/delete/{id}', // Endpoint to delete a specific order
    byCustomer: '/api/orders/by-customer/{customerId}', // Endpoint to get orders by customer ID
  },
};
