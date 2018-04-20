const writeFileSync = require('fs').writeFileSync;

// fixed values - for now we only need this for production build
const isProd = true;
const environment = 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;

const envConfigFile = `
export const environment = {
    production: ${isProd},
    apiBaseUrl: '/api'
};

export const authConfig = {
    clientID: '${process.env.AUTH_CLIENT_ID}',
    domain: '${process.env.AUTH_DOMAIN}',
    callbackURL: '${process.env.AUTH_CALLBACK_URL}',
    whitelistedDomains: ['${process.env.AUTH_WHITELISTED_DOMAIN}']
};
`;

try {
    writeFileSync(targetPath, envConfigFile, 'utf8');
    console.log(`Output generated at ${targetPath}`);
}
catch
    (error) {
    console.log(err);
}

