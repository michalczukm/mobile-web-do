const isInObject = (object, ...keys) => keys.every(key => key in object);

const humanReadableByKeys = (value, ...keys) =>
    value instanceof Object && isInObject(value, ...keys)
        ? keys.map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '').join(',')
        : value;

export const rotation = value => humanReadableByKeys(value, 'alpha', 'beta', 'gamma');
