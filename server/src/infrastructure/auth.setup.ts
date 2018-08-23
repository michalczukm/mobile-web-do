import * as Hapi from 'hapi';
import * as jwksRsa from 'jwks-rsa';
import { EnvironmentConfig } from './environment-config';

type DecodedAuth0JwtToken = {
    sub: string,
    aud: string[],
    iat: number,
    exp: number,
    azp: string,
    scope?: string
};

const validateUser = async (decoded: DecodedAuth0JwtToken | null) => {
    if (decoded && decoded.sub) {
        return decoded.scope
            ? {
                isValid: true,
                credentials: {
                    scope: decoded.scope.split(' ')
                }
            }
            : { isValid: true };
    }

    return { isValid: false };
};

export const authSetup = (server: Hapi.Server, env: EnvironmentConfig): void => {
    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        key: jwksRsa.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 20,
            jwksUri: env.auth.jwksUri
        }),
        verifyOptions: {
            audience: '/admin',
            issuer: env.auth.issuer,
            algorithms: ['RS256']
        },
        validate: validateUser
    });
};
