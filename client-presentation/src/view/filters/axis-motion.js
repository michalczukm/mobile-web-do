export const axisMotion = value =>
    ['x', 'y', 'z'].map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '').join(',');
