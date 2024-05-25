
import useSWR from 'swr';
import { useMemo, useEffect } from 'react';
// utils
import { fetcherProduct, dispatchZincOrder, fetcher, endpoints } from 'src/utils/axios-zinc';
import emailjs from '@emailjs/browser';

const ZINC_API_ORDERS = 'https://api.zinc.com/v1/orders';

// ----------------------------------------------------------------------

// export function useGetProducts() {
//   const URL = endpoints.product.list;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       products: data?.products || [],
//       productsLoading: isLoading,
//       productsError: error,
//       productsValidating: isValidating,
//       productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.products, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export function useCustomSWR(productIds, ...args) {
  return useSWR(productIds, () => fetcherProduct(productIds, ...args));
}

// ----------------------------------------------------------------------

export function useGetProducts(orgId) {
  // Define your organizations array with formatted IDs
  const organizations = [
    {
      id: '5ee83180f121686526084263',
      name: 'Animal Haven',
      products: [
        'B0C8MVSGPZ',
        'B0BT9THM82',
        'B0983HLGQ5',
        'B0B9WSHTS4',
        'B01LEWILYE',
        'B01LEW4YZE',
        'B01B3MG6X8',
        'B09LCVR127',
        'B09PFP1457',
        'B08M5J8JMN',
        'B09D7DWTVB',
        'B0B8CZM73P',
        'B07FBZVWB4',
        'B00FN4PP9Y',
        'B095T2Y46B',
        'B001KEWW7E',
        'B00HAHYKR0',
        // // 'B001KEWU6M', // repeat
        // // 'B00QKZAKPY', // repeat
        'B01N106KPK',
        'B09M48SRPR',
        'B00JAEKHOG', // no price
        'B09M465CDC',
        'B07W81Y4LR',
        'B0BJFNTNRL',
        'B01BTUNHSQ',
        'B09G4MP29H',
        'B06X6F21Z9',
        'B00N11PEPQ',
        'B09DJ6CD2B',
        'B094G3YFQT',
        'B094RD9P53',
        'B09BZFR968',
        'B07F45GGPT',
        'B07VFH1QMC',
        'B077B9PHKD',
        'B003RQNE7U',
        'B06VVY88VR',
        'B085LMFTVB',
        'B00TFYT2WY',
        // 'B07YVLHKC2', // crash
        'B01D8N22HO',
        'B002VSDVJ6',
        'B08288SG9K',
        'B001V7UHG8',
        'B094M1GPHB',
        'B01B37WUXI',
        'B07NLD18RW',
        'B07XV51KKS',
        'B000NV9VQA',
        'B07V4WSPBG',
        'B074JDQ7K9',
        'B08T7493WJ',
        'B00OLSARS2',
        'B0002ASCS0',
        'B07D356XY8',
        'B087QB95XH',
        'B098DM7T1T',
        'B00P0YQYYW',
        'B07VFH1QMC',
        'B01AHM6P18',
        'B088BBLB9W',
        'B07Y7T7TV6',
        'B0000AH9UH',
        'B001FO1CZW',
        'B01N7FKFY7',
        'B00A3XS95M',
        'B00MOIC3OW',
        'B07LB7G87L',
        'B000084F39',
        'B000FK21GQ',
        'B001DCAAP4',
        'B00TFYT02G',
        'B07TR6CZJD',
        'B000JCWAWA',
        'B01GPE55YA',
        'B000HDOPGA',
        'B0179BQC5O',
        'B077NP4RNH',
        'B077NND9PC',
        'B000WFRQ96',
        'B005OB3E30',
        'B07DK8L1R1',
        'B000MVX70W',
        'B0026N208O',
        'B0002J1FOE',
        'B01018DC96',
        'B00EB4ADQW',
        'B00EZMPD4W',
        'B0017D1GG6',
        'B00C351GBC',
        'B01DAI5CF6',
      ],
    },
    {
      id: '5ee83180fb01683673939629',
      name: 'Strong Paws',
      products: [
        "B0050ICOW4",
        "B09NWC4HBY",
        "B0094RW6ZC",
        'B09G48LHVX',
        'B0002DHXVE',
        'B0002DGL26',
        'B00B9G3ZJM',
        // 'B00FE1CFTE',
        'B00FE1CE9A',
        'B07121B839',
        'B01HGQP7DK',
        'B013JDKGCG',
        'B071R3FM21',
        'B00028MWG0',
        'B01M8JT6FT',
        'B0BGGPM66Z',
        'B09LVV5MY6',
        'B01IUYFBPQ',
        'B00A4JGL1E',
        'B08BW6HPCM',
        'B07MM2N1NL',
        'B072FVZ1Z9',
        'B08NJJQ1KW',
        // 'B0C1BW323L', 
        'B0C6D588VS',
        'B01KTNNJWI',
        'B000634CK0',
        'B09NWFJR7P',
        'B07SD8SQWK',
        'B01DLS2EX8',
        'B01DLS2F0A',
        'B01DLS2EYW',
        'B08615R732',
        'B09VT4JN7W',
        'B07ZGMGTCJ',
        'B071RVWGYJ',
        'B094FR5R5D',
        'B072MPKF5X',
        'B009WADXCG',
        'B000261OFM',
        'B002ZJB4PO'
      ],
    },
    {
      id: '5ee83180f8a1683475024978',
      name: 'Second Chance Rescue',
      products: [
        'B01DCG0GPC',
        'B00J4YY0O0',
        'B002YD8FK8',
        'B0753NHZVQ',
        'B018IZAL6G',
        'B018IZAME2',
        'B0751RPD3V',
        'B09NQRD56L',
        'B09FW2R4W1',
        'B000V9YYMK',
        'B005FH7JP2',
        'B00M56E0JO',
        'B00007J6CX',
        'B006OVQV1G',
        'B09F8NLGCD',
        // 'B09F89LYPN',
        'B09V65VY5J',
        // 'B07GL8SLKY',
        // 'B089LLHMQL',
        'B06ZZ4679J',
        // 'B0BNP527D2',
        // 'B09P32SSRL',
        'B08749HDV7',
        // 'B08742YDKK',
        'B08746LRDJ',
        // 'B0874CH399',
        // 'B087423VBW',
        // 'B08WTNQPZP',
        // 'B08WT8HZZH',
        // 'B08WTF8Q2S',
        // 'B0873XV1R7',
        // 'B0873ZD5HY',
        // 'B09ZDR3ZK7',
        // 'B08WTBH61N',
        // 'B08WTT7HGQ',
        // 'B08WTFWHB5',
        // 'B0873WP8VQ',
        // 'B0874DYTYX',
        // 'B0873VL5KL',
        // 'B0874BNKHH',
        'B0873XTSPB',
        // 'B0873ZZMZ1',
        'B0BLT6PY1P',
        'B002SSIQZI',
        // 'B0BLTTLG31',
        // 'B000XS6RJW',
        // 'B0BLT6XXBZ',
        // 'B0BHRZMHW3',
        // 'B0BLT7NXLW',
        'B003YVMUFK',
        // 'B0CNS61JJZ',
        // 'B00VRJU2Y2',
        // 'B0CNS5XLJT',
        // 'B00063434K',
        // 'B004P3970C',
        // 'B004HFRMEQ',
        // 'B0733LNDFV',
        // 'B0CNS5FR2N',
        'B01BI31WCC',
        'B083X3WWHT',
        // 'B083X4GVYF',
      ],
    },
    {
      id: '5ee83180f271685767429993',
      name: 'Muddy Paws Rescue',
      products: [
        'B0BFVZTF2D',
        'B01EY9KPZM',
        'B003M674QC',
        'B07FFGNNDD',
        'B01NAUEDP2',
        'B0038WP1YC',
        'B00P0YQYYW',
        'B003ALMW0M',
        'B000QFT1R2',
        'B00F97RJH6',
        'B00X6THK82',
        'B01EY9KQ2Y',
        'B0018CLGRU',
        'B001QCKS4O',
        'B003R0LLIA',
        'B001OC5UMQ',
        'B001JQLNB4',
        'B000261O02',
        'B00N54E9MI',
        'B000QFWCJ6',
        'B000OXAERM',
        'B0719Q85G8',
        'B000HBC8O8'
      ],
    },
    {
      id: '5fe931824271705684215701',
      name: 'Brixies Rescue Inc',
      products: [
        'B09RPVS7SM',
        'B014UTY5G6',
        'B07P488YBD',
        'B07P47VBCR',
        'B07NXTTVW5',
        'B01BWKMUWM',
        'B0037Z6VK8',
        'B079YXSQXM',
        'B07MMP6JFT',
        'B0016A1HE6',
        'B000WFKMRY',
        'B01GX0SNHC',
        'B0C4SS79H9',
        'B09NW83XJ2',
        'B007JCHA6E',
        'B09KTKYP9F',
        'B004U8T97S',
        'B0BY87C463',
        'B085LRCQZC',
        // 'B0BW5WRLF9',
        'B005CUTY7I',
        'B0037Z6VKS',
        'B01IUPTKFM',
        'B003DA55K4',
        'B08PMHCFNC',
        'B09RQ9TMDX',
        'B0BBVT54HL',
        'B00028ZLDG',
        'B00B9G3ZJM',
        'B016LB9RZA',
        'B09XTJ694S',
        'B0722XGRMB',
        'B0058LTWLE',
        'B000WD6UA4',
        'B0C1GWY1C8',
        'B07D1DMZJ9',
        'B07FN5MLTY',
        'B07MVN3SHB',
        'B001650NNW',
        'B0BP9JJDVW',
        'B01BMBPOF6',
        'B00061MSNU',
        'B08SW8T9P3',
        'B09GG72J3Q',
        'B0C27FHMKX',
        'B07CMNNFXS',
        'B09G2HZ5X2',
        'B016V2UEX8',
        'B0BGXZM5VZ',
        // 'B0007RTEB2',
        'B07DTJB854',
        'B0BTKVVDNY',
        'B0BYZD6JTV',
        'B00IZ9Z39G',
        'B0B9GVT2N2',
        'B0CM8SX88F',
        'B00X1A4UPM',
        'B000A6BD5K',
        'B000OXAER2',
        'B0BMW5PR9X',
        'B0BFZRHNP5',
        'B0B9WT12SY',
        'B0BDMD6GK8',
        'B09CGS3R41'
      ],
    },
  ];

  // Find the organization by ID
  const organization = organizations.find((org) => org.id === orgId);

  // If organization is not found, return empty array for products
  const productIds = organization ? organization.products : [];

  // Use SWR hook with the product IDs
  const { data, isLoading, error, isValidating } = useCustomSWR(productIds);

  if (data) {
    data.forEach((product) => {
      product.category = 'Apparel';
    });
  }

  // Memoize the returned value
  const memoizedValue = useMemo(
    () => ({
      products: data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  console.log('useGetProducts memoizedValue: ', memoizedValue);
  return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetProduct(productId) {
//   const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

//   // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const { data, isLoading, error, isValidating } = useCustomSWR([productId]);
//   console.log('here: ', data);

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export function useGetProduct(productId, callback = () => { }) {
  console.log('useGetProduct productId: ', productId);
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  // Fetch data using SWR
  const { data, isLoading, error, isValidating } = useCustomSWR([productId]);

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
export async function placeZincOrder(items, shippingAddress, subTotal) {
  try {
    const orderResults = await dispatchZincOrder(
      {
        url: ZINC_API_ORDERS,
        method: 'post',
      },
      items,
      shippingAddress,
      subTotal
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