import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcherANYML, postRequestANYML, endpoints } from 'src/utils/axios';
import emailjs from '@emailjs/browser';
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

    const { items, billing: zincShippingAddress, subTotal: zincOrderTotal, accountID: account_id, userEmail } = eventData;

    const zincItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        seller_selection_criteria: {
            prime: true,
            marketplace: true,
            handling_days_max: 20,
            max_days: 20,
        }
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
        const formattedOrder = formatOrder(eventData, result, order_id, userEmail);

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

        // Send order confirmation email
        await sendOrderConfirmationEmail(formattedOrder);

        return formattedOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Function to format the order object
function formatOrder(eventData, result, order_id, userEmail) {
    return {
        id: order_id, // Use generated UUID
        orderNumber: result.request_id, // Assume request_id from Zinc API result
        createdAt: new Date().toISOString(), // Use current date-time for createdAt
        taxes: "0", // Example value for taxes, replace with actual value if available
        items: eventData.items.map(item => ({
            id: item.id,
            coverUrl: item.originalCoverUrl,
            name: item.name || item.brand, // Assuming 'name' might be missing, fallback to 'brand'
            price: item.price,
            quantity: item.quantity,
            sku: item.id,
        })),
        customer: {
            id: eventData.billing.id, // Use customer ID from billing
            name: eventData.billing.name, // Customer name
            email: userEmail, // Add email from eventData
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
        shipping: eventData.shipping || "0", // Replace with actual shipping cost
        discount: eventData.discount || "0", // Replace with actual discount
        totalAmount: eventData.total || "0", // Use total from eventData
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
            cardType: eventData.payment?.cardType || "Kibble Rewards", // Replace with actual card type*****************
            cardNumber: eventData.payment?.cardNumber || "**** **** **** 5678", // Replace with actual card number*****************
        },
        status: eventData.status || "Pending", // Replace with actual status*****************
    };
}

// Function to send an order confirmation email using EmailJS
export async function sendOrderConfirmationEmail(orderDetails) {
    const retry_order = process.env.REACT_APP_RETRY_ORDER === 'true';

    const {
        id,
        status,
        createdAt,
        customer = {},
        items = [],
        shippingAddress = {},
        payment = {},
        subTotal,
        taxTotal,
        shippingCost,
        discount = 0,
        totalAmount,
        delivery = {},
    } = orderDetails;

    // Determine the to_email and bcc_emails based on the retry_order flag
    const toEmail = retry_order ? "carlos@petastic.com" : (customer.email || "carlos@petastic.com");
    const bccEmails = retry_order ? "" : "carlos@petastic.com, adena@petastic.com, josh@petastic.com";

    // Construct the email template parameters
    const templateParams = {
        to_email: toEmail,
        from_name: customer.name || "Customer",
        order_id: id || "N/A",
        order_status: status || "Pending",
        order_date: new Date(createdAt).toLocaleDateString() || "N/A",
        customer_name: customer.name || "Customer",
        customer_email: customer.email || "N/A",
        customer_phone: customer.phoneNumber || "N/A",
        items_list: `<ul>${items.map(item => `<li>Product ID: ${item.id}, Name: ${item.name || "N/A"}, (Quantity: ${item.quantity}) - $${item.price.toFixed(2)}</li>`).join('')}</ul>`,
        order_subtotal: `$${parseFloat(subTotal).toFixed(2) || "0.00"}`,
        order_discount: `$${parseFloat(discount).toFixed(2) || "0.00"}`,
        order_total: `$${parseFloat(subTotal).toFixed(2) || "0.00"}`,
        order_tax: `$${parseFloat(taxTotal).toFixed(2) || "0.00"}`,
        order_shipping: `$${parseFloat(shippingCost).toFixed(2) || "0.00"}`,
        total: `$${parseFloat(totalAmount).toFixed(2) || "0.00"}`,
        payment_method: payment.cardType || "N/A",
        shipping_method: delivery.speedy || "N/A",
        estimated_delivery: delivery.estimatedDelivery || "Pending",
        shipping_address: `<p>Name: ${shippingAddress.fullAddress || "N/A"}<br></p>`,
        bcc_emails: bccEmails // Adjust bcc_emails based on the retry_order flag
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
