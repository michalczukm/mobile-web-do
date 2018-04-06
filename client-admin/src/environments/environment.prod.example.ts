/**
 * this is an example file. `environment.x.ts` is not versioned.
 * if you're developing locally, don't want to set env variables nor use docker
 * please copy this file and create new one called same, but without `.example`, you can emulate all env vars as below
 * !! DO NOT REMOVE THIS FILE
 */
export const environment = {
    production: true,
    apiBaseUrl: '/api'
};

export const authConfig = {
    clientID: 'AUTH_0_CLIENT_ID',
    domain: 'AUTH_0_DOMAIN f.e. my-comain.auth0.com',
    callbackURL: 'APP_CALLBACK_URL_WITH_PROTOCOL'
};
