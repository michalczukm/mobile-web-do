export const makeExampleId = identifier => `${identifier}-example-in-browser`;
export const isInObject = (object, ...keys) => keys.every(key => key in object);

export const humanReadableByKeys = (value, ...keys) =>
    value instanceof Object && isInObject(value, ...keys)
        ? keys.map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '').join(',')
        : value;
