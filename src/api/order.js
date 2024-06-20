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
        // Generate UUID for the order
        const order_id = uuidv4();

        const zincWebhooks = {
            account_id,
            order_id
        };

        const result = await placeZincOrder(zincItems, zincShippingAddress, zincOrderTotal, zincWebhooks);

        // Create the formatted order object
        const formattedOrder = formatOrder(eventData, result, order_id);

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

function formatOrder(eventData, result, order_id) {
    return {
        id: order_id, // Use generated UUID
        orderNumber: result.request_id, // Assume request_id from Zinc API result
        createdAt: new Date().toISOString(), // Use current date-time for createdAt
        taxes: "10", // Example value for taxes, replace with actual value if available
        items: eventData.items.map(item => ({
            id: item.id,
            coverUrl: item.originalCoverUrl,
            name: item.name || item.brand, // Assuming 'name' might be missing, fallback to 'brand'
            price: item.priceSale,
            quantity: item.quantity,
            sku: item.id,
        })),
        customer: {
            id: eventData.billing.id, // Use customer ID from billing
            name: eventData.billing.name, // Customer name
            email: eventData.billing.email || '', // Assuming email might be added in billing
            avatarUrl: eventData.billing.avatarUrl || '', // Assuming avatarUrl might be added in billing
            ipAddress: eventData.billing.ipAddress || '', // Assuming ipAddress might be added in billing
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
        totalAmount: eventData.total || 474.15, // Use total from eventData
        totalQuantity: eventData.items.reduce((total, item) => total + item.quantity, 0),
        shippingAddress: {
            fullAddress: eventData.billing.fullAddress,
            phoneNumber: eventData.billing.phoneNumber, // Replace with actual phone number
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
