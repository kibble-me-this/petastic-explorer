const getLocalStorageKey = (userId) => `productsCache-${userId}`;
const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;

const getCacheFlag = (userId) => localStorage.getItem(getCacheFlagKey(userId)) === 'true';
const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

const fetcherWithLocalStorage = async (userId, fetcherFunction, fetcherArgs) => {
    console.log('Fetching data for userId:', userId);

    if (!fetcherArgs || fetcherArgs.length === 0) {
        console.warn('No fetcher arguments provided');
        return [];
    }

    const cachedData = localStorage.getItem(getLocalStorageKey(userId));
    const cacheFlag = getCacheFlag(userId);

    if (cachedData && !cacheFlag) {
        console.log('Returning cached data');
        return JSON.parse(cachedData);
    }

    try {
        const data = await fetcherFunction(...fetcherArgs);

        console.log('Setting updated data to localStorage');
        localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(data));
        setCacheFlag(userId, false);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { getCacheFlagKey, setCacheFlag, fetcherWithLocalStorage };
