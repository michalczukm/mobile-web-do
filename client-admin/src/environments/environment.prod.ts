export const environment = {
    production: true,
    apiBaseUrl: '/api'
};

export const authConfig = {
    clientID: process.env.AUTH_CLIENT_ID,
    domain: process.env.AUTH_DOMAIN,
    callbackURL: process.env.AUTH_CALLBACK_URL
};
