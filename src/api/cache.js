const getLocalStorageKey = (userId) => `productsCache-${userId}`;
const getCacheFlagKey = (userId) => `newProductsAvail-${userId}`;

const getCacheFlag = (userId) => localStorage.getItem(getCacheFlagKey(userId)) === 'true';
const setCacheFlag = (userId, flag) => localStorage.setItem(getCacheFlagKey(userId), flag.toString());

const getVersionKey = (userId) => localStorage.getItem(`version-${userId}`);
const setVersionKey = (userId, version) => localStorage.setItem(`version-${userId}`, version);

const fetcherWithLocalStorage = async (userId, fetcherFunction, fetcherArgs, version) => {
    console.log('Fetching data for userId:', userId);

    if (!fetcherArgs || fetcherArgs.length === 0) {
        console.warn('No fetcher arguments provided');
        return [];
    }

    const cachedData = localStorage.getItem(getLocalStorageKey(userId));
    const cacheFlag = getCacheFlag(userId);
    const localVersion = getVersionKey(userId);

    // Determine if the cache flag should be set
    if (!localVersion) {
        setCacheFlag(userId, true);
    } else if (localVersion < version) {
        setCacheFlag(userId, true);
    } else {
        setCacheFlag(userId, false);
    }

    // Check if cached data is valid
    if (cachedData && !cacheFlag && localVersion === version) {
        console.log('Returning cached data');
        return JSON.parse(cachedData);
    }

    try {
        const data = await fetcherFunction(...fetcherArgs);

        console.log('Setting updated data to localStorage');
        localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(data));
        setCacheFlag(userId, false); // Data is now up-to-date
        setVersionKey(userId, version);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


export {
    getCacheFlagKey,
    setCacheFlag,
    getVersionKey,
    setVersionKey,
    fetcherWithLocalStorage
};