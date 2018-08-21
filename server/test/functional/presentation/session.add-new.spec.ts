import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

import setupServer from '../../../src/server'

describe('session: add new', function (): void {
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

    it('should return 200 for new session added', async () => {
        // act
        const actual = await server.inject({
            method: 'POST',
            url: `/api/sessions`,
            payload: {
                name: 'test session'
            }
        });

        // assert
        expect(actual.statusCode).to.equal(200);
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
