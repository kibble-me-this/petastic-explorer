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

export function useGetOrders(account_id, { page = 1, limit = 200, enabled = true } = {}) {
    const { data, isLoading, error } = useSWR(
        enabled && account_id ? [URL, { account_id, page, limit }] : null,
        () => fetcherANYML([URL.list, { account_id, page, limit }]),
        options
    );

    const memoizedValue = useMemo(() => ({
        orders: data?.orders_v2 || [],
        order_account_id: data?.account_id || '',
        isLoading,
        error,
        pagination: data?.pagination || {},
        isEmpty: !isLoading && !data?.orders_v2?.length,
    }), [data, error, isLoading]);

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createOrderV2(orderData) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await postRequestANYML(URL.createOrderV2, orderData, config);

        await mutate([URL.list, {}]);

        await sendOrderConfirmationEmail(response);

        return response;
    } catch (error) {
        console.error('Error creating order with createOrderV2:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------

// export async function createOrder(eventData) {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     };

//     const { items, billing: zincShippingAddress, subTotal: zincOrderTotal, accountID: account_id, userEmail } = eventData;

//     const zincItems = items.map((item) => ({
//         product_id: item.id,
//         quantity: item.quantity,
//         seller_selection_criteria: {
//             prime: true,
//             marketplace: true,
//             handling_days_max: 25,
//             max_days: 25,
//         }
//     }));

//     try {
//         // Generate UUID for the order
//         const order_id = uuidv4();

//         const zincWebhooks = {
//             account_id,
//             order_id
//         };

//         const result = await placeZincOrder(zincItems, zincShippingAddress, zincOrderTotal, zincWebhooks);

//         // Create the formatted order object
//         const formattedOrder = formatOrder(eventData, result, order_id, userEmail);

//         const thisOrder = {
//             shelter_id: account_id,
//             new_order: { ...formattedOrder }
//         };

//         await postRequestANYML(URL.create, thisOrder, config);

//         // Update the SWR cache
//         mutate(URL, currentData => {
//             const orders = currentData?.orders ? [...currentData.orders, formattedOrder] : [formattedOrder];
//             return {
//                 ...currentData,
//                 orders,
//             };
//         }, false);

//         // Send order confirmation email
//         await sendOrderConfirmationEmail(formattedOrder);

//         return formattedOrder;
//     } catch (error) {
//         console.error('Error creating order:', error);
//         throw error;
//     }
// }

// // Function to format the order object
// function formatOrder(eventData, result, order_id, userEmail) {
//     return {
//         id: order_id, // Use generated UUID
//         orderNumber: result.request_id, // Assume request_id from Zinc API result
//         createdAt: new Date().toISOString(), // Use current date-time for createdAt
//         taxes: "0", // Example value for taxes, replace with actual value if available
//         items: eventData.items.map(item => ({
//             id: item.id,
//             coverUrl: item.originalCoverUrl,
//             name: item.name || item.brand, // Assuming 'name' might be missing, fallback to 'brand'
//             price: item.price,
//             quantity: item.quantity,
//             sku: item.id,
//         })),
//         customer: {
//             id: eventData.billing.id, // Use customer ID from billing
//             name: eventData.billing.name, // Customer name
//             email: userEmail, // Add email from eventData
//             avatarUrl: eventData.billing.avatarUrl || '', // Assuming avatarUrl might be added in billing
//             ipAddress: eventData.billing.ipAddress || '', // Assuming ipAddress might be added in billing
//         },
//         history: {
//             orderTime: new Date().toISOString(), // Example value for orderTime
//             paymentTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Example value for paymentTime
//             deliveryTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Example value for deliveryTime
//             completionTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // Example value for completionTime
//             timeline: [
//                 {
//                     title: "Order has been created",
//                     time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
//                 },
//                 {
//                     title: "The shipping unit has picked up the goods",
//                     time: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
//                 },
//                 {
//                     title: "Transporting to [1]",
//                     time: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
//                 },
//                 {
//                     title: "Transporting to [2]",
//                     time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
//                 },
//                 {
//                     title: "Delivery successful",
//                     time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
//                 },
//             ],
//         },
//         subTotal: eventData.subTotal,
//         shipping: eventData.shipping || "0", // Replace with actual shipping cost
//         discount: eventData.discount || "0", // Replace with actual discount
//         totalAmount: eventData.total || "0", // Use total from eventData
//         totalQuantity: eventData.items.reduce((total, item) => total + item.quantity, 0),
//         shippingAddress: {
//             fullAddress: eventData.billing.fullAddress,
//             phoneNumber: eventData.billing.phoneNumber, // Replace with actual phone number
//         },
//         delivery: {
//             shipBy: eventData.delivery?.shipBy || "Amazon Shipping", // Replace with actual shipping company
//             speedy: eventData.delivery?.speedy || "Prime", // Replace with actual shipping speed
//             trackingNumber: eventData.delivery?.trackingNumber || "Awaiting Tracking Number", // Replace with actual tracking number
//         },
//         payment: {
//             cardType: eventData.payment?.cardType || "Kibble Rewards", // Replace with actual card type*****************
//             cardNumber: eventData.payment?.cardNumber || "**** **** **** 5678", // Replace with actual card number*****************
//         },
//         status: eventData.status || "Pending", // Replace with actual status*****************
//     };
// }

// Function to send an order confirmation email using EmailJS
export async function sendOrderConfirmationEmail(orderDetails = {}) {
    const retry_order = process.env.REACT_APP_RETRY_ORDER === 'true';

    // Ensure that `orderDetails` has valid data before destructuring
    if (!orderDetails || typeof orderDetails !== 'object') {
        console.error('Invalid orderDetails passed to sendOrderConfirmationEmail');
        return;
    }

    // Destructure the necessary fields from the `orderDetails` object with explicit checks
    const {
        id = orderDetails.id || 'N/A',
        zinc_order_id = orderDetails.zinc_order_id || 'N/A',
        status = orderDetails.status || 'Pending',
        createdAt = orderDetails.createdAt || new Date().toISOString(),
        customer = orderDetails.customer || {},
        items = orderDetails.items || [],
        shippingAddress = orderDetails.shippingAddress || {},
        billingAddress = orderDetails.billingAddress || {},
        subTotal = orderDetails.subTotal || 0,
        totalAmount = orderDetails.totalAmount || 0,
        taxTotal = orderDetails.taxTotal || 0,
        shippingCost = orderDetails.shippingCost || 0,
        discount = orderDetails.discount || 0,
    } = orderDetails.orderDetails;

    // Fallbacks for customer information
    const customerName = `${customer.firstName || 'First'} ${customer.lastName || 'Last'}`;
    const customerEmail = customer.email || "N/A";
    const customerPhone = customer.phone_number || "N/A";

    // Fallbacks for shipping and billing addresses
    const shippingFullAddress = `${shippingAddress?.address_line1 || "N/A"}, ${shippingAddress?.city || "N/A"}, ${shippingAddress?.state || "N/A"}, ${shippingAddress?.zip_code || "N/A"}, ${shippingAddress?.country || "N/A"}`;
    const billingFullAddress = `${billingAddress?.address_line1 || "N/A"}, ${billingAddress?.city || "N/A"}, ${billingAddress?.state || "N/A"}, ${billingAddress?.zip_code || "N/A"}, ${billingAddress?.country || "N/A"}`;

    // Construct the email template parameters using property shorthand
    const templateParams = {
        to_email: retry_order ? "carlos@petastic.com" : customerEmail,
        from_name: customerName,
        order_id: id,
        zinc_order_id,
        order_status: status,
        order_date: new Date(createdAt).toLocaleDateString(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items_list: `<ul>${items.map(item =>
            `<li>Product ID: ${item.product_id}, Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}</li>`
        ).join('')}</ul>`,
        order_subtotal: `$${parseFloat(subTotal).toFixed(2)}`,
        order_discount: `$${parseFloat(discount).toFixed(2)}`,
        order_total: `$${parseFloat(totalAmount).toFixed(2)}`,
        order_tax: `$${parseFloat(taxTotal).toFixed(2)}`,
        order_shipping: `$${parseFloat(shippingCost).toFixed(2)}`,
        total: `$${parseFloat(totalAmount).toFixed(2)}`,
        payment_method: "Kibble Rewards",
        shipping_address: `<p>${shippingFullAddress}</p>`,
        billing_address: `<p>${billingFullAddress}</p>`,
        bcc_emails: retry_order ? "" : "carlos@petastic.com, adena@petastic.com, josh@petastic.com"
    };

    try {
        const result = await emailjs.send(
            'service_2nw5qla',  // Replace with your service ID
            'template_rz5namd',  // Replace with your template ID
            templateParams,      // Template parameters
            'xdL7DKBOnhX6fRDbJ'  // Replace with your user ID
        );

        console.log(result.text);
    } catch (error) {
        console.log(error.text);
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

export async function retryOrder(shelterId, orderId) {

    const orderData = {
        shelter_id: shelterId,
        order_id: orderId,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        // Make the POST request to retry the order
        const response = await postRequestANYML(URL.retry, orderData, config);

        // Update the order list cache after the retry
        await mutate([URL.list, {}]);

        // Return the response
        return response;
    } catch (error) {
        console.error('Error retrying order:', error);
        throw error;
    }
}

