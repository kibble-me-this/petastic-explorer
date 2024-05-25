import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { placeZincOrder } from './zinc';
import uuidv4 from '../utils/uuidv4';

// ----------------------------------------------------------------------

const URL = endpoints.orders;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// const mock_orders = [
//     {
//         id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//         orderNumber: "6010",
//         createdAt: "2024-05-15T21:30:38.723Z",
//         taxes: "10",
//         items: [
//             {
//                 id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//                 coverUrl: "https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_1.jpg",
//                 name: "Nike Air Force 1 NDESTRUKT",
//                 price: "83.74",
//                 quantity: "1",
//                 sku: "16H9UR0"
//             },

//         ],
//         customer: {
//             id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//             name: "Jayvion Simon",
//         },
//     },
//     {
//         id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//         orderNumber: "#6010",
//         createdAt: "2024-05-15T21:30:38.723Z",
//         taxes: 10,
//         items: [
//             {
//                 id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//                 sku: "16H9UR0",
//                 quantity: 1,
//                 name: "Nike Air Force 1 NDESTRUKT",
//                 coverUrl: "https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_1.jpg",
//                 price: 83.74,
//             },
//             {
//                 id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
//                 sku: "16H9UR1",
//                 quantity: 2,
//                 name: "Foundations Matte Flip Flop",
//                 coverUrl: "https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_2.jpg",
//                 price: 97.14,
//             },
//             {
//                 id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
//                 sku: "16H9UR2",
//                 quantity: 3,
//                 name: "Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear",
//                 coverUrl: "https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_3.jpg",
//                 price: 68.71,
//             },
//         ],
//         history: {
//             orderTime: "2024-05-14T20:30:38.723Z",
//             paymentTime: "2024-05-13T19:30:38.723Z",
//             deliveryTime: "2024-05-12T18:30:38.723Z",
//             completionTime: "2024-05-11T17:30:38.723Z",
//             timeline: [
//                 {
//                     title: "Delivery successful",
//                     time: "2024-05-14T20:30:38.723Z",
//                 },
//                 {
//                     title: "Transporting to [2]",
//                     time: "2024-05-13T19:30:38.723Z",
//                 },
//                 {
//                     title: "Transporting to [1]",
//                     time: "2024-05-12T18:30:38.723Z",
//                 },
//                 {
//                     title: "The shipping unit has picked up the goods",
//                     time: "2024-05-11T17:30:38.723Z",
//                 },
//                 {
//                     title: "Order has been created",
//                     time: "2024-05-10T16:30:38.723Z",
//                 },
//             ],
//         },
//         subTotal: 484.15,
//         shipping: 10,
//         discount: 10,
//         customer: {
//             id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
//             name: "Jayvion Simon",
//             email: "nannie_abernathy70@yahoo.com",
//             avatarUrl: "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg",
//             ipAddress: "192.158.1.38",
//         },
//         delivery: {
//             shipBy: "DHL",
//             speedy: "Standard",
//             trackingNumber: "SPX037739199373",
//         },
//         totalAmount: 474.15,
//         totalQuantity: 6,
//         shippingAddress: {
//             fullAddress: "19034 Verna Unions Apt. 164 - Honolulu, RI / 87535",
//             phoneNumber: "365-374-4961",
//         },
//         payment: {
//             cardType: "mastercard",
//             cardNumber: "**** **** **** 5678",
//         },
//         status: "refunded",
//     },
// ];

export function useGetOrders(account_id) {

    /**
     * Use mock order data
     */
    // const memoizedValue = useMemo(() => ({
    //     orders: mock_orders || [],
    //     isLoading,
    //     error,
    //     isEmpty: !isLoading && !mock_orders?.length,
    // }), [error, isLoading]);

    const { data, isLoading, error, isValidating } = useSWR(
        URL,
        () => fetcherANYML([URL.list, { account_id }]),
        options
    );

    const memoizedValue = useMemo(() => ({
        orders: data?.orders || [],
        isLoading,
        error,
        isEmpty: !isLoading && !data?.orders?.length,
    }), [data, error, isLoading]);

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createOrder(eventData) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const { items, billing: zincShippingAddress, subTotal: zincOrderTotal } = eventData;

    const zincItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
    }));

    let formattedOrder;

    /**
     * Work on server
     */
    try {
        const result = await placeZincOrder(zincItems, zincShippingAddress, zincOrderTotal);

        // Create the formatted order object
        formattedOrder = formatOrder(eventData, result);

        const thisOrder = {
            shelter_id: eventData.accountID, // "5ee83180fb01683673939629",
            new_order: { ...formattedOrder }
        };

        await postRequestANYML(URL.create, thisOrder, config);

        return formattedOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
    // finally {
    //     if (formattedOrder) {
    //         // Update the SWR cache
    //         mutate(URL, currentData => ({
    //             ...currentData,
    //             orders: [...(currentData.orders || []), formattedOrder],
    //         }), false); // The third parameter false means not to revalidate
    //     }
    // }
}

// ----------------------------------------------------------------------

export async function updateOrder(eventData) {
    /**
     * Work on server
     */
    // const data = { eventData };
    // await axios.put(endpoints.calendar, data);

    /**
     * Work in local
     */
    mutate(
        URL,
        (currentData) => {
            const orders = currentData.orders.map((order) =>
                order.id === eventData.id ? { ...order, ...eventData } : order
            );

            return {
                ...currentData,
                orders,
            };
        },
        false
    );
}

// ----------------------------------------------------------------------

export async function deleteOrder(eventId) {
    /**
     * Work on server
     */
    // const data = { eventId };
    // await axios.patch(endpoints.calendar, data);

    /**
     * Work in local
     */
    mutate(
        URL,
        (currentData) => {
            const orders = currentData.orders.filter((order) => order.id !== eventId);

            return {
                ...currentData,
                orders,
            };
        },
        false
    );
}

// ----------------------------------------------------------------------

function formatOrder(eventData, result) {
    return {
        id: uuidv4(), // Assuming request_id is used as id
        orderNumber: result.request_id,
        createdAt: new Date().toISOString(), // Use current date-time for createdAt
        taxes: "10", // Example value for taxes
        items: eventData.items.map(item => ({
            id: item.id,
            coverUrl: item.originalCoverUrl,
            name: item.name,
            price: item.priceSale,
            quantity: item.quantity,
            sku: item.id,
        })),
        customer: {
            id: uuidv4(), // Replace with actual customer ID
            name: eventData.billing.name, // Replace with actual customer name
        },
        history: {
            orderTime: new Date().toISOString(), // Example value for orderTime
            paymentTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Example value for paymentTime
            timeline: [
                {
                    title: "Order has been created",
                    time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
                },
            ],
        },
        subTotal: eventData.subTotal,
        shipping: eventData.shipping || 10, // Replace with actual shipping cost
        discount: eventData.discount || 10, // Replace with actual discount
        totalAmount: eventData.totalAmount || 474.15, // Replace with actual total amount
        totalQuantity: eventData.items.reduce((total, item) => total + item.quantity, 0),
        shippingAddress: {
            fullAddress: `${eventData.billing.address}, ${eventData.billing.city}, ${eventData.billing.state}, ${eventData.billing.zip}`,
            phoneNumber: eventData.billing.phone, // Replace with actual phone number
        },
        status: "pending",
    };
}