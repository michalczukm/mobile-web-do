import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';

describe('browser info', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    it('should add browser info for correct data', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        expect(response.statusCode).to.equal(200);
    });

    it('should return client 404 error for non existing session', async () => {
        const nonExistingSessionId = '123123123';
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: nonExistingSessionId,
                browserInfo: {
                    navigator: {},
                    window: {}
                }
            }
        });

        expect(response.statusCode).to.equal(404);
    });

    it('should return client 400 error for non browser info without sessionId', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                browserInfo: {
                    window: {},
                    navigator: {}
                }
            }
        });

        expect(response.statusCode).to.equal(400);
    });

    it('should return client 400 error for non browser info without navigator', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionId,
                browserInfo: {
                    window: {}
                }
            }
        });

        expect(response.statusCode).to.equal(400);
    });

    it('should return client 400 error for non browser info without window', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionId,
                browserInfo: {
                    navigator: {}
                }
            }
        });

        expect(response.statusCode).to.equal(400);
    });

    it('should set client cookie `client-id` as unique value', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        expect(response.headers['set-cookie'][0]).to.have.string('client-id=');
    });

    after(() => server.stop());
});

function buildCorrectPayload(): Object {
    return {
        sessionId: testConstants.sessionId,
        browserInfo: {
            navigator: {},
            window: {}
        }
    };
}
