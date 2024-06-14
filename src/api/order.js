import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import { placeZincOrder } from './zinc';
import uuidv4 from '../utils/uuidv4';

const URL = endpoints.orders;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetOrders(account_id, { enabled = true } = {}) {
    const { data, isLoading, error } = useSWR(
        enabled && account_id ? [URL, { account_id }] : null,
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

    const { items, billing: zincShippingAddress, subTotal: zincOrderTotal, accountID: account_id } = eventData;

    const zincItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
    }));

    try {
        const result = await placeZincOrder(zincItems, zincShippingAddress, zincOrderTotal);

        // Create the formatted order object
        const formattedOrder = formatOrder(eventData, result);

        const thisOrder = {
            shelter_id: account_id,
            new_order: { ...formattedOrder }
        };

        await postRequestANYML(URL.create, thisOrder, config);

        // Update the SWR cache
        mutate(URL, currentData => {
            const orders = currentData?.orders ? [...currentData.orders, formattedOrder] : [formattedOrder];
            return {
                ...currentData,
                orders,
            };
        }, false);

        return formattedOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------

export async function updateOrder(eventData) {
    mutate(
        URL,
        (currentData) => {
            const orders = currentData?.orders?.map((order) =>
                order.id === eventData.id ? { ...order, ...eventData } : order
            ) || [];
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
    mutate(
        URL,
        (currentData) => {
            const orders = currentData?.orders?.filter((order) => order.id !== eventId) || [];
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
            email: eventData.billing.email, // Replace with actual customer email
            avatarUrl: eventData.billing.avatarUrl, // Replace with actual customer avatar URL
            ipAddress: eventData.billing.ipAddress, // Replace with actual customer IP address
        },
        history: {
            orderTime: new Date().toISOString(), // Example value for orderTime
            paymentTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Example value for paymentTime
            deliveryTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Example value for deliveryTime
            completionTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // Example value for completionTime
            timeline: [
                {
                    title: "Order has been created",
                    time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
                },
                {
                    title: "The shipping unit has picked up the goods",
                    time: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
                },
                {
                    title: "Transporting to [1]",
                    time: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
                },
                {
                    title: "Transporting to [2]",
                    time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
                },
                {
                    title: "Delivery successful",
                    time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
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
        delivery: {
            shipBy: eventData.delivery?.shipBy || "Amazon Shipping", // Replace with actual shipping company
            speedy: eventData.delivery?.speedy || "Prime", // Replace with actual shipping speed
            trackingNumber: eventData.delivery?.trackingNumber || "Awaiting Tracking Number", // Replace with actual tracking number
        },
        payment: {
            cardType: eventData.payment?.cardType || "Kibble Rewards", // Replace with actual card type
            cardNumber: eventData.payment?.cardNumber || "**** **** **** 5678", // Replace with actual card number
        },
        status: eventData.status || "pending", // Replace with actual status
    };
}
