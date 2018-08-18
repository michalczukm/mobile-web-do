import * as dotenv from 'dotenv';

export type EnvironmentConfig = {
    serverPort: string,
    dbHost: string,
    isProd: boolean,
    auth: {
        jwksUri: string,
        issuer: string
    },
    presentation: {
        hostUrl: string
    }
};

export const environmentConfig = ((): EnvironmentConfig => {
    const getDbHost = () => process.env.DB_HOST;
    const getNodeEnv = () => process.env.NODE_ENV;

    const variablesAreSetInEnv = () => !!getDbHost() && !!getNodeEnv();

    if (!variablesAreSetInEnv()) {
        // setup `process.env` variables from '.env' file
        console.log('### used dotenv configuration ###');
        dotenv.config();
    }

    return {
        serverPort: process.env.PORT,
        dbHost: getDbHost(),
        isProd: getNodeEnv() === 'production',
        auth: {
            jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`,
            issuer: `https://${process.env.AUTH_DOMAIN}/`
        },
        presentation: {
            hostUrl: process.env.PRESENTATION_HOST_URL
        }
    };
})();
