import * as dotenv from 'dotenv';

export type EnvironmentConfig = {
    serverPort: number,
    dbHost: string,
    isProd: boolean,
    auth: {
        jwksUri: string,
        issuer: string
    },
    presentation: {
        hostUrl: string
    },
    corsSetup: boolean | {}
};

export const environmentConfig = ((): EnvironmentConfig => {
    const getDbHost = () => process.env.DB_CONNECTION_STRING as string;
    const getNodeEnv = () => process.env.NODE_ENV as string;

    const variablesAreSetInEnv = () => !!getDbHost() && !!getNodeEnv();

    if (!variablesAreSetInEnv()) {
        // setup `process.env` variables from '.env' file
        console.log('### used dotenv configuration ###');
        dotenv.config();
    }

    const isProd = getNodeEnv() === 'production';
    const corsSetup = isProd
        ? false
        : {
            origin: ['*'],
            credentials: true
        };

    return {
        serverPort: +(process.env.PORT || 5050),
        dbHost: getDbHost(),
        isProd,
        auth: {
            jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`,
            issuer: `https://${process.env.AUTH_DOMAIN}/`
        },
        presentation: {
            hostUrl: process.env.PRESENTATION_HOST_URL as string
        },
        corsSetup
    };
})();
