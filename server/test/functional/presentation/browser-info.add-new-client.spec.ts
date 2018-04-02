import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';
import {integrationTestsSetupBuilder, TestsSetup} from '../functional-tests-utils';

describe('browser info: add new client', () => {
    let server: Hapi.Server;
    let testSetup: TestsSetup;

    before(async () => {
        testSetup = integrationTestsSetupBuilder.withStandardSetup();
        server = new Hapi.Server();
        await startServer(server).then(testSetup.setup);
    });

    after(async () => {
        try {
            await testSetup.tearDown();
        } finally {
            server.stop();
        }
    });

    it('should add browser info for correct data', async () => {
        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        expect(actual.statusCode).to.equal(200);
    });

    it('should return client 404 error for non existing session', async () => {
        const nonExistingSessionId = '123123123';

        const actual = await server.inject({
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

        expect(actual.statusCode).to.equal(404);
    });

    it('should return client 400 error for non browser info without sessionId', async () => {
        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                browserInfo: {
                    window: {},
                    navigator: {}
                }
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    it('should return client 400 error for non browser info without navigator', async () => {
        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionIdFeatureState,
                browserInfo: {
                    window: {}
                }
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    it('should return client 400 error for non browser info without window', async () => {
        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionIdFeatureState,
                browserInfo: {
                    navigator: {}
                }
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    it('should set client cookie `client-id` as unique value', async () => {
        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        expect(actual.headers['set-cookie'][0]).to.have.string('client-id=');
    });

    it('should not set cookie `client-id` if it exists in request', async () => {
        const fixedClientIdCookie = `client-id=ImExNDQ5ZGY3LTIyNDQtNGRmMy1hYzQxLThhZTFiYzhmYmNiMCI=`;
        const expected = `${fixedClientIdCookie}; HttpOnly`;

        const actual = await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload(),
            headers: {
                Cookie: fixedClientIdCookie
            }
        });

        expect(actual.statusCode).to.equal(200);
        // tslint:disable-next-line:no-unused-expression
        expect(actual.headers['set-cookie'][0]).equal(expected);
    });
});

const buildCorrectPayload = (): Object => (
    {
        sessionId: testConstants.sessionIdFeatureState,
        browserInfo: {
            navigator: {},
            window: {}
        }
    });
