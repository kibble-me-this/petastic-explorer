import { _mock } from './_mock';

// APP
// ----------------------------------------------------------------------

export const _appRelated = ['California', 'Texas','New York',  'Florida',  'Pennsylvania'].map(
  (name, index) => {
    // const system = [2, 4].includes(index) ? 'Windows' : 'Mac';

    // const price = [2, 4].includes(index) ? _mock.number.price(index) : 0;

    const shortcut =
      (name === 'California' && '/assets/icons/app/state-flags/california-171909.svg') ||
      (name === 'Florida' && '/assets/icons/app/state-flags/florida-171907.svg') ||
      (name === 'New York' && '/assets/icons/app/state-flags/new-171879.svg') ||
      (name === 'Texas' && '/assets/icons/app/state-flags/texas-171877.svg') ||
      (name === 'Pennsylvania' && '/assets/icons/app/state-flags/pennsylvania-171901.svg') ||
      '/assets/icons/app/ic_github.svg';

    const totalReviews =
      (name === 'California' && 93802) ||
      (name === 'Florida' && 40848) ||
      (name === 'New York' && 42031) ||
      (name === 'Texas' && 76020) ||
      (name === 'Pennsylvania' && 35561) ||
      '/assets/icons/app/ic_github.svg';  

    return {
      id: _mock.id(index),
      name,
      // price,
      // system,
      shortcut,
      // ratingNumber: _mock.number.rating(index),
      totalReviews
    };
  }
);

export const _appInstalled = ['New York', 'Florida', 'California', 'Texas', 'Pennsylvania'].map(
  (name, index) => ({
    id: _mock.id(index),
    name,
    android: _mock.number.nativeL(index),
    windows: _mock.number.nativeL(index + 1),
    apple: _mock.number.nativeL(index + 2),
    flag: ['flagpack:de', 'flagpack:gb-nir', 'flagpack:fr', 'flagpack:kr', 'flagpack:us'][index],
  })
);

const topStates = [
  {
    id: "customId3",
    name: "New York",
    avatarUrl: "url/to/avatar1.jpg",
    totalFavorites: 25786,
  }, 
  {
    id: "customId2",
    name: "Florida",
    avatarUrl: "url/to/avatar2.jpg",
    totalFavorites: 27241,
  },
 {
    id: "customId1",
    name: "California",
    avatarUrl: "url/to/avatar3.jpg",
    totalFavorites: 59151,
  },
];
const topDogs = [
    {
    id: "customId1",
    name: "Labrador Retriever",
    avatarUrl: "url/to/avatar3.jpg",
    totalFavorites: 72906,
  },
  {
    id: "customId2",
    name: "Pit Bull Terrier",
    avatarUrl: "url/to/avatar2.jpg",
    totalFavorites: 46009,
  },
  {
    id: "customId3",
    name: "German Shepherd Dog",
    avatarUrl: "url/to/avatar1.jpg",
    totalFavorites: 22112,
  },
  {
    id: "customId4",
    name: "Chihuahua",
    avatarUrl: "url/to/avatar2.jpg",
    totalFavorites: 20385,
  },
  {
    id: "customId5",
    name: "Hound",
    avatarUrl: "url/to/avatar1.jpg",
    totalFavorites: 15098,
  },

];

const topCats = [
  {
    id: "customId1",
    name: "Domestic Short Hair",
    avatarUrl: "url/to/avatar1.jpg",
    totalFavorites: 55210,
  },
  {
    id: "customId2",
    name: "Tabby",
    avatarUrl: "url/to/avatar2.jpg",
    totalFavorites: 22322,
  },
  {
    id: "customId3",
    name: "Domestic Medium Hair",
    avatarUrl: "url/to/avatar3.jpg",
    totalFavorites: 19599,
  },
  {
    id: "customId4",
    name: "TaDomestic Medium Hair",
    avatarUrl: "url/to/avatar2.jpg",
    totalFavorites: 10705,
  },
  {
    id: "customId5",
    name: "Siamese",
    avatarUrl: "url/to/avatar3.jpg",
    totalFavorites: 7443,
  },
];

export const _appAuthors = topStates;
export const _topStates = topStates;
export const _topDogs = topDogs;
export const _topCats = topCats;


// export const _appAuthors = [...Array(3)].map((_, index) => ({
//   id: _mock.id(index),
//   name: _mock.fullName(index),
//   avatarUrl: _mock.image.avatar(index),
//   totalFavorites: _mock.number.nativeL(index),
// }));

export const _appInvoices = [...Array(5)].map((_, index) => {
  const category = ['Android', 'Mac', 'Windows', 'Android', 'Mac'][index];

  const status = ['paid', 'out of date', 'progress', 'paid', 'paid'][index];

  return {
    id: _mock.id(index),
    invoiceNumber: `INV-199${index}`,
    price: _mock.number.price(index),
    category,
    status,
  };
});

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  description: _mock.sentence(index),
  coverUrl: _mock.image.cover(index),
}));

// ANALYTIC
// ----------------------------------------------------------------------

export const _analyticTasks = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.taskNames(index),
}));

export const _analyticPosts = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.sentence(index),
}));

export const _analyticOrderTimeline = [...Array(5)].map((_, index) => {
  const title = [
    'Shelter :: submits change of owenrship',
    'Parent :: exits with new pet',
    'Parent :: opens email from FetchAi',
    'FetchAi :: guides pet owner through day 1',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index];

  return {
    id: _mock.id(index),
    title,
    type: `order${index + 1}`,
    time: _mock.time(index),
  };
});

export const _analyticTraffic = [
  {
    value: 'facebook',
    label: 'FaceBook',
    total: _mock.number.nativeL(1),
    icon: 'eva:facebook-fill',
  },
  {
    value: 'google',
    label: 'Google',
    total: _mock.number.nativeL(2),
    icon: 'eva:google-fill',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: _mock.number.nativeL(3),
    icon: 'eva:linkedin-fill',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: _mock.number.nativeL(4),
    icon: 'eva:twitter-fill',
  },
];

// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = ['Total Profit', 'Total Income', 'Total Expenses'].map(
  (label, index) => ({
    label,
    totalAmount: _mock.number.price(index) * 100,
    value: _mock.number.percent(index),
  })
);

export const _ecommerceBestSalesman = [...Array(5)].map((_, index) => {
  const category = ['CAP', 'Branded Shoes', 'Headphone', 'Cell Phone', 'Earings'][index];

  const flag = ['flagpack:de', 'flagpack:gb-nir', 'flagpack:fr', 'flagpack:kr', 'flagpack:us'][
    index
  ];

  return {
    id: _mock.id(index),
    flag,
    category,
    rank: `Top ${index + 1}`,
    email: _mock.email(index),
    name: _mock.fullName(index),
    totalAmount: _mock.number.price(index),
    avatarUrl: _mock.image.avatar(index + 8),
  };
});

export const _ecommerceLatestProducts = [...Array(5)].map((_, index) => {
  const colors = (index === 0 && ['#2EC4B6', '#E71D36', '#FF9F1C', '#011627']) ||
    (index === 1 && ['#92140C', '#FFCF99']) ||
    (index === 2 && ['#0CECDD', '#FFF338', '#FF67E7', '#C400FF', '#52006A', '#046582']) ||
    (index === 3 && ['#845EC2', '#E4007C', '#2A1A5E']) || ['#090088'];

  return {
    id: _mock.id(index),
    colors,
    name: _mock.productName(index),
    price: _mock.number.price(index),
    coverUrl: _mock.image.product(index),
    priceSale: [1, 3].includes(index) ? _mock.number.price(index) : 0,
  };
});

export const _ecommerceNewProducts = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
}));

// BANKING
// ----------------------------------------------------------------------

export const _bankingContacts = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _bankingCreditCard = [
  {
    id: _mock.id(2),
    balance: 23432.03,
    cardType: 'mastercard',
    cardHolder: _mock.fullName(2),
    cardNumber: '**** **** **** 3640',
    cardValid: '11/22',
  },
  {
    id: _mock.id(3),
    balance: 18000.23,
    cardType: 'visa',
    cardHolder: _mock.fullName(3),
    cardNumber: '**** **** **** 8864',
    cardValid: '11/25',
  },
  {
    id: _mock.id(4),
    balance: 2000.89,
    cardType: 'mastercard',
    cardHolder: _mock.fullName(4),
    cardNumber: '**** **** **** 7755',
    cardValid: '11/22',
  },
];

export const _bankingRecentTransitions = [
  {
    id: _mock.id(2),
    name: _mock.fullName(2),
    avatarUrl: _mock.image.avatar(2),
    type: 'Income',
    message: 'Receive money from',
    category: 'Annette Black',
    date: _mock.time(2),
    status: 'progress',
    amount: _mock.number.price(2),
  },
  {
    id: _mock.id(3),
    name: _mock.fullName(3),
    avatarUrl: _mock.image.avatar(3),
    type: 'Expenses',
    message: 'Payment for',
    category: 'Courtney Henry',
    date: _mock.time(3),
    status: 'completed',
    amount: _mock.number.price(3),
  },
  {
    id: _mock.id(4),
    name: _mock.fullName(4),
    avatarUrl: _mock.image.avatar(4),
    type: 'Receive',
    message: 'Payment for',
    category: 'Theresa Webb',
    date: _mock.time(4),
    status: 'failed',
    amount: _mock.number.price(4),
  },
  {
    id: _mock.id(5),
    name: null,
    avatarUrl: null,
    type: 'Expenses',
    message: 'Payment for',
    category: 'Beauty & Health',
    date: _mock.time(5),
    status: 'completed',
    amount: _mock.number.price(5),
  },
  {
    id: _mock.id(6),
    name: null,
    avatarUrl: null,
    type: 'Expenses',
    message: 'Payment for',
    category: 'Books',
    date: _mock.time(6),
    status: 'progress',
    amount: _mock.number.price(6),
  },
];

// BOOKING
// ----------------------------------------------------------------------

export const _bookings = [...Array(5)].map((_, index) => {
  const status = ['Paid', 'Paid', 'Pending', 'Cancelled', 'Paid'][index];

  const customer = {
    avatarUrl: _mock.image.avatar(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
  };

  const destination = [...Array(5)].map((__, _index) => ({
    name: _mock.tourName(_index + 1),
    coverUrl: _mock.image.travel(_index + 1),
  }))[index];

  return {
    id: _mock.id(index),
    destination,
    status,
    customer,
    checkIn: _mock.time(index),
    checkOut: _mock.time(index),
  };
});

export const _bookingsOverview = [...Array(5)].map((_, index) => ({
  status: ['Adoptable Pets on Network', 'Pets @ Activated Shelters', 'Adopted', 'FetchAi Onboarded', 'FetchAi Commerce (clicks)'][index],
  quantity: _mock.number.percent(index) * 1000,
  value: _mock.number.percent(index),
}));

export const _bookingReview = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  postedAt: _mock.time(index),
  rating: _mock.number.rating(index),
  avatarUrl: _mock.image.avatar(index),
  description: _mock.description(index),
  tags: ['Great Sevice', 'Recommended', 'Best Price'],
}));

export const _bookingNew = [...Array(5)].map((_, index) => ({
  guests: '3-5',
  id: _mock.id(index),
  bookedAt: _mock.time(index),
  duration: '3 days 2 nights',
  isHot: _mock.boolean(index),
  name: _mock.fullName(index),
  price: _mock.number.price(index),
  avatarUrl: _mock.image.avatar(index),
  coverUrl: _mock.image.travel(index),
}));
