// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

export const ANYML_HOST_API = process.env.ANYML_HOST_API;
export const ANYML_HOST_API_LOCAL = 'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com';

// export const ANYML_ASSETS_API = process.env.ANYML_ASSETS_API;
export const ZINC_HOST_API = process.env.ZINC_HOST_API;
export const ZINC_HOST_API_KEY = process.env.ZINC_HOST_API_KEY;

export const LOCAL_SERVER_URL = 'http://localhost:3080/';

// Payment API
export const PAYMENT_API_KEY_DEV = process.env.PAYMENT_API_KEY_DEV;
export const PAYMENT_HOST_API = process.env.PAYMENT_HOST_API;

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.REACT_APP_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.REACT_APP_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  callbackUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.pet.cards;
export const PATH_AFTER_LOGOUT = paths.login;
