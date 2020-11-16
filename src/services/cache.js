export const caches = {};

export const KEYS = {
  PoolConfig: 'pool-configs',
  PoolUserData: (paymentAddress) => `pool-data-${paymentAddress}`,
  PoolHistory: (paymentAddress) => `pool-history-${paymentAddress}`,
  DAppAddress: 'dapp-address',
  FeatureConfigs: 'feature-configs',
};

/**
 * Cache data
 * @param key
 * @param data
 * @param expiredTime
 */
export function cache(key, data, expiredTime) {
  caches[key] = {
    data: data,
    expiredTime: new Date().getTime() + expiredTime,
  };
}

/**
 *
 * @param {string} key should be a key of KEYS dictionary above
 * @param {function} promiseFunc
 * @param {number} expiredTime in ms
 * @returns {Promise<*>}
 */
export async function cachePromise(key, promiseFunc, expiredTime = 40000) {
  const cachedData = getCache(key);

  if (cachedData !== null) {
    return cachedData;
  }

  const data = await promiseFunc();
  cache(key, data, expiredTime);

  return data;
}

/**
 * Get cache data
 * @param key
 * @returns {null|*}
 */
export function getCache(key) {
  const cacheData = caches[key];

  if (cacheData && cacheData.expiredTime > new Date().getTime()) {
    return cacheData.data;
  }

  return null;
}

/**
 * @param key
 */

export const clearCache = (key) => {
  if (!caches[key]) {
    return;
  }
  return delete caches[key];
};

export const clearAllCaches = () => {
  Object.keys(caches)
    .forEach(key => delete caches[key]);
};
