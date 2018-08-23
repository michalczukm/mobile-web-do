const fs = require('fs');
const path = require('path');

// fixed values - for now we only need this for production build
const isProd = true;
const environment = 'prod';

const baseEnvPath = path.join(__dirname, '../src/environments');

const createDefaultEnvironmentIfNotExist = () => {
    const defaultEnvironmentPath = path.join(baseEnvPath,`environment.ts`);
    if (!fs.existsSync(defaultEnvironmentPath)) {
        fs.writeFileSync(defaultEnvironmentPath, '', 'utf8');
    }
};

/**
 *  API url has to exact match with whitelisted domain. (even if ui is served the same server)
 *  Its auth0 binder issue.
 *  It also implies that we're only whitelisting our API
 */
const envConfigFile = `
export const environment = {
    production: ${isProd},
    apiBaseUrl: 'http://${process.env.AUTH_WHITELISTED_DOMAIN}/api'
};

export const authConfig = {
    clientID: '${process.env.AUTH_CLIENT_ID}',
    domain: '${process.env.AUTH_DOMAIN}',
    callbackURL: '${process.env.AUTH_CALLBACK_URL}',
    whitelistedDomains: ['${process.env.AUTH_WHITELISTED_DOMAIN}']
};
`;

console.log('Admin BUILD debug', '------------- envConfigFile:', envConfigFile);

try {
    createDefaultEnvironmentIfNotExist();

    const targetPath = path.join(baseEnvPath,`environment.${environment}.ts`);
    fs.writeFileSync(targetPath, envConfigFile, 'utf8');
    console.log(`Output generated at ${targetPath}`);
}
catch
    (error) {
    console.log(error);
}

