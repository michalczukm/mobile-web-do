import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';

describe('session: add new', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    after(() => server.stop());

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
                name: 'test session'
            }
        });

        await server.inject({
            method: 'POST',
            url: `/api/sessions`,
            payload: {
                name: 'another test session with different name'
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

const getSessionsAmount = (response: Hapi.InjectedResponseObject) => (response.result as any[]).length
