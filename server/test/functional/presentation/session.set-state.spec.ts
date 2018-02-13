import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';

describe('session: set state', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    after(() => server.stop());

    ['WELCOME', 'FEATURE', 'SUMMARY', 'CLOSED'].forEach(state => {
        it(`should set new session "${state}" state`, async () => {
            // arrange
            const sessionId = testConstants.sessionIdFeatureState;
            const callGetSessionState = () => server.inject({
                method: 'GET',
                url: `/api/sessions/${sessionId}`,
            }).then(response => (response.result as any).state);
            const expected = state;

            // act
            await server.inject({
                method: 'PUT',
                url: `/api/sessions/${sessionId}/state`,
                payload: {
                    state: state
                }
            });

            // assert
            const actualSessionState = await callGetSessionState();
            expect(actualSessionState).to.equal(expected);
        });
    });

    it('should return client 400 error for non existing session', async () => {
        const nonExistingSessionId = '123123123';

        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${nonExistingSessionId}/state`
        });

        expect(actual.statusCode).to.equal(400);
    });
});
