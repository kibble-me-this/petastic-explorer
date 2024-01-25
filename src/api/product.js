import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const oneProd = [
  {
    id: '1',
    gender: 'Unisex',
    publish: 'published',
    category: 'Pet Supplies',
    available: 10000,
    priceSale: 6.4,
    taxes: 0,
    quantity: 10000,
    sizes: ['Small (3 Count)'],
    inventoryType: 'in stock',
    images: [
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/81UKve6HqGL._AC_SX679_.jpg',
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/81UKve6HqGL._AC_SX679_.jpg',
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/81UKve6HqGL._AC_SX679_.jpg',
    ],
    ratings: [
      {
        name: '5 Star',
        starCount: 10233,
        reviewCount: 10233,
      },
    ],
    reviews: [],
    tags: [
      'Pet Supplies',
      'Puppy Chew Toys',
      'Teething',
      'Dog Treats',
      'Oral Health',
      'Made in USA',
    ],
    code: 'NYLABONE-PUPPY-STARTER-PACK',
    description:
      'SOFTER PUPPY CHEW TOY - Designed for puppies without adult teeth, the chicken flavored bone gently soothes gums during teething\nDURABLE CHEW TOY - Long-lasting bacon bone ideal for powerful puppies or pups with adult teeth\nHEALTHY DOG TREAT – Made with no added salt, no artificial preservatives, and no artificial colors\nSUPPORTS DOG ORAL HEALTH - Chew toys help reduce plaque and tartar as puppies chew\nUSA MADE – Dog chews are proudly crafted in the United States\nFOR SMALL DOGS: For puppies up to 25 lbs\nCHEW TOY DIMENSIONS: Out of package measures 4.5" long x 1 " wide x 1.75" high',
    newLabel: {
      enabled: false,
      content: '',
    },
    sku: 'NYLABONE-PUPPY-STARTER-SMALL',
    createdAt: '2024-01-25T18:39:04.538Z',
    saleLabel: {
      enabled: true,
      content: '54% OFF',
    },
    name: 'Nylabone Puppy Chew Toy & Treat Starter Pack - Small',
    price: 13.99,
    coverUrl:
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/81UKve6HqGL._AC_SX679_.jpg',
    totalRatings: 4.4,
    totalSold: 3000,
    totalReviews: 0,
    subDescription:
      "The Nylabone Puppy Chew Toy & Treat Starter Pack is specially designed to soothe teething puppies and promote oral health. Made in the USA, it's a safe and healthy choice for your furry friend.",
    colors: ['Chicken Flavor', 'Bacon Flavor'],
  },
  {
    id: '2',
    gender: 'Unisex',
    publish: 'published',
    category: 'Pet Supplies',
    available: 10000,
    priceSale: 60.5,
    taxes: 0,
    quantity: 10000,
    sizes: [
      '1gal Concentrate (Pack of 1)',
      '1gal Concentrate (Pack of 4)',
      '32oz Ready-to-Use (Pack of 1)',
    ],
    inventoryType: 'in stock',
    images: ['msx-ingress-image-1', 'msx-ingress-image-2'],
    ratings: [
      {
        name: '5 Star',
        starCount: 4041,
        reviewCount: 4041,
      },
    ],
    reviews: [],
    tags: [
      'Pet Supplies',
      'Disinfectant Cleaner',
      'Veterinary Use',
      'Animal Shelters',
      'Pet Foster Homes',
      'Kennels',
      'Litter Box',
      'Concentrate',
    ],
    code: 'REScue-Disinfectant-Cleaner-1gal',
    description:
      "Used by Vets, Loved by Pets - Kill pathogens in as little as 60 seconds with Rescue. Prevents outbreaks and kills a broad-spectrum of pathogens - including canine parvovirus\nGentle on users, animals and equipment. Rescue is OSHA-compliant and is a non-irritant with the lowest possible EPA toxicity rating. Does not require use of PPE.\nRecognize the benefits of a Fear-Free facility with America's Veterinarian Dr. Marty Becker. Help your facility become a favorite destination for dogs, cats and pet owners. Rescue works to remove fear pheramones which helps reduce stress in pets.\nDisinfection is prevention - save time with rapid contact times and an all in one step disinfectant and cleaner.\nPerfect for kennels, cages, litter boxes, floors. Rescue is made with Accelerated Hydrogen Peroxide and does not contain bleach or alcohol.",
    newLabel: {
      enabled: false,
      content: '',
    },
    sku: 'REScue-1gal-Concentrate',
    createdAt: '2024-01-25T18:39:04.538Z',
    saleLabel: {
      enabled: true,
      content: '33% OFF',
    },
    name: 'REScue One-Step Disinfectant Cleaner & Deodorizer - 1 Gallon Concentrate',
    price: 89.99,
    coverUrl:
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71yUFSzNj4L._SX522_.jpg',
    totalRatings: 4.7,
    totalSold: 1000,
    totalReviews: 0,
    subDescription:
      'REScue One-Step Disinfectant Cleaner & Deodorizer is a veterinary-grade disinfectant ideal for veterinary clinics, pet carriers, litter boxes, kennels, and more. It is known for its rapid pathogen-killing ability, safety for users and animals, and fear-reducing properties.',
    colors: ['No fragrance added'],
  },
  {
    id: '3',
    gender: 'Unisex',
    publish: 'published',
    category: 'Pet Supplies',
    available: 10000,
    priceSale: 26.0,
    taxes: 0,
    quantity: 10000,
    sizes: ['90 Count (Pack of 1)', '50 Count (Pack of 1)', '250 Count (Pack of 1)'],
    inventoryType: 'in stock',
    images: ['msx-ingress-image-1', 'msx-ingress-image-2'],
    ratings: [
      {
        name: '5 Star',
        starCount: 46281,
        reviewCount: 46281,
      },
    ],
    reviews: [],
    tags: [
      'Pet Supplies',
      'Multivitamin Treats',
      'Dog Joint Support',
      'Digestive Enzymes',
      'Probiotics',
      'Grain Free',
      'Skin & Coat',
      'Immune Health',
      'Chicken Flavor',
    ],
    code: 'Zesty-Paws-Multivitamin-Treats-90ct',
    description:
      "Zesty Paws Multivitamin Treats for Dogs are a delicious way to support your dog's joint health, digestive system, and immune health. These soft chews are available in various flavors and sizes, making them a convenient and tasty addition to your pet's diet.",
    newLabel: {
      enabled: false,
      content: '',
    },
    sku: 'Zesty-Paws-90ct-Chicken',
    createdAt: '2024-01-25T18:39:04.538Z',
    saleLabel: {
      enabled: true,
      content: '13% OFF',
    },
    name: 'Zesty Paws Multivitamin Treats for Dogs - 90 Count (Chicken Flavor)',
    price: 29.97,
    coverUrl:
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/7183A1-ljvL._AC_SX679_.jpg',
    totalRatings: 4.5,
    totalSold: 10000,
    totalReviews: 0,
    subDescription:
      "Zesty Paws Multivitamin Treats for Dogs provide a tasty way to support your dog's overall health. With ingredients like Glucosamine, Chondroitin, Digestive Enzymes, and Probiotics, these soft chews are a great addition to your dog's daily routine.",
    colors: [
      'Chicken Flavor',
      'Peanut Butter',
      'Beef',
      'Bison',
      'Chicken - Advanced',
      'Chicken - Mini Bites',
      'Chicken - Puppy Bites',
    ],
  },
  {
    id: 'unique_product_id_here',
    gender: 'Unisex',
    publish: 'published',
    category: 'Pet Supplies',
    available: 10000,
    priceSale: 16.98,
    taxes: 0,
    quantity: 10000,
    sizes: ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'],
    inventoryType: 'in stock',
    images: ['msx-ingress-image-1', 'msx-ingress-image-2'],
    ratings: [
      {
        name: '5 Star',
        starCount: 165109,
        reviewCount: 165109,
      },
    ],
    reviews: [],
    tags: [
      'Pet Supplies',
      'Dog Harness',
      'No-Pull',
      'Adjustable',
      'Reflective',
      'Easy Control Handle',
      'Large Dogs',
      'Black',
    ],
    code: 'rabbitgoo-Dog-Harness-Large-Black',
    description:
      "The rabbitgoo Dog Harness is designed for dogs of all sizes, from small to large breeds. It provides a comfortable and safe way to control your dog during walks. With adjustable straps and reflective features, it's a great choice for both day and night outings.",
    newLabel: {
      enabled: false,
      content: '',
    },
    sku: 'rabbitgoo-Dog-Harness-Large-Black',
    createdAt: '2024-01-25T18:39:04.538Z',
    saleLabel: {
      enabled: true,
      content: '4% OFF',
    },
    name: 'rabbitgoo Dog Harness - Large, Black',
    price: 17.83,
    coverUrl:
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71QaVHD-ZDL._AC_SX679_.jpg',
    totalRatings: 4.5,
    totalSold: 8000,
    totalReviews: 0,
    subDescription:
      "The rabbitgoo Dog Harness is designed to make your dog stand out during walks. It features a no-pull design, easy-to-use buckles, and is made of durable materials for your dog's comfort and safety.",
    colors: [
      'Black',
      'Beige',
      'Blue',
      'Blue Coral',
      'Dazzling Blue',
      'Gray',
      'Hot Pink',
      'Orange',
      'Pink',
      'Purple',
      'Red',
      'Teal',
      'Turquoise',
      'Wild Lime',
    ],
  },
  {
    id: '4',
    gender: 'Unisex',
    publish: 'published',
    category: 'Pet Supplies',
    available: 10000,
    priceSale: 51.99,
    taxes: 0,
    quantity: 10000,
    sizes: ['4.1 oz', '8.2 oz', '16.4 oz'],
    inventoryType: 'in stock',
    images: ['msx-ingress-image-1', 'msx-ingress-image-2'],
    ratings: [
      {
        name: '5 Star',
        starCount: 3653,
        reviewCount: 3653,
      },
    ],
    reviews: [],
    tags: [
      'Pet Supplies',
      'Probiotic for Dogs',
      'Digestive Support',
      'Prebiotic',
      'Pumpkin Flavor',
    ],
    code: 'Native-Pet-Probiotic-16.4oz',
    description:
      "Native Pet Probiotic for Dogs is a natural supplement designed to support your dog's gut flora and address common digestive issues such as diarrhea, upset stomach, gas, and bloating. It contains a blend of four probiotic strains, prebiotic fiber, and tasty bone broth.",
    newLabel: {
      enabled: false,
      content: '',
    },
    sku: 'Native-Pet-Probiotic-16.4oz',
    createdAt: '2024-01-25T18:39:04.538Z',
    saleLabel: {
      enabled: false,
      content: '',
    },
    name: 'Native Pet Probiotic for Dogs - 16.4 oz, Pumpkin Flavor',
    price: 51.99,
    coverUrl:
      'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71PwXP0IbQL._AC_SX679_.jpg',
    totalRatings: 4.4,
    totalSold: 1000,
    totalReviews: 0,
    subDescription:
      "Native Pet Probiotic for Dogs is a vet nutritionist and PhD-developed solution for digestive health in dogs. It's made with natural ingredients, including probiotics, prebiotics, and bone broth, to provide effective gut support for your furry friend.",
    colors: ['Pumpkin Flavor'],
  },
];

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: oneProd || [], // data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !oneProd.length, // !data?.products.length,
    }),
    // [data?.products, error, isLoading, isValidating]
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

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

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
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
