import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';
import startServer from '../../../src/server'
import testConstants from '../tests.constants';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('browser info: add client to session', () => {
    let server: Hapi.Server;
    let testSetup: TestsSetup;

    before(async () => {
        testSetup = integrationTestsSetupBuilder.withStandardSetup();
        server = new Hapi.Server();
        await (startServer(server).then(testSetup.setup));
    });

    after(async () => {
        try {
            await testSetup.tearDown();
        } finally {
            server.stop();
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
    url: `/api/sessions/${testConstants.sessionIdFeatureState}/results`,
    payload: buildCorrectPayload(),
});

const getClientsQuantity = (response: Hapi.InjectedResponseObject) => (response.result as any).clientsQuantity;

const buildCorrectPayload = (): Object => (
    {
        sessionId: testConstants.sessionIdFeatureState,
        browserInfo: {
            navigator: {},
            window: {}
        }
    });
