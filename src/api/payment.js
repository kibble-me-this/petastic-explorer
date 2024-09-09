import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcherPayment, patchRequestANYML, postRequestPayment, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.payment;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetPaymentMethods({ userId }) {
    const { data, error } = useSWR(
        userId ? `${URL.list}?userId=${userId}` : null,
        fetcherPayment,
        options
    );

    const memoizedValue = useMemo(() => ({
        paymentMethods: data?.paymentMethods || [],
        isLoading: !data && !error,
        error,
        isEmpty: !data?.paymentMethods?.length,
    }), [data, error]);

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createPaymentMethod(userId, paymentMethodData) {
    const url = `${URL.createPaymentMethod}`;

    const payload = {
        pid: userId,
        ...paymentMethodData,
    };

    const response = await postRequestPayment(url, payload);

    await mutate([`${URL.list}`, { userId }]);

    return response;
}


// ----------------------------------------------------------------------

export async function updatePaymentMethod(paymentMethodId, updateFields) {
    const url = `${URL.updatePaymentMethod}?paymentMethodId=${paymentMethodId}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'JpAhKqiM498kGOEASeJyqPeDcX45JH086RIHTlYh',  // Add API key here from environment variables
        },
    };

    try {
        const response = await patchRequestANYML(url, updateFields, config);

        // Optimistically update the list of payment methods
        await mutate([`${URL.list}`, {}]);

        return response;
    } catch (error) {
        throw new Error(error.message || 'Failed to update payment method');
    }
}

