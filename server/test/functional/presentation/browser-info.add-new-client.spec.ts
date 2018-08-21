import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import setupServer from '../../../src/server'
import seedConstants from '../../../src/infrastructure/db-seeds/seed.constants';
import {integrationTestsSetupBuilder, TestsSetup} from '../functional-tests-utils';

describe('browser info: add new client', function(): void {
    let server: Hapi.Server;

    const testSetup: TestsSetup = integrationTestsSetupBuilder.withStandardSetup();
    before(async () => {
        server = await setupServer();
        await testSetup.setup();
        await server.start();
    });

    after(async () => {
        try {
            await testSetup.tearDown();
        } finally {
            await server.stop();
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
                sessionId: seedConstants.sessionIdFeatureState,
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
                sessionId: seedConstants.sessionIdFeatureState,
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
        sessionId: seedConstants.sessionIdFeatureState,
        browserInfo: {
            navigator: {},
            window: {}
        }
    });
