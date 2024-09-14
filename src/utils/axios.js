import axios from 'axios';
// config
import {
  HOST_API,
  ANYML_HOST_API,
  ANYML_HOST_API_LOCAL,
  ZINC_HOST_API,
  PAYMENT_API_KEY_DEV,
  PAYMENT_HOST_API
} from 'src/config-global';

// ----------------------------------------------------------------------
// Create axios instances for different APIs

// General API requests (MINIMAL API)
const axiosInstance = axios.create({ baseURL: HOST_API });

// ANYML-related API requests
const axiosInstanceANYML = axios.create({
  baseURL: process.env.REACT_APP_ENVIRONMENT === 'local' ? ANYML_HOST_API_LOCAL : ANYML_HOST_API,
});

// ZINC API requests
const axiosInstanceZINC = axios.create({ baseURL: ZINC_HOST_API });

// Payment API requests
const axiosInstancePayment = axios.create({ baseURL: PAYMENT_HOST_API });

// ----------------------------------------------------------------------
// --- Add interceptors for MINIMAL API, ANYML API, and Payment API ---

// MINIMAL API interceptors (general API requests)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// ANYML API interceptors
axiosInstanceANYML.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// ZINC API interceptors
axiosInstanceZINC.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// Payment API interceptors
axiosInstancePayment.interceptors.request.use(
  (config) => {
    config.headers['x-api-key'] = PAYMENT_API_KEY_DEV;
    config.headers['Content-Type'] = 'application/json';
    console.log('Final Config:', config);
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstancePayment.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// ----------------------------------------------------------------------
// Export axios instances for various APIs
export { axiosInstance, axiosInstanceANYML, axiosInstanceZINC, axiosInstancePayment };



// ----------------------------------------------------------------------

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
// Payment API Functions
// ====================

export const fetcherPayment = async (url, params = {}, config = {}) => {
  try {
    const response = await axiosInstancePayment.get(url, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetcherPayment:", error.response || error.message || error);
    throw error; // Ensure the error is passed up to the calling function
  }
};



export const postRequestPayment = async (url, data, config = {}) => {
  try {
    const response = await axiosInstancePayment.post(url, data, {
      ...config,
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
    createOrderV2: '/default/handleCreateOrderV2',  // Endpoint to create a new order
    update: '/api/orders/update/{id}', // Endpoint to update a specific order
    delete: '/api/orders/delete/{id}', // Endpoint to delete a specific order
    byCustomer: '/api/orders/by-customer/{customerId}', // Endpoint to get orders by customer ID
    retry: '/default/handleRetryOrder',
  },
  payment: {
    createPaymentMethod: 'dev/handleCreatePaymentMethod',
    list: 'dev/handleGetPaymentMethods',  // Make sure this is correct
  },
};
