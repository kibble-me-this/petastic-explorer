// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  login: `${ROOTS.AUTH}/magiclink/login`,
  register: `${ROOTS.AUTH}/magiclink/register`,
  open_checkout: '/checkout',
  open_chat: '/chat',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  // pricing: '/pricing',
  // payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  // components: '/components',
  explorer: 'https://explorer.petastic.com/',
  petsSignIn: 'https://my.petastic.com/login',
  petsSignUp: 'https://my.petastic.com/register',
  // docs: 'https://docs.minimals.cc',
  // changelog: 'https://docs.minimals.cc/changelog',
  // zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  // minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  // figma:
  //   'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  product: {
    // root: `/product`,
    // checkout: `/product/checkout`,
    root: `${ROOTS.DASHBOARD}/org/product`,
    checkout: `${ROOTS.DASHBOARD}/org/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },

  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    magic: {
      login: `${ROOTS.AUTH}/magiclink/login`,
      verify: `${ROOTS.AUTH}/magiclink/verify`,
      register: `${ROOTS.AUTH}/magiclink/register`,
      forgotPassword: `${ROOTS.AUTH}/magiclink/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },

  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    // chat: `${ROOTS.DASHBOARD}/chat`,
    chat: `${ROOTS.DASHBOARD}/chat?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4`,

    chat_home: `/`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    pet: {
      root: `${ROOTS.DASHBOARD}/pet`,
      new: `${ROOTS.DASHBOARD}/pet/new`,
      list: `${ROOTS.DASHBOARD}/pet/list`,
      cards: `${ROOTS.DASHBOARD}/pet/cards`,
      profile: `${ROOTS.DASHBOARD}/pet/profile`,
      account: `${ROOTS.DASHBOARD}/pet/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/pet/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/pet/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      // details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      details: (accountId, id) => `${ROOTS.DASHBOARD}/product/${accountId}/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (accountId, id) => `${ROOTS.DASHBOARD}/order/${accountId}/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    orgpets: {
      root: `${ROOTS.DASHBOARD}/orgpets`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    org: {
      root: `${ROOTS.DASHBOARD}/org`,
      new: `${ROOTS.DASHBOARD}/org/new`,
      details: (id) => `${ROOTS.DASHBOARD}/org/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/org/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/org/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/org/${MOCK_ID}/edit`,
      },
      admin: {
        root: `${ROOTS.DASHBOARD}/org/admin/list`,
        new: `${ROOTS.DASHBOARD}/org/admin/new`,
      }
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },

  // ADMIN section for orders and orgs
  admin: {
    order: {
      root: `${ROOTS.DASHBOARD}/admin/order/list`,
      details: (accountId, id) => `${ROOTS.DASHBOARD}/admin/order/${accountId}/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/admin/order/${MOCK_ID}`,
      },
      edit: (accountId, id) => `${ROOTS.DASHBOARD}/admin/order/${accountId}/${id}/edit`,
      delete: (accountId, id) => `${ROOTS.DASHBOARD}/admin/order/${accountId}/${id}/delete`,
    },
    org: {
      root: `${ROOTS.DASHBOARD}/admin/org`,
      list: `${ROOTS.DASHBOARD}/admin/org/list`,
      new: `${ROOTS.DASHBOARD}/admin/org/new`,
      details: (id) => `${ROOTS.DASHBOARD}/admin/org/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/admin/org/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/admin/org/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/admin/org/${MOCK_ID}/edit`,
      },
    },
  },
};
