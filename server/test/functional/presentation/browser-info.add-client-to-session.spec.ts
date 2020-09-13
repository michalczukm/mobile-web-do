import 'mocha';
import { expect } from 'chai';
import * as Hapi from '@hapi/hapi';
import setupServer from '../../../src/server'
import { seedConstants } from '../../../src/infrastructure/db-seeds/seed.constants';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('browser info: add client to session', function (): void {
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

    it('should add new client to the session results', async () => {
        // arrange
        const baseClientsQuantity = getClientsQuantity(await callForSessionResults(server));

        // act
        await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        // assert
        const actualClientsQuantity = getClientsQuantity(await callForSessionResults(server));
        expect(actualClientsQuantity).to.equal(baseClientsQuantity + 1);
    });

    it('should add multiple new clients to the session results', async () => {
        // arrange
        const baseClientsQuantity = getClientsQuantity(await callForSessionResults(server));
        const expected = baseClientsQuantity + 2;

        // act
        await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload()
        });

        // assert
        const actualClientsQuantity = getClientsQuantity(await callForSessionResults(server));
        expect(actualClientsQuantity).to.equal(expected);
    });

    it('should not add new client to the session results if already existing', async () => {
        // arrange
        const fixedClientIdCookie = 'client-id=ImExNDQ5ZGY3LTIyNDQtNGRmMy1hYzQxLThhZTFiYzhmYmNiMCI=';
        const baseClientsQuantity = getClientsQuantity(await callForSessionResults(server));
        const expected = baseClientsQuantity + 1;

        // act
        await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload(),
            headers: {
                Cookie: fixedClientIdCookie
            }
        });

        await server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: buildCorrectPayload(),
            headers: {
                Cookie: fixedClientIdCookie
            }
        });

        // assert
        const actualClientsQuantity = getClientsQuantity(await callForSessionResults(server));
        expect(actualClientsQuantity).to.equal(expected);
    });
});

const callForSessionResults = (server: Hapi.Server) => server.inject({
    method: 'GET',
    url: `/api/sessions/${seedConstants.sessionIdFeatureState}/results`,
});

const getClientsQuantity = (response: Hapi.ServerInjectResponse) => (response.result as any).clientsQuantity;

const buildCorrectPayload = (): Object => (
    {
        sessionId: seedConstants.sessionIdFeatureState,
        browserInfo: {
            navigator: {},
            window: {}
        }
    });
