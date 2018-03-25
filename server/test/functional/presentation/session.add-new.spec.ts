import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

import startServer from '../../../src/server'

describe('session: add new', () => {
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

    it('should add new session', async () => {
        // arrange
        const baseSessionAmount = getSessionsAmount(await callForSessions(server));
        const expected = baseSessionAmount + 1;

        // act
        await server.inject({
            method: 'POST',
            url: `/api/sessions`,
            payload: {
                name: 'test session'
            }
        });

        // assert
        const actualSessionAmount = getSessionsAmount(await callForSessions(server));

        expect(actualSessionAmount).to.equal(expected);
    });

    it('should allow adding sessions with same name', async () => {
        // arrange
        const baseSessionAmount = getSessionsAmount(await callForSessions(server));
        const expected = baseSessionAmount + 2;

        // act
        await server.inject({
            method: 'POST',
            url: `/api/sessions`,
            payload: {
                name: 'another test session'
            }
        });

        await server.inject({
            method: 'POST',
            url: `/api/sessions`,
            payload: {
                name: 'another test session'
            }
        });

        // assert
        const actualSessionAmount = getSessionsAmount(await callForSessions(server));
        expect(actualSessionAmount).to.equal(expected);
    });
});

const callForSessions = (server: Hapi.Server) => server.inject({
    method: 'GET',
    url: '/api/sessions'
});

const getSessionsAmount = (response: Hapi.InjectedResponseObject) => (response.result as any[]).length;
