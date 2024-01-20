import axios from 'axios';
// config
// import { HOST_API } from 'src/config-global';
// import { HOST_API_PETASTIC } from 'src/config-global';

const HOST_API_PETASTIC = 'https://m6gwl7mruc.execute-api.us-west-1.amazonaws.com';

// ----------------------------------------------------------------------

// const axiosInstance = axios.create({ baseURL: HOST_API });
const axiosInstance = axios.create({ baseURL: HOST_API_PETASTIC });

console.log("HOST_API_PETASTIC: ", HOST_API_PETASTIC);
console.log("axiosInstance: ", axiosInstance);


axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {

  console.log("fetcher args: ", args);

  // const [url, config] = Array.isArray(args) ? args : [args];

  const url = '/Prod/blogs'; // The relative path or endpoint
  const config = {
    params: {
      limit: 10,
      page: 1,
      category: 'Health',
      uxv: 'v-1.4.0',
      _sn_cid: '1705683618_l5itTPH8u3uBGvl',
      _sn_csid: '1705683618_QeEBXFnZtWmFEnX',
      executed_at: '1705683670.055'
    }
  };

  console.log("fetcher args url: ", url);
  console.log("fetcher args config: ", config);

  const res = await axiosInstance.get(url, { ...config });

  console.log("fetcher res: ", res);

  return res.data;
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
